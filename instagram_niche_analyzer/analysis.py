"""Aggregate analysis over cached business_discovery data.

Everything here operates on the pooled dataset across all accounts --
per-account identity is retained only in the row-level DataFrame (used for
data.csv); every aggregate/report figure is a cross-account statistic.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any
from zoneinfo import ZoneInfo

import numpy as np
import pandas as pd

NY_TZ = ZoneInfo("America/New_York")
HASHTAG_RE = re.compile(r"(?<!\w)#\w+")
LIST_FIRST_LINE_RE = re.compile(r"^\s*(?:[-*•●▪]|\d+[.)])\s+")
MIN_GROUP_SIZE = 5  # ignore groups too small to be meaningful for "what to test"

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _hashtag_count(caption: str) -> int:
    return len(HASHTAG_RE.findall(caption))


def _caption_length(caption: str) -> int:
    return len(caption)


def _first_line_type(caption: str) -> str:
    first_line = caption.strip().splitlines()[0].strip() if caption.strip() else ""
    if not first_line:
        return "none"
    if LIST_FIRST_LINE_RE.match(first_line):
        return "list"
    if first_line.endswith("?"):
        return "question"
    return "statement"


def build_posts_dataframe(accounts: dict[str, dict[str, Any]]) -> pd.DataFrame:
    """Flatten {username: business_discovery dict} into one row per post."""
    rows: list[dict[str, Any]] = []

    for username, data in accounts.items():
        followers_count = data.get("followers_count") or 0
        media_items = (data.get("media") or {}).get("data", [])

        for post in media_items:
            caption = post.get("caption") or ""
            likes = post.get("like_count")
            comments = post.get("comments_count")
            timestamp_raw = post.get("timestamp")
            if timestamp_raw is None:
                continue

            timestamp_utc = pd.to_datetime(timestamp_raw, utc=True, errors="coerce")
            if pd.isna(timestamp_utc):
                continue
            timestamp_ny = timestamp_utc.tz_convert(NY_TZ)

            engagement_rate = np.nan
            if followers_count and likes is not None and comments is not None:
                engagement_rate = (likes + comments) / followers_count

            rows.append(
                {
                    "username": username,
                    "permalink": post.get("permalink"),
                    "timestamp": timestamp_utc,
                    "timestamp_ny": timestamp_ny,
                    "media_type": post.get("media_type"),
                    "media_product_type": post.get("media_product_type"),
                    "likes": likes,
                    "comments": comments,
                    "followers_count": followers_count,
                    "engagement_rate": engagement_rate,
                    "caption_length": _caption_length(caption),
                    "hashtag_count": _hashtag_count(caption),
                    "first_line_type": _first_line_type(caption),
                    "day_of_week": DAY_NAMES[timestamp_ny.dayofweek],
                    "hour_ny": timestamp_ny.hour,
                }
            )

    columns = [
        "username",
        "permalink",
        "timestamp",
        "timestamp_ny",
        "media_type",
        "media_product_type",
        "likes",
        "comments",
        "followers_count",
        "engagement_rate",
        "caption_length",
        "hashtag_count",
        "first_line_type",
        "day_of_week",
        "hour_ny",
    ]
    return pd.DataFrame(rows, columns=columns)


def _hashtag_bucket(count: int) -> str:
    if count == 0:
        return "0"
    if count <= 3:
        return "1-3"
    if count <= 10:
        return "4-10"
    return "11+"


def _caption_length_bucket(length: int) -> str:
    if length <= 50:
        return "short (<=50 chars)"
    if length <= 150:
        return "medium (51-150 chars)"
    if length <= 300:
        return "long (151-300 chars)"
    return "very long (>300 chars)"


def _hour_bucket(hour: int) -> str:
    if 5 <= hour < 11:
        return "morning (5-11am ET)"
    if 11 <= hour < 17:
        return "midday (11am-5pm ET)"
    if 17 <= hour < 21:
        return "evening (5-9pm ET)"
    return "night (9pm-5am ET)"


@dataclass
class GroupStat:
    label: str
    n: int
    median_engagement: float


@dataclass
class AnalysisResult:
    total_posts: int
    total_accounts: int
    skipped_accounts: list[str]
    overall_median_engagement: float
    by_media_type: list[GroupStat]
    by_media_product_type: list[GroupStat]
    by_first_line_type: list[GroupStat]
    by_hashtag_bucket: list[GroupStat]
    by_caption_length_bucket: list[GroupStat]
    by_hour_bucket: list[GroupStat]
    by_day_of_week: list[GroupStat]
    posts_per_week_overall: float
    posts_per_week_by_account: dict[str, float]
    caption_median_length: float
    caption_median_hashtags: float
    top_decile_posts: pd.DataFrame
    experiments: list[dict[str, Any]] = field(default_factory=list)


def _grouped_stats(df: pd.DataFrame, column: str) -> list[GroupStat]:
    stats: list[GroupStat] = []
    valid = df.dropna(subset=["engagement_rate", column])
    for label, group in valid.groupby(column):
        stats.append(GroupStat(label=str(label), n=len(group), median_engagement=group["engagement_rate"].median()))
    stats.sort(key=lambda s: s.median_engagement, reverse=True)
    return stats


def _posts_per_week_by_account(df: pd.DataFrame) -> dict[str, float]:
    result: dict[str, float] = {}
    for username, group in df.groupby("username"):
        span_days = (group["timestamp"].max() - group["timestamp"].min()).total_seconds() / 86400
        weeks = max(span_days / 7, 1 / 7)  # avoid div-by-zero for single-post accounts
        result[username] = len(group) / weeks
    return result


def _rank_experiments(overall_median: float, *named_groups: tuple[str, str, list[GroupStat]]) -> list[dict[str, Any]]:
    """Build "what to test" candidates: for each dimension, take the best
    group (with enough samples) and express its lift over the overall
    median engagement rate.
    """
    candidates: list[dict[str, Any]] = []
    for dimension_label, experiment_template, stats in named_groups:
        eligible = [s for s in stats if s.n >= MIN_GROUP_SIZE]
        if not eligible or overall_median <= 0:
            continue
        best = eligible[0]
        lift_pct = (best.median_engagement - overall_median) / overall_median * 100
        if lift_pct <= 0:
            continue
        candidates.append(
            {
                "dimension": dimension_label,
                "winner": best.label,
                "n": best.n,
                "median_engagement": best.median_engagement,
                "lift_pct": lift_pct,
                "experiment": experiment_template.format(winner=best.label),
            }
        )
    candidates.sort(key=lambda c: c["lift_pct"], reverse=True)
    return candidates


def analyze(df: pd.DataFrame, skipped_accounts: list[str]) -> AnalysisResult:
    overall_median = df["engagement_rate"].dropna().median()
    overall_median = 0.0 if pd.isna(overall_median) else float(overall_median)

    df = df.copy()
    df["hashtag_bucket"] = df["hashtag_count"].apply(_hashtag_bucket)
    df["caption_length_bucket"] = df["caption_length"].apply(_caption_length_bucket)
    df["hour_bucket"] = df["hour_ny"].apply(_hour_bucket)

    by_media_type = _grouped_stats(df, "media_type")
    by_media_product_type = _grouped_stats(df, "media_product_type")
    by_first_line_type = _grouped_stats(df, "first_line_type")
    by_hashtag_bucket = _grouped_stats(df, "hashtag_bucket")
    by_caption_length_bucket = _grouped_stats(df, "caption_length_bucket")
    by_hour_bucket = _grouped_stats(df, "hour_bucket")
    by_day_of_week = _grouped_stats(df, "day_of_week")

    per_account_ppw = _posts_per_week_by_account(df)
    posts_per_week_overall = float(np.mean(list(per_account_ppw.values()))) if per_account_ppw else 0.0

    valid_engagement = df.dropna(subset=["engagement_rate"])
    top_decile_posts = pd.DataFrame(columns=["permalink", "media_type", "caption_length", "hashtag_count"])
    if not valid_engagement.empty:
        cutoff = valid_engagement["engagement_rate"].quantile(0.9)
        top_decile_posts = (
            valid_engagement[valid_engagement["engagement_rate"] >= cutoff]
            .sort_values("engagement_rate", ascending=False)[["permalink", "media_type", "caption_length", "hashtag_count"]]
            .reset_index(drop=True)
        )

    experiments = _rank_experiments(
        overall_median,
        ("media_type", "Shift the content mix toward more {winner} posts", by_media_type),
        ("media_product_type", "Shift the content mix toward more {winner} placements", by_media_product_type),
        ("caption opening", "Open captions with a {winner} instead of the current mix", by_first_line_type),
        ("hashtag count", "Target {winner} hashtags per post", by_hashtag_bucket),
        ("caption length", "Write {winner} captions", by_caption_length_bucket),
        ("posting hour (ET)", "Shift posting time toward {winner}", by_hour_bucket),
        ("posting day", "Prioritize posting on {winner}", by_day_of_week),
    )[:5]

    return AnalysisResult(
        total_posts=len(df),
        total_accounts=df["username"].nunique(),
        skipped_accounts=skipped_accounts,
        overall_median_engagement=overall_median,
        by_media_type=by_media_type,
        by_media_product_type=by_media_product_type,
        by_first_line_type=by_first_line_type,
        by_hashtag_bucket=by_hashtag_bucket,
        by_caption_length_bucket=by_caption_length_bucket,
        by_hour_bucket=by_hour_bucket,
        by_day_of_week=by_day_of_week,
        posts_per_week_overall=posts_per_week_overall,
        posts_per_week_by_account=per_account_ppw,
        caption_median_length=float(df["caption_length"].median()) if not df.empty else 0.0,
        caption_median_hashtags=float(df["hashtag_count"].median()) if not df.empty else 0.0,
        top_decile_posts=top_decile_posts,
        experiments=experiments,
    )
