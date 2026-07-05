# AI Business Operating Manual

A professional, offline-friendly glossary and study reference covering the
vocabulary a modern AI/tech consultant or agency owner needs across 18
domains: computer fundamentals, networking, programming, web development,
databases, cloud computing, cybersecurity, artificial intelligence, AI
agents & automation, SEO, digital marketing, sales & consulting, business
& finance, analytics, UI/UX design, project management, legal &
compliance, and emerging technology.

It's built as a plain static site — no build tools, no frameworks, no paid
services — so it loads fast, works offline once cached, and can be hosted
anywhere that serves static files.

## What's inside

```
ai-business-manual/
├── index.html      Page structure and markup
├── styles.css      Design system (light/dark themes, responsive, print)
├── script.js       All interactivity (vanilla JS, no dependencies)
├── glossary.json   The glossary data — every term lives here
└── README.md       This file
```

### Features

- **Search** by term, definition, category, or related terms.
- **Category navigation** in a sidebar (collapses to an off-canvas drawer
  on mobile).
- **Expandable glossary cards** with a plain-English definition up front
  and full technical detail on expand.
- **Plain English / Expert / Full detail modes** — toggle which fields
  show across every card at once.
- **Dark / light mode** toggle, with a sensible default based on the
  visitor's OS preference.
- **Copy-to-clipboard** button on every card.
- **Listen Mode** — a distraction-free, large-type overlay with
  text-to-speech playback (via the browser's built-in Web Speech API),
  play/pause/stop, previous/next term, and an adjustable speech rate.
  Great for studying hands-free (commuting, working out, etc.).
- **Study progress tracker** — mark terms as "studied"; progress is saved
  in `localStorage` and shown as a progress bar in the sidebar.
- **Bookmarks/favorites** — star any term; saved in `localStorage`; view
  just your favorites with one click.
- **Export** the full glossary as JSON or Markdown, or export just your
  favorites as JSON — useful for building flashcards, feeding into another
  tool, or printing a personal study packet.
- **Print-friendly** — printing (Cmd/Ctrl+P) produces a clean, readable
  document with the sidebar and controls hidden.
- Fully static, no external dependencies, no analytics/tracking, and
  accessible semantic HTML (skip link, ARIA states, keyboard-operable
  controls).

## Running it locally

Because `script.js` loads `glossary.json` with `fetch()`, the page needs to
be served over `http://`, not opened directly as a `file://` URL (browsers
block `fetch` against local files for security reasons). Any of the
following work:

```bash
# Python (already installed on most systems)
cd ai-business-manual
python3 -m http.server 8080
# then open http://localhost:8080

# Node (if you have it)
npx serve ai-business-manual

# VS Code
# Right-click index.html -> "Open with Live Server" (if installed)
```

No `npm install`, build step, or bundler is required — this is plain
HTML/CSS/JS.

## Adding or editing glossary terms

All content lives in `glossary.json` as a flat array of term objects. To
add a term, append a new object to the array using this exact shape:

```json
{
  "id": "retrieval-augmented-generation",
  "term": "Retrieval-Augmented Generation (RAG)",
  "pronunciation": "ree-TREE-vul aug-MEN-ted jen-uh-RAY-shun",
  "category": "AI Agents & Automation",
  "simpleDefinition": "A way of giving an AI model outside information to reference before it answers, instead of relying only on what it memorized during training.",
  "technicalDefinition": "An architecture that retrieves relevant documents from an external knowledge base (typically via vector similarity search) and injects them into the model's context window at inference time to ground its response.",
  "whyItMatters": "It lets an AI system answer accurately about a specific business's private data, current pricing, or recent events without retraining the model.",
  "realWorldExample": "A support chatbot that pulls the exact refund policy from a company's help center before answering a customer, rather than guessing.",
  "businessUseSentence": "We'll use RAG so the assistant answers from your actual documentation instead of generic training data.",
  "relatedTerms": ["vector database", "embedding", "large language model", "context window"],
  "commonMistakes": "Assuming RAG 'trains' the model — it doesn't; it only supplies extra context at answer time, so stale or poorly-indexed source documents still produce wrong answers.",
  "advancedInsight": "Retrieval quality (chunking strategy, embedding model choice, re-ranking) usually matters more to final answer quality than which LLM is used downstream.",
  "meetingLanguage": "Think of it like giving the AI an open-book exam instead of asking it to answer from memory.",
  "quizQuestion": "Does RAG change the underlying model's trained weights?",
  "answer": "No — RAG retrieves relevant information at answer time and adds it to the prompt; the model itself is not retrained."
}
```

Field reference:

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Unique, URL-safe slug. If omitted, one is generated from `term` at runtime, but explicit ids are recommended so bookmarks/progress stay stable if you rename a term later. |
| `term` | string | The headword shown on the card. |
| `pronunciation` | string | Simple phonetic guide (no IPA required). |
| `category` | string | Must exactly match one of the 18 category names used elsewhere in the file, or it will appear as its own uncategorized group in the sidebar. |
| `simpleDefinition` | string | Plain-English definition, shown by default and in "Plain English" mode. |
| `technicalDefinition` | string | Precise, technically accurate definition, shown in "Expert" and "Full" modes. |
| `whyItMatters` | string | Practical/business relevance. |
| `realWorldExample` | string | A concrete example. |
| `businessUseSentence` | string | A sentence modeling how to use the term with a client. |
| `relatedTerms` | array of strings | Cross-references shown as tags; also searchable. |
| `commonMistakes` | string | A misconception or error to avoid. |
| `advancedInsight` | string | Expert-level nuance. |
| `meetingLanguage` | string | A ready-to-say line for client meetings. |
| `quizQuestion` | string | A self-test question. |
| `answer` | string | The answer, revealed on click. |

After editing `glossary.json`, just refresh the page — there's no build
step. Validate your JSON (e.g. `python3 -m json.tool glossary.json` or any
JSON linter) before committing, since a single syntax error will prevent
the whole glossary from loading.

## Deployment

This is a static site — deploy the contents of `ai-business-manual/`
directly, no build command needed.

### Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**.
3. Set **Build command** to (empty) and **Build output directory** to
   `ai-business-manual`.
4. Deploy. Cloudflare serves the static files directly — no build step
   runs.

### Netlify

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**.
3. Set **Base directory** to `ai-business-manual`, leave **Build command**
   empty, and set **Publish directory** to `ai-business-manual` (or `.` if
   the base directory is already set to it).
4. Deploy.

Alternatively, drag-and-drop the `ai-business-manual` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop) for an instant
deploy with no Git integration required.

### GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings: **Pages → Source**, choose the branch, and set
   the folder to `/ai-business-manual` if your repo supports serving from
   a subfolder, or move/copy the contents of `ai-business-manual/` to the
   repo root (or to a `docs/` folder) if it doesn't.
3. Save — GitHub Pages will publish the static files as-is.

## Browser support notes

- **Listen Mode** uses the standard `SpeechSynthesis` Web API, built into
  all modern browsers (Chrome, Edge, Safari, Firefox). Available voices
  and quality vary by OS/browser; no external TTS service is used.
- **Favorites** and **study progress** are stored in `localStorage` on the
  device/browser you're using — they are not synced across devices and
  will be cleared if you clear site data.
- No data ever leaves your browser: there is no backend, no analytics, and
  no external network calls other than loading the local `glossary.json`.
