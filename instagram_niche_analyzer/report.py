"""Render an AnalysisResult into report.md."""

from __future__ import annotations

from datetime import datetime, timezone

from .analysis import AnalysisResult, GroupStat


def _pct(x: float) -> str:
    return f"{x * 100:.2f}%"


def _group_table(stats: list[GroupStat], label_header: str) -> str:
    if not stats:
        return "_No data._\n"
    lines = [f"| {label_header} | Posts (n) | Median engagement rate |", "| --- | --- | --- |"]
    for s in stats:
        lines.append(f"| {s.label} | {s.n} | {_pct(s.median_engagement)} |")
    return "\n".join(lines) + "\n"


def render(result: AnalysisResult, niche_label: str = "Analyzed accounts") -> str:
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines: list[str] = []
    lines.append(f"# Instagram Content-Format Report -- {niche_label}")
    lines.append("")
    lines.append(f"_Generated {generated_at}_")
    lines.append("")
    lines.append("## Dataset")
    lines.append("")
    lines.append(f"- Accounts analyzed: **{result.total_accounts}**")
    if result.skipped_accounts:
        lines.append(
            f"- Accounts skipped (no business_discovery data -- private, personal, or "
            f"errored): **{len(result.skipped_accounts)}** ({', '.join(result.skipped_accounts)})"
        )
    lines.append(f"- Posts analyzed: **{result.total_posts}**")
    lines.append(f"- Overall median engagement rate ((likes + comments) / followers): **{_pct(result.overall_median_engagement)}**")
    lines.append(f"- Average posting cadence: **{result.posts_per_week_overall:.1f} posts/week** per account")
    lines.append("")

    lines.append("## Engagement by media type")
    lines.append("")
    lines.append(_group_table(result.by_media_type, "media_type"))

    lines.append("## Engagement by media product type")
    lines.append("")
    lines.append(_group_table(result.by_media_product_type, "media_product_type"))

    lines.append("## Posting cadence")
    lines.append("")
    lines.append(f"- Median posts/week across accounts: **{result.posts_per_week_overall:.1f}**")
    lines.append("")
    lines.append("Per-account posting rate:")
    lines.append("")
    lines.append("| Account | Posts/week |")
    lines.append("| --- | --- |")
    for username, ppw in sorted(result.posts_per_week_by_account.items(), key=lambda kv: kv[1], reverse=True):
        lines.append(f"| {username} | {ppw:.1f} |")
    lines.append("")
    lines.append("### Engagement by day of week (America/New_York)")
    lines.append("")
    lines.append(_group_table(result.by_day_of_week, "day_of_week"))
    lines.append("### Engagement by hour of day (America/New_York)")
    lines.append("")
    lines.append(_group_table(result.by_hour_bucket, "hour_bucket"))

    lines.append("## Caption analysis")
    lines.append("")
    lines.append(f"- Median caption length: **{result.caption_median_length:.0f} characters**")
    lines.append(f"- Median hashtag count: **{result.caption_median_hashtags:.0f}**")
    lines.append("")
    lines.append("### Engagement by caption opening style")
    lines.append("")
    lines.append(_group_table(result.by_first_line_type, "first_line_type"))
    lines.append("### Engagement by hashtag count")
    lines.append("")
    lines.append(_group_table(result.by_hashtag_bucket, "hashtag_bucket"))
    lines.append("### Engagement by caption length")
    lines.append("")
    lines.append(_group_table(result.by_caption_length_bucket, "caption_length_bucket"))

    lines.append("## Top-decile posts by engagement rate")
    lines.append("")
    lines.append(
        "Format signals only -- no usernames, bios, follower lists, or profile "
        "images are included below."
    )
    lines.append("")
    if result.top_decile_posts.empty:
        lines.append("_No data._")
    else:
        lines.append("| Permalink | media_type | caption_length | hashtag_count |")
        lines.append("| --- | --- | --- | --- |")
        for row in result.top_decile_posts.itertuples(index=False):
            lines.append(f"| {row.permalink} | {row.media_type} | {row.caption_length} | {row.hashtag_count} |")
    lines.append("")

    lines.append("## What to test")
    lines.append("")
    lines.append(
        "Five concrete format experiments, ranked by observed engagement lift over "
        "the overall median engagement rate across the analyzed accounts. Each is "
        "backed by at least 5 posts in the winning group; treat these as hypotheses "
        "to A/B test, not guarantees."
    )
    lines.append("")
    if not result.experiments:
        lines.append("_Not enough data to surface statistically meaningful experiments yet -- add more reference accounts or wait for more posts._")
    else:
        for i, exp in enumerate(result.experiments, start=1):
            lines.append(
                f"{i}. **{exp['experiment']}** -- observed lift **+{exp['lift_pct']:.0f}%** "
                f"over baseline ({_pct(exp['median_engagement'])} vs {_pct(result.overall_median_engagement)} median, "
                f"n={exp['n']} posts, dimension: {exp['dimension']})"
            )
    lines.append("")

    return "\n".join(lines)
