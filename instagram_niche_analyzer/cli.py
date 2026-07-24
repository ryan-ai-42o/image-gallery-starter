"""CLI entry point: read accounts.txt, fetch/cache business_discovery data,
run aggregate analysis, and write report.md + data.csv.

Usage:
    IG_ACCESS_TOKEN=... IG_USER_ID=... python -m instagram_niche_analyzer.cli \\
        --accounts accounts.txt --output-dir output --cache-dir cache

Auth is read from the environment (IG_ACCESS_TOKEN, IG_USER_ID) -- never
pass tokens on the command line where they'd land in shell history.
"""

from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

import requests

from . import api, cache
from .analysis import analyze, build_posts_dataframe
from .report import render

logger = logging.getLogger("instagram_niche_analyzer")


def _read_accounts(path: Path) -> list[str]:
    if not path.exists():
        raise SystemExit(f"accounts file not found: {path}")
    usernames = []
    for line in path.read_text(encoding="utf-8").splitlines():
        username = line.strip().lstrip("@")
        if username and not username.startswith("#"):
            usernames.append(username)
    return usernames


def _load_accounts_data(
    usernames: list[str],
    cache_dir: Path,
    ig_user_id: str,
    access_token: str,
    api_version: str,
    refresh: bool,
) -> tuple[dict, list[str]]:
    accounts: dict = {}
    skipped: list[str] = []
    session = requests.Session()

    for username in usernames:
        cached = None if refresh else cache.load(cache_dir, username)
        if cached is not None:
            logger.info("[%s] loaded from cache", username)
            accounts[username] = cached
            continue

        result = api.fetch_business_discovery(
            username, ig_user_id, access_token, api_version=api_version, session=session
        )
        if not result.ok:
            logger.warning("[%s] skipped: %s", username, result.error)
            skipped.append(username)
            continue

        cache.save(cache_dir, username, result.data)
        accounts[username] = result.data

    return accounts, skipped


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--accounts", type=Path, default=Path("accounts.txt"), help="Path to newline-separated usernames file")
    parser.add_argument("--output-dir", type=Path, default=Path("output"), help="Directory to write report.md and data.csv")
    parser.add_argument("--cache-dir", type=Path, default=Path("cache"), help="Directory for cached raw API responses")
    parser.add_argument("--niche-label", default="Analyzed accounts", help="Label used in the report title")
    parser.add_argument("--api-version", default=api.DEFAULT_GRAPH_API_VERSION, help="Graph API version, e.g. v21.0")
    parser.add_argument("--refresh", action="store_true", help="Ignore cache and re-fetch every account")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose logging")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_arg_parser().parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    access_token = os.environ.get("IG_ACCESS_TOKEN")
    ig_user_id = os.environ.get("IG_USER_ID")
    if not access_token or not ig_user_id:
        logger.error("IG_ACCESS_TOKEN and IG_USER_ID must be set in the environment.")
        return 1

    usernames = _read_accounts(args.accounts)
    if not usernames:
        logger.error("No usernames found in %s", args.accounts)
        return 1

    logger.info("Analyzing %d accounts...", len(usernames))
    accounts, skipped = _load_accounts_data(
        usernames, args.cache_dir, ig_user_id, access_token, args.api_version, args.refresh
    )

    if not accounts:
        logger.error("No usable data for any account. Nothing to report.")
        return 1

    df = build_posts_dataframe(accounts)
    if df.empty:
        logger.error("No posts found across %d accounts. Nothing to report.", len(accounts))
        return 1

    result = analyze(df, skipped)

    args.output_dir.mkdir(parents=True, exist_ok=True)

    report_path = args.output_dir / "report.md"
    report_path.write_text(render(result, niche_label=args.niche_label), encoding="utf-8")
    logger.info("Wrote %s", report_path)

    csv_path = args.output_dir / "data.csv"
    csv_columns = [
        "username",
        "timestamp",
        "media_type",
        "media_product_type",
        "likes",
        "comments",
        "engagement_rate",
        "caption_length",
        "hashtag_count",
    ]
    df[csv_columns].to_csv(csv_path, index=False)
    logger.info("Wrote %s", csv_path)

    logger.info(
        "Done. %d posts across %d accounts (%d skipped).",
        len(df),
        len(accounts),
        len(skipped),
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
