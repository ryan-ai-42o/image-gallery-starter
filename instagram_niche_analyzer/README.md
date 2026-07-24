# Instagram Niche Content-Format Analyzer

A small CLI that pulls public post data for a hand-picked list of Instagram
Business/Creator accounts via the official Graph API `business_discovery`
edge, and produces an aggregate content-format report for a niche: what
media types, posting times, and caption styles correlate with higher
engagement.

Official Graph API only -- no scraping, no headless browser, no
unofficial/private endpoints.

## How it works

For each username in `accounts.txt`, the tool calls:

```
GET https://graph.facebook.com/{version}/{IG_USER_ID}
    ?fields=business_discovery.username({username}){
        followers_count,media_count,
        media.limit(50){caption,comments_count,like_count,
                        media_type,media_product_type,permalink,timestamp}
      }
    &access_token={IG_ACCESS_TOKEN}
```

`IG_USER_ID` is your own Instagram Business account (the caller), used to
authorize the `business_discovery` lookup of the *other* public
Business/Creator accounts listed in `accounts.txt`. This only works for
Business/Creator target accounts -- `business_discovery` returns nothing
for personal accounts.

Raw responses are cached to `cache/{username}.json` so re-runs don't re-hit
the API; pass `--refresh` to force a re-fetch. Rate-limited/errored
requests are retried with exponential backoff; accounts that error out
after retries (or aren't Business/Creator accounts) are logged and
skipped -- one bad account never aborts the run.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env   # fill in IG_ACCESS_TOKEN and IG_USER_ID, then `export $(cat .env)`
cp accounts.example.txt accounts.txt   # edit with your niche's reference accounts
```

`IG_ACCESS_TOKEN` needs the `instagram_basic` permission (via a connected
Facebook Page / Instagram Business login) and must belong to the app user
identified by `IG_USER_ID`.

## Run

```bash
python -m instagram_niche_analyzer.cli \
    --accounts accounts.txt \
    --output-dir output \
    --cache-dir cache \
    --niche-label "Outdoor gear brands"
```

Outputs:

- `output/report.md` -- aggregate findings (engagement by media type/format,
  posting cadence, caption patterns, top-decile posts) plus a "what to
  test" section with 5 format experiments ranked by observed engagement
  lift.
- `output/data.csv` -- one row per post: `username, timestamp, media_type,
  media_product_type, likes, comments, engagement_rate, caption_length,
  hashtag_count`.

The top-decile posts section in `report.md` intentionally omits usernames,
bios, follower lists, and profile images -- only `permalink`, `media_type`,
`caption_length`, and `hashtag_count` are included there.

## Notes on the API

- `media_type` is one of `IMAGE`, `VIDEO`, `CAROUSEL_ALBUM`;
  `media_product_type` is one of `FEED`, `REELS` (business_discovery does
  not expose Stories).
- `like_count`/`comments_count` are omitted by Meta for posts where the
  target account has hidden its like count -- those posts are excluded
  from engagement-rate calculations (not treated as zero engagement).
- Timestamps come back in UTC; the analyzer converts them to
  `America/New_York` for posting-cadence/day-of-week/hour analysis.
- Meta revs the Graph API roughly quarterly and retires versions on a
  ~2-year clock. `--api-version` defaults to a recent stable version
  (see `api.DEFAULT_GRAPH_API_VERSION`) -- check
  https://developers.facebook.com/docs/graph-api/changelog before relying
  on this against production traffic, and confirm `business_discovery`'s
  field list still matches at
  https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery/.

## Layout

```
instagram_niche_analyzer/
  api.py         Graph API client: request building, retry/backoff, error handling
  cache.py       Per-username JSON response cache
  analysis.py    pandas aggregation: engagement rates, cadence, caption stats, top decile
  report.py      Renders AnalysisResult -> report.md
  cli.py         Wires it together, argument parsing, CSV output
```
