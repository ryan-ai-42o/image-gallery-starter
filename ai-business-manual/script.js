/* =========================================================================
   AI Business Operating Manual — application logic
   Vanilla JS, no build step, no external dependencies.
   Data model: glossary.json is an array of term objects (see README for
   the schema). Everything else (search, filters, modes, favorites,
   progress, listen mode, export) is derived from that array at runtime.
   ========================================================================= */

(function () {
  "use strict";

  /* ----------------------------------------------------------------- */
  /* State                                                              */
  /* ----------------------------------------------------------------- */

  const state = {
    glossary: [],          // full data set, loaded from glossary.json
    categories: [],        // unique, ordered category names
    activeCategory: "all",
    searchTerm: "",
    showFavoritesOnly: false,
    detailMode: "full",    // "plain" | "expert" | "full"
    expandedIds: new Set(),
    favorites: new Set(),  // term ids
    studied: new Set(),    // term ids
    listen: {
      list: [],            // ids in current listen queue
      index: 0,
      playing: false,
      utterance: null,
    },
  };

  const STORAGE_KEYS = {
    favorites: "aibom.favorites",
    studied: "aibom.studied",
    theme: "aibom.theme",
    detailMode: "aibom.detailMode",
  };

  /* ----------------------------------------------------------------- */
  /* DOM references                                                     */
  /* ----------------------------------------------------------------- */

  const el = {
    categoryList: document.getElementById("category-list"),
    grid: document.getElementById("glossary-grid"),
    emptyState: document.getElementById("empty-state"),
    searchInput: document.getElementById("search-input"),
    resultsCount: document.getElementById("results-count"),
    activeCategoryLabel: document.getElementById("active-category-label"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    progressLabel: document.getElementById("progress-label"),
    showFavoritesBtn: document.getElementById("show-favorites"),
    favoritesCountLabel: document.getElementById("favorites-count-label"),
    themeToggle: document.getElementById("theme-toggle"),
    navToggle: document.getElementById("nav-toggle"),
    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    expandAllBtn: document.getElementById("expand-all"),
    collapseAllBtn: document.getElementById("collapse-all"),
    exportJsonBtn: document.getElementById("export-json"),
    exportMdBtn: document.getElementById("export-md"),
    exportFavoritesBtn: document.getElementById("export-favorites-btn"),
    listenModeBtn: document.getElementById("listen-mode-btn"),
    listenOverlay: document.getElementById("listen-overlay"),
    listenClose: document.getElementById("listen-close"),
    listenTitle: document.getElementById("listen-term-title"),
    listenCategory: document.getElementById("listen-category"),
    listenText: document.getElementById("listen-text"),
    listenPlay: document.getElementById("listen-play"),
    listenStop: document.getElementById("listen-stop"),
    listenPrev: document.getElementById("listen-prev"),
    listenNext: document.getElementById("listen-next"),
    listenRate: document.getElementById("listen-rate"),
    listenRateLabel: document.getElementById("listen-rate-label"),
    listenPosition: document.getElementById("listen-position"),
    listenTotal: document.getElementById("listen-total"),
  };

  /* ----------------------------------------------------------------- */
  /* Utilities                                                          */
  /* ----------------------------------------------------------------- */

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function loadSet(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (err) {
      return new Set();
    }
  }

  function saveSet(key, set) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch (err) {
      /* localStorage unavailable (private mode / quota) — fail silently */
    }
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /* ----------------------------------------------------------------- */
  /* Data loading                                                       */
  /* ----------------------------------------------------------------- */

  async function loadGlossary() {
    try {
      const res = await fetch("glossary.json");
      if (!res.ok) throw new Error("Failed to load glossary.json: " + res.status);
      const data = await res.json();

      state.glossary = data.map((entry) => ({
        id: entry.id || slugify(entry.term),
        ...entry,
      }));

      const seen = new Set();
      state.categories = [];
      state.glossary.forEach((entry) => {
        if (!seen.has(entry.category)) {
          seen.add(entry.category);
          state.categories.push(entry.category);
        }
      });

      renderCategoryList();
      updateFavoritesLabel();
      renderGrid();
      updateProgress();
    } catch (err) {
      el.grid.innerHTML =
        '<p class="empty-state">Could not load glossary.json. If you opened this file directly in a browser, run a local server instead (see README.md) — browsers block fetch() on the file:// protocol.</p>';
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  /* ----------------------------------------------------------------- */
  /* Sidebar: category navigation                                       */
  /* ----------------------------------------------------------------- */

  function renderCategoryList() {
    const counts = {};
    state.glossary.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    const allBtn = el.categoryList.querySelector('[data-category="all"]');
    allBtn.innerHTML = `All Categories <span class="category-count">${state.glossary.length}</span>`;

    // Remove any previously rendered category buttons (keep the "all" li).
    Array.from(el.categoryList.children).forEach((li, idx) => {
      if (idx > 0) li.remove();
    });

    state.categories.forEach((cat) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "category-btn";
      btn.dataset.category = cat;
      btn.innerHTML = `${escapeHtml(cat)} <span class="category-count">${counts[cat]}</span>`;
      li.appendChild(btn);
      el.categoryList.appendChild(li);
    });

    el.categoryList.addEventListener("click", (evt) => {
      const btn = evt.target.closest(".category-btn");
      if (!btn) return;
      state.activeCategory = btn.dataset.category;
      state.showFavoritesOnly = false;
      Array.from(el.categoryList.querySelectorAll(".category-btn")).forEach((b) =>
        b.classList.toggle("is-active", b === btn)
      );
      el.activeCategoryLabel.textContent = state.activeCategory === "all" ? "All Categories" : state.activeCategory;
      closeMobileNav();
      renderGrid();
    });
  }

  /* ----------------------------------------------------------------- */
  /* Filtering                                                          */
  /* ----------------------------------------------------------------- */

  function getFilteredEntries() {
    const term = state.searchTerm.trim().toLowerCase();

    return state.glossary.filter((entry) => {
      if (state.showFavoritesOnly && !state.favorites.has(entry.id)) return false;

      if (state.activeCategory !== "all" && !state.showFavoritesOnly && entry.category !== state.activeCategory) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        entry.term,
        entry.category,
        entry.simpleDefinition,
        entry.technicalDefinition,
        entry.whyItMatters,
        entry.realWorldExample,
        entry.businessUseSentence,
        (entry.relatedTerms || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }

  /* ----------------------------------------------------------------- */
  /* Rendering: glossary cards                                          */
  /* ----------------------------------------------------------------- */

  function renderGrid() {
    const entries = getFilteredEntries();

    el.resultsCount.textContent = state.searchTerm.trim()
      ? `${entries.length} result${entries.length === 1 ? "" : "s"}`
      : "";

    el.emptyState.hidden = entries.length > 0;
    el.grid.innerHTML = entries.map(renderCard).join("");

    if (state.showFavoritesOnly) {
      el.activeCategoryLabel.textContent = `Favorites (${entries.length})`;
    }
  }

  function renderCard(entry) {
    const isExpanded = state.expandedIds.has(entry.id);
    const isFavorite = state.favorites.has(entry.id);
    const isStudied = state.studied.has(entry.id);
    const related = entry.relatedTerms || [];

    return `
      <article class="glossary-card${isExpanded ? " is-expanded" : ""}" data-id="${escapeHtml(entry.id)}">
        <div class="card-header">
          <div class="card-heading">
            <h3 class="card-term">${escapeHtml(entry.term)}</h3>
            ${entry.pronunciation ? `<span class="card-pronunciation">/${escapeHtml(entry.pronunciation)}/</span>` : ""}
            <span class="card-category-tag">${escapeHtml(entry.category)}</span>
          </div>
          <div class="card-actions">
            <button class="favorite-btn${isFavorite ? " is-favorited" : ""}" title="Bookmark this term" aria-pressed="${isFavorite}" aria-label="Bookmark ${escapeHtml(entry.term)}">
              <svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
            </button>
            <button class="studied-btn${isStudied ? " is-studied" : ""}" title="Mark as studied" aria-pressed="${isStudied}" aria-label="Mark ${escapeHtml(entry.term)} as studied">
              <svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>
            </button>
            <button class="copy-btn" title="Copy term to clipboard" aria-label="Copy ${escapeHtml(entry.term)} to clipboard">
              <svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>

        <p class="card-simple-def field-simple">${escapeHtml(entry.simpleDefinition)}</p>

        <div class="card-body">
          <div class="field-technical">
            <p class="card-field-label">Technical Definition</p>
            <p class="card-field-value">${escapeHtml(entry.technicalDefinition)}</p>
          </div>
          <div>
            <p class="card-field-label">Why It Matters</p>
            <p class="card-field-value">${escapeHtml(entry.whyItMatters)}</p>
          </div>
          <div>
            <p class="card-field-label">Real-World Example</p>
            <p class="card-field-value">${escapeHtml(entry.realWorldExample)}</p>
          </div>
          <div class="field-meeting">
            <p class="card-field-label">How To Say It In A Meeting</p>
            <p class="card-field-value">&ldquo;${escapeHtml(entry.meetingLanguage)}&rdquo;</p>
          </div>
          <div>
            <p class="card-field-label">Business Use</p>
            <p class="card-field-value">${escapeHtml(entry.businessUseSentence)}</p>
          </div>
          <div>
            <p class="card-field-label">Common Mistakes</p>
            <p class="card-field-value">${escapeHtml(entry.commonMistakes)}</p>
          </div>
          <div class="field-advanced">
            <p class="card-field-label">Advanced Insight</p>
            <p class="card-field-value">${escapeHtml(entry.advancedInsight)}</p>
          </div>
          ${
            related.length
              ? `<div>
                  <p class="card-field-label">Related Terms</p>
                  <ul class="card-related-list">${related.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
                </div>`
              : ""
          }
          <div class="card-quiz">
            <p class="card-quiz-question">Q: ${escapeHtml(entry.quizQuestion)}</p>
            <button class="reveal-answer-btn">Reveal answer</button>
            <p class="card-quiz-answer">A: ${escapeHtml(entry.answer)}</p>
          </div>
        </div>

        <button class="card-toggle" aria-expanded="${isExpanded}">${isExpanded ? "Collapse ▲" : "Expand for full detail ▼"}</button>
      </article>
    `;
  }

  /* Delegated click handling for all card interactions (grid re-renders
     often, so listeners are attached once on the container). */
  el.grid.addEventListener("click", (evt) => {
    const card = evt.target.closest(".glossary-card");
    if (!card) return;
    const id = card.dataset.id;
    const entry = state.glossary.find((e) => e.id === id);
    if (!entry) return;

    if (evt.target.closest(".card-toggle")) {
      toggleExpanded(id, card);
      return;
    }

    if (evt.target.closest(".favorite-btn")) {
      toggleFavorite(id, evt.target.closest(".favorite-btn"));
      return;
    }

    if (evt.target.closest(".studied-btn")) {
      toggleStudied(id, evt.target.closest(".studied-btn"));
      return;
    }

    if (evt.target.closest(".copy-btn")) {
      copyEntry(entry, evt.target.closest(".copy-btn"));
      return;
    }

    if (evt.target.closest(".reveal-answer-btn")) {
      const btn = evt.target.closest(".reveal-answer-btn");
      const answer = card.querySelector(".card-quiz-answer");
      const shown = answer.classList.toggle("is-shown");
      btn.textContent = shown ? "Hide answer" : "Reveal answer";
      return;
    }
  });

  function toggleExpanded(id, card) {
    if (state.expandedIds.has(id)) {
      state.expandedIds.delete(id);
      card.classList.remove("is-expanded");
    } else {
      state.expandedIds.add(id);
      card.classList.add("is-expanded");
    }
    const toggleBtn = card.querySelector(".card-toggle");
    const expanded = card.classList.contains("is-expanded");
    toggleBtn.setAttribute("aria-expanded", expanded);
    toggleBtn.innerHTML = expanded ? "Collapse ▲" : "Expand for full detail ▼";
  }

  function toggleFavorite(id, btn) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    saveSet(STORAGE_KEYS.favorites, state.favorites);
    btn.classList.toggle("is-favorited", state.favorites.has(id));
    btn.setAttribute("aria-pressed", state.favorites.has(id));
    updateFavoritesLabel();
    if (state.showFavoritesOnly) renderGrid();
  }

  function toggleStudied(id, btn) {
    if (state.studied.has(id)) {
      state.studied.delete(id);
    } else {
      state.studied.add(id);
    }
    saveSet(STORAGE_KEYS.studied, state.studied);
    btn.classList.toggle("is-studied", state.studied.has(id));
    btn.setAttribute("aria-pressed", state.studied.has(id));
    updateProgress();
  }

  function copyEntry(entry, btn) {
    const text = `${entry.term}\n${entry.simpleDefinition}\n\nTechnical: ${entry.technicalDefinition}`;
    const done = () => {
      const original = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML =
        '<svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>';
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = original;
      }, 1400);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      /* clipboard unsupported — silently ignore */
    }
    textarea.remove();
    done();
  }

  /* ----------------------------------------------------------------- */
  /* Progress + favorites widgets                                       */
  /* ----------------------------------------------------------------- */

  function updateProgress() {
    const total = state.glossary.length;
    const studied = state.studied.size;
    const pct = total ? Math.round((studied / total) * 100) : 0;
    el.progressBarFill.style.width = pct + "%";
    el.progressLabel.textContent = `${studied} of ${total} terms studied`;
  }

  function updateFavoritesLabel() {
    el.favoritesCountLabel.textContent = `Favorites (${state.favorites.size})`;
  }

  el.showFavoritesBtn.addEventListener("click", () => {
    state.showFavoritesOnly = !state.showFavoritesOnly;
    state.activeCategory = "all";
    Array.from(el.categoryList.querySelectorAll(".category-btn")).forEach((b) =>
      b.classList.toggle("is-active", b.dataset.category === "all" && state.showFavoritesOnly)
    );
    if (!state.showFavoritesOnly) {
      el.activeCategoryLabel.textContent = "All Categories";
    }
    closeMobileNav();
    renderGrid();
  });

  /* ----------------------------------------------------------------- */
  /* Search                                                             */
  /* ----------------------------------------------------------------- */

  let searchDebounce = null;
  el.searchInput.addEventListener("input", (evt) => {
    clearTimeout(searchDebounce);
    const value = evt.target.value;
    searchDebounce = setTimeout(() => {
      state.searchTerm = value;
      renderGrid();
    }, 120);
  });

  /* ----------------------------------------------------------------- */
  /* Expand / collapse all                                              */
  /* ----------------------------------------------------------------- */

  el.expandAllBtn.addEventListener("click", () => {
    getFilteredEntries().forEach((e) => state.expandedIds.add(e.id));
    renderGrid();
  });

  el.collapseAllBtn.addEventListener("click", () => {
    getFilteredEntries().forEach((e) => state.expandedIds.delete(e.id));
    renderGrid();
  });

  /* ----------------------------------------------------------------- */
  /* Detail mode (plain / expert / full)                                */
  /* ----------------------------------------------------------------- */

  function setDetailMode(mode) {
    state.detailMode = mode;
    document.body.classList.remove("mode-plain", "mode-expert", "mode-full");
    document.body.classList.add("mode-" + mode);
    ["mode-plain", "mode-expert", "mode-full"].forEach((id) => {
      document.getElementById(id).classList.toggle("is-active", id === "mode-" + mode);
    });
    try {
      localStorage.setItem(STORAGE_KEYS.detailMode, mode);
    } catch (err) {
      /* ignore */
    }
  }

  document.getElementById("mode-plain").addEventListener("click", () => setDetailMode("plain"));
  document.getElementById("mode-expert").addEventListener("click", () => setDetailMode("expert"));
  document.getElementById("mode-full").addEventListener("click", () => setDetailMode("full"));

  /* ----------------------------------------------------------------- */
  /* Theme toggle                                                       */
  /* ----------------------------------------------------------------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch (err) {
      /* ignore */
    }
  }

  el.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    applyTheme(isDark ? "light" : "dark");
  });

  /* ----------------------------------------------------------------- */
  /* Mobile off-canvas sidebar                                          */
  /* ----------------------------------------------------------------- */

  function openMobileNav() {
    document.body.classList.add("nav-open");
    el.navToggle.setAttribute("aria-expanded", "true");
  }
  function closeMobileNav() {
    document.body.classList.remove("nav-open");
    el.navToggle.setAttribute("aria-expanded", "false");
  }
  el.navToggle.addEventListener("click", () => {
    document.body.classList.contains("nav-open") ? closeMobileNav() : openMobileNav();
  });
  el.sidebarBackdrop.addEventListener("click", closeMobileNav);

  /* ----------------------------------------------------------------- */
  /* Export: full glossary as JSON / Markdown, and favorites            */
  /* ----------------------------------------------------------------- */

  function entryToMarkdown(entry) {
    return [
      `## ${entry.term}`,
      entry.pronunciation ? `*Pronunciation: ${entry.pronunciation}*` : "",
      `**Category:** ${entry.category}`,
      "",
      `**Simple Definition:** ${entry.simpleDefinition}`,
      `**Technical Definition:** ${entry.technicalDefinition}`,
      `**Why It Matters:** ${entry.whyItMatters}`,
      `**Real-World Example:** ${entry.realWorldExample}`,
      `**Business Use:** ${entry.businessUseSentence}`,
      `**How To Say It In A Meeting:** "${entry.meetingLanguage}"`,
      `**Common Mistakes:** ${entry.commonMistakes}`,
      `**Advanced Insight:** ${entry.advancedInsight}`,
      entry.relatedTerms && entry.relatedTerms.length
        ? `**Related Terms:** ${entry.relatedTerms.join(", ")}`
        : "",
      `**Quiz:** ${entry.quizQuestion}`,
      `**Answer:** ${entry.answer}`,
      "",
      "---",
      "",
    ]
      .filter((line) => line !== "")
      .join("\n");
  }

  function glossaryToMarkdown(entries, title) {
    const header = `# ${title}\n\nGenerated from the AI Business Operating Manual glossary. ${entries.length} terms.\n\n---\n\n`;
    const byCategory = {};
    entries.forEach((e) => {
      byCategory[e.category] = byCategory[e.category] || [];
      byCategory[e.category].push(e);
    });
    let body = "";
    Object.keys(byCategory).forEach((cat) => {
      body += `# ${cat}\n\n`;
      byCategory[cat].forEach((entry) => {
        body += entryToMarkdown(entry);
      });
    });
    return header + body;
  }

  el.exportJsonBtn.addEventListener("click", () => {
    downloadFile("glossary-full.json", JSON.stringify(state.glossary, null, 2), "application/json");
  });

  el.exportMdBtn.addEventListener("click", () => {
    downloadFile(
      "glossary-full.md",
      glossaryToMarkdown(state.glossary, "AI Business Operating Manual — Full Glossary"),
      "text/markdown"
    );
  });

  el.exportFavoritesBtn.addEventListener("click", () => {
    const favEntries = state.glossary.filter((e) => state.favorites.has(e.id));
    if (!favEntries.length) {
      alert("You haven't bookmarked any terms yet. Click the star icon on a card to bookmark it.");
      return;
    }
    downloadFile("glossary-favorites.json", JSON.stringify(favEntries, null, 2), "application/json");
  });

  /* ----------------------------------------------------------------- */
  /* Listen mode (text-to-speech study layout)                         */
  /* ----------------------------------------------------------------- */

  const synth = window.speechSynthesis;

  function buildListenText(entry) {
    return [
      `${entry.term}.`,
      entry.simpleDefinition,
      `In technical terms: ${entry.technicalDefinition}`,
      `Why it matters: ${entry.whyItMatters}`,
      `For example: ${entry.realWorldExample}`,
      `In a meeting, you might say: ${entry.meetingLanguage}`,
    ].join(" ");
  }

  function openListenMode() {
    const entries = getFilteredEntries();
    if (!entries.length) return;
    state.listen.list = entries.map((e) => e.id);
    state.listen.index = 0;
    el.listenOverlay.hidden = false;
    document.body.classList.add("nav-open"); // reuse to lock scroll via overflow rule
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "hidden";
    renderListenTerm();
  }

  function closeListenMode() {
    el.listenOverlay.hidden = true;
    document.body.style.overflow = "";
    stopSpeech();
  }

  function currentListenEntry() {
    const id = state.listen.list[state.listen.index];
    return state.glossary.find((e) => e.id === id);
  }

  function renderListenTerm() {
    stopSpeech();
    const entry = currentListenEntry();
    if (!entry) return;
    el.listenTitle.textContent = entry.term;
    el.listenCategory.textContent = entry.category;
    el.listenText.innerHTML = `<p>${escapeHtml(buildListenText(entry))}</p>`;
    el.listenPosition.textContent = state.listen.index + 1;
    el.listenTotal.textContent = state.listen.list.length;
    el.listenPlay.innerHTML = "&#9658; Play";
  }

  function speakCurrent() {
    if (!synth) {
      alert("Text-to-speech isn't supported in this browser. You can still read the Listen Mode text on screen.");
      return;
    }
    const entry = currentListenEntry();
    if (!entry) return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(buildListenText(entry));
    utterance.rate = parseFloat(el.listenRate.value);
    utterance.onend = () => {
      state.listen.playing = false;
      el.listenPlay.innerHTML = "&#9658; Play";
    };
    state.listen.utterance = utterance;
    state.listen.playing = true;
    el.listenPlay.innerHTML = "&#10074;&#10074; Pause";
    synth.speak(utterance);
  }

  function stopSpeech() {
    if (synth) synth.cancel();
    state.listen.playing = false;
    if (el.listenPlay) el.listenPlay.innerHTML = "&#9658; Play";
  }

  el.listenModeBtn.addEventListener("click", openListenMode);
  el.listenClose.addEventListener("click", closeListenMode);
  el.listenOverlay.addEventListener("click", (evt) => {
    if (evt.target === el.listenOverlay) closeListenMode();
  });
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && !el.listenOverlay.hidden) closeListenMode();
  });

  el.listenPlay.addEventListener("click", () => {
    if (!synth) {
      speakCurrent();
      return;
    }
    if (synth.speaking && !synth.paused) {
      synth.pause();
      el.listenPlay.innerHTML = "&#9658; Play";
    } else if (synth.paused) {
      synth.resume();
      el.listenPlay.innerHTML = "&#10074;&#10074; Pause";
    } else {
      speakCurrent();
    }
  });

  el.listenStop.addEventListener("click", stopSpeech);

  el.listenPrev.addEventListener("click", () => {
    state.listen.index = (state.listen.index - 1 + state.listen.list.length) % state.listen.list.length;
    renderListenTerm();
  });

  el.listenNext.addEventListener("click", () => {
    state.listen.index = (state.listen.index + 1) % state.listen.list.length;
    renderListenTerm();
  });

  el.listenRate.addEventListener("input", () => {
    el.listenRateLabel.textContent = parseFloat(el.listenRate.value).toFixed(2) + "x";
  });

  /* ----------------------------------------------------------------- */
  /* Init                                                               */
  /* ----------------------------------------------------------------- */

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEYS.theme);
    } catch (err) {
      /* ignore */
    }
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }

  function initDetailMode() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEYS.detailMode);
    } catch (err) {
      /* ignore */
    }
    setDetailMode(saved || "full");
  }

  function init() {
    initTheme();
    initDetailMode();
    state.favorites = loadSet(STORAGE_KEYS.favorites);
    state.studied = loadSet(STORAGE_KEYS.studied);
    loadGlossary();
  }

  init();
})();
