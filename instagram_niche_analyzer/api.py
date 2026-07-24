"""Thin client for the Instagram Graph API business_discovery edge.

Field reference (verified against Meta's Instagram Platform docs and the
current business_discovery schema as of this writing):

  business_discovery.username({username}){
      followers_count, media_count,
      media.limit(50){
          caption, comments_count, like_count,
          media_type, media_product_type, permalink, timestamp
      }
  }

- media_type   : IMAGE | VIDEO | CAROUSEL_ALBUM
- media_product_type : FEED | REELS | STORY (STORY is not discoverable via
  business_discovery; only FEED/REELS are expected here)
- like_count / comments_count are omitted by Meta for posts where the
  target account has hidden like counts; treat missing values as unknown,
  not zero.

Meta revs the Graph API roughly quarterly and retires old versions on a
~2 year clock. IG_GRAPH_API_VERSION defaults to a recent stable version
but should be checked against https://developers.facebook.com/docs/graph-api/changelog
before relying on this in production.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Any

import requests

logger = logging.getLogger(__name__)

DEFAULT_GRAPH_API_VERSION = "v21.0"
MEDIA_FIELDS = (
    "caption,comments_count,like_count,media_type,media_product_type,"
    "permalink,timestamp"
)
MEDIA_LIMIT = 50

MAX_RETRIES = 5
INITIAL_BACKOFF_SECONDS = 2.0
BACKOFF_MULTIPLIER = 2.0

# Graph API error codes that indicate throttling / rate limiting.
# 4   = ApplicationRequestLimitReached
# 17  = UserRequestLimitReached
# 32  = PageRequestLimitReached
# 613 = CustomRateLimit (business use case rate limit)
RATE_LIMIT_ERROR_CODES = {4, 17, 32, 613}


class InstagramAPIError(Exception):
    """Raised for non-retryable Graph API errors."""


@dataclass
class FetchResult:
    username: str
    data: dict[str, Any] | None
    error: str | None = None

    @property
    def ok(self) -> bool:
        return self.data is not None


def _business_discovery_fields() -> str:
    return f"followers_count,media_count,media.limit({MEDIA_LIMIT}){{{MEDIA_FIELDS}}}"


def fetch_business_discovery(
    username: str,
    ig_user_id: str,
    access_token: str,
    *,
    api_version: str = DEFAULT_GRAPH_API_VERSION,
    session: requests.Session | None = None,
    max_retries: int = MAX_RETRIES,
) -> FetchResult:
    """Fetch business_discovery data for a single username.

    Retries with exponential backoff on rate-limit responses. Returns a
    FetchResult with data=None (and an error message) for accounts that
    don't expose business_discovery (personal accounts, private accounts,
    nonexistent usernames) or that fail after retries -- callers should
    log and continue rather than treat this as fatal.
    """
    session = session or requests.Session()
    url = f"https://graph.facebook.com/{api_version}/{ig_user_id}"
    params = {
        "fields": f"business_discovery.username({username}){{{_business_discovery_fields()}}}",
        "access_token": access_token,
    }

    backoff = INITIAL_BACKOFF_SECONDS
    last_error = "unknown error"

    for attempt in range(1, max_retries + 1):
        try:
            resp = session.get(url, params=params, timeout=30)
        except requests.RequestException as exc:
            last_error = f"network error: {exc}"
            logger.warning(
                "[%s] network error (attempt %d/%d): %s", username, attempt, max_retries, exc
            )
            if attempt < max_retries:
                time.sleep(backoff)
                backoff *= BACKOFF_MULTIPLIER
                continue
            break

        if resp.status_code == 200:
            payload = resp.json()
            if "business_discovery" not in payload:
                return FetchResult(
                    username,
                    None,
                    "no business_discovery data returned (not a Business/Creator "
                    "account, private, or username not found)",
                )
            return FetchResult(username, payload["business_discovery"])

        try:
            error_body = resp.json().get("error", {})
        except ValueError:
            error_body = {}

        error_code = error_body.get("code")
        error_message = error_body.get("message") or resp.text[:300]
        last_error = f"HTTP {resp.status_code} code={error_code}: {error_message}"

        is_rate_limited = resp.status_code == 429 or error_code in RATE_LIMIT_ERROR_CODES
        if is_rate_limited and attempt < max_retries:
            logger.warning(
                "[%s] rate limited (attempt %d/%d): %s -- backing off %.0fs",
                username,
                attempt,
                max_retries,
                error_message,
                backoff,
            )
            time.sleep(backoff)
            backoff *= BACKOFF_MULTIPLIER
            continue

        # Non-retryable error (bad token, unknown username, permissions, etc).
        logger.error("[%s] API error: %s", username, last_error)
        return FetchResult(username, None, last_error)

    logger.error("[%s] giving up after %d attempts: %s", username, max_retries, last_error)
    return FetchResult(username, None, last_error)
