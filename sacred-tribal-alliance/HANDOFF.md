# Sacred Tribal Alliance — Full Handoff Document
**Date:** 2026-09-16  
**Prepared by:** Claude (session b3d00ea5)  
**For:** Brennan Ledet / Sacred Tribal Alliance

---

## Overview

Sacred Tribal Alliance is a **contact-first, inquiry-only** static website for Brennan Ledet.  
Core positioning: **"Traditional medicines. Fair access. Respectful sourcing."**

This site is **completely separate** from The Right Medicine Church — no mixing, reuse, or implied connection to that church, Ralph/Justin, church ceremony work, retreat work, or prior church compliance planning.

No ecommerce. No checkout. No buy buttons. No pricing. No medical claims.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Site type | Static HTML/CSS/JS — no framework, no build step |
| Hosting | Cloudflare Pages (deploy root directory `/`) |
| Source | GitHub repo (`ryan-ai-42o/-sacred-tribal-alliance` or renamed) |
| Contact form | `mailto:` — built client-side in `assets/script.js` |
| Fonts | System stack only (no Google Fonts CDN) |

---

## Site Structure — Pages

```
index.html          Homepage
our-story.html      Brennan's story
medicines.html      Medicines overview (links to hape + sananga)
hape.html           Hapé / Rapé detail + link to blends
sananga.html        Sananga detail
blends.html         All blend catalog (currently 23 blends — needs trim to 12)
sourcing.html       Sourcing principles
reciprocity.html    Reciprocity principles
contact.html        Contact form (mailto)

assets/
  styles.css        All CSS
  script.js         Nav toggle + mailto form logic
  hero-sunset.jpg   Hero background (homepage)
  our-story-tree.jpg  Our Story page photo
  sourcing-roots.jpg  Sourcing page photo (~960KB — needs compression)

robots.txt          (placeholder domain — needs real domain)
sitemap.xml         (placeholder domain — needs real domain)
README.md           Dev notes
```

---

## CSS Design Tokens

```css
:root {
  --color-bg: #faf6f0;
  --color-bg-alt: #f1ebe1;
  --color-text: #2b2724;
  --color-muted: #6b6258;
  --color-line: #ddd4c7;
  --color-accent: #8a5a44;
  --color-accent-deep: #4b5d46;
  --font-serif: Georgia, "Iowan Old Style", "Palatino Linotype", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --max-width: 920px;
}
```

Earth-tone palette. No logo file — site uses plain text wordmark "Sacred Tribal Alliance".

---

## Footer Disclaimer (on every page)

```html
<p class="footer-legal">Information on this site is educational and spiritual in nature. It is not medical advice, diagnosis, treatment, or a promise of results. Offerings are available by inquiry only so sourcing, preparation, safety, and fit can be discussed with care.</p>
```

---

## Hapé / Rapé Content

### hape.html — Page Summary

Hapé (also spelled Rapé, pronounced hah-PAY) is a sacred, finely ground powder made from mapacho tobacco and other Amazonian plant materials. It has been used for centuries by indigenous peoples of the Amazon for ceremony, clearing, grounding, and prayer.

**Safety note on page:**
> Hapé contains concentrated mapacho tobacco and should be used with care. It is not appropriate for everyone. Legal status varies by jurisdiction. This page is educational, not a recommendation.

Page links to `blends.html` for the full catalog.

---

### blends.html — All 23 Current Blends

All blends use "traditionally associated with" language. Two disclaimer blocks at bottom.

#### Full blend list (to be trimmed to 12 confirmed — see Open Decisions):

| # | Blend Name | Notes |
|---|---|---|
| 1 | Paricá | Deeply grounding; forest-rooted |
| 2 | Tsunu | Widely known; gentle, heart-centered |
| 3 | Samsara | Gentle, heart-centered blend |
| 4 | Murici | Grounding/forest-rooted |
| 5 | Mulateiro | Forest-rooted; bark medicine tradition |
| 6 | Mentholado | Cooling, clearing, breath |
| 7 | Jurema | Jurema Preta vine; deep tradition |
| 8 | Cumaru | Tonka bean tradition; heart-warming |
| 9 | Canela de Velho | "Old man's cinnamon"; circulation tradition |
| 10 | Veia de Pajé | "Shaman's vein"; ceremony blend |
| 11 | Pixuri | Aromatic; forest-rooted |
| 12 | Samaúma | Ceiba tree spirit; expansive |
| 13 | Flor de Laranjeira | Orange blossom; gentle, heart-centered |
| 14 | Cacao | Heart-opening tradition |
| 15 | Bobinsana | Emotional support; river plant |
| 16 | Rose Vermea | "Red rose"; heart-centered |
| 17 | Canaleiro | Strong clearing |
| 18 | 7 Hiervas | Seven herbs tradition |
| 19 | Gesileo | Ceremony blend |
| 20 | Katsumari | Stronger/safety-review category |
| 21 | Angico | Angico bark; strong |
| 22 | Chiric Sanango | Plant spirit work; stronger/safety-review |
| 23 | Palo Santo | Holy wood; clearing |

#### Flood Prompt 3-Category Grouping Spec:
1. **Gentle / Heart-Centered** — Tsunu, Samsara, Flor de Laranjeira, Cacao, Bobinsana, Rose Vermea, Cumaru
2. **Grounding / Forest-Rooted** — Paricá, Murici, Mulateiro, Jurema, Pixuri, Samaúma, Palo Santo
3. **Stronger / Safety-Review First** — Veia de Pajé, Katsumari, Angico, Chiric Sanango, Canaleiro, 7 Hiervas, Gesileo, Mentholado

**Open Decision:** Confirm which 12 of these 23 are actually in Brennan's current catalog before trimming the page.

---

## Sananga Content

### sananga.html — Page Summary

Sananga is a sacred eye medicine made from the roots and bark of the *Tabernaemontana undulata* (or related species) plant, used by Amazonian peoples for clearing energetic blockages and sharpening vision and focus.

**Safety/handling note on page:**
> Sananga causes a strong, temporary burning or stinging sensation and may blur vision for several minutes. Do not drive or operate machinery immediately after use. Do not share applicators. All inquiries include a preparation and safety conversation before any offering is made. This is not medical advice and is not a treatment for any condition. Legal status varies by jurisdiction.

---

## Verified Bio Research — Brennan Ledet

*All sourced from public Instagram @brennanledet7 and publicly visible captions. Nothing invented.*

### Verified facts:
- **Full name:** Brennan Ledet
- **Location base:** Louisiana / Southeast (bayou regional language and imagery in posts)
- **Instagram:** @brennanledet7
- **Collaborator:** Stephanie Bourque — @bayoutruewellness_ (Bayou True Wellness)
- **Teacher named:** Antonio (first name only visible in posts; no last name to verify)
- **Communities mentioned:** Indigenous Amazonian plant medicine tradition (no specific tribal names verified in visible captions)
- **Practice framing in his own posts:** Grounding, ceremony, plant spirit, clearing; no clinical claims visible

### Short Bio Draft (for site use):
> Brennan Ledet has spent years working closely with traditional Amazonian plant medicine communities, learning directly from practitioners who carry these traditions. His work with Sacred Tribal Alliance is grounded in respect, reciprocity, and honest access — not ceremony packaging or spiritual tourism.

### Long Bio Draft (for site use — replace placeholder in our-story.html):
> Brennan Ledet grew up drawn to the natural world and the spaces where land, spirit, and healing overlap. That path led him deep into relationships with Amazonian plant medicine traditions — learning from Antonio and others who carry these practices within living communities.  
>  
> What he found wasn't a product to sell. It was a responsibility. The medicines — Hapé, Sananga, and others — carry meaning and protocol that can't be stripped out for convenience. Sacred Tribal Alliance exists to honor that: to make inquiry-based access available for people who approach these traditions seriously, and to ensure that sourcing flows back to the people and places the medicines come from.  
>  
> Brennan works alongside Stephanie Bourque of Bayou True Wellness, whose complementary practice of bayou-rooted wellness adds another layer of regional grounding to the work.  
>  
> *This bio is a draft. Brennan should revise it in his own voice before publishing.*

---

## Flood Prompt Architecture (for Instagram/content use)

### Core architecture:
- Each blend gets a short post using "traditionally associated with" language
- Three content categories map to blend categories:
  1. **Gentle/Heart-Centered** — soft, accessible, emotional language
  2. **Grounding/Forest-Rooted** — earth, roots, land, stability language
  3. **Stronger/Safety-Review First** — honest about intensity, always links to inquiry

### Global disclaimer to append to all product posts:
> This content is educational and spiritual in nature. Not medical advice. Offerings by inquiry only.

### Flood prompt add-on (injectable):
```
For each blend in the catalog:
- Category: [Gentle/Heart-Centered | Grounding/Forest-Rooted | Stronger/Safety-Review First]
- One sentence: what this blend is traditionally associated with (no medical claims)
- One sentence: who might inquire about it (framed as fit, not prescription)
- Closing CTA: "Reach out to start a conversation."
- Append global disclaimer

Do not invent tribal affiliations, certifications, clinical benefits, or legal status claims.
Do not reference The Right Medicine Church or any ceremony/retreat context.
```

---

## Before-Launch Checklist

| # | Item | Status |
|---|---|---|
| 1 | Replace `placeholder@example.com` in `assets/script.js` with Brennan's real email | **OPEN** |
| 2 | Set real domain in `robots.txt` | **OPEN** |
| 3 | Set real domain in `sitemap.xml` (9 URLs) | **OPEN** |
| 4 | Confirm which 12 blends are in current catalog | **OPEN** |
| 5 | Assign confirmed blends to 3 categories | **OPEN** |
| 6 | Trim `blends.html` from 23 to 12 | **OPEN** |
| 7 | Update `our-story.html` with Brennan's real bio (use short or long draft above, or write new) | **OPEN** |
| 8 | Decide if Stephanie Bourque gets mention / section / page | **OPEN** |
| 9 | Compress `sourcing-roots.jpg` (~960KB → target <200KB) | **OPEN** |
| 10 | Confirm whether Kambo is part of STA offering | **OPEN** |
| 11 | Fix GitHub upload — delete `brenen` subfolder, re-upload files at root | **OPEN** |
| 12 | Verify legal structure (business registration, product classification) before enabling any purchase path | **OPEN** |

---

## Open Decisions (8)

1. **Brand name finalized?** "Sacred Tribal Alliance" or a variation?
2. **Which 12 blends** are confirmed in current catalog?
3. **3-category assignments** for the confirmed 12
4. **Spelling checks needed:** Paricá, Tsunu, Flor de Laranjeira, Chiric Sanango (confirm correct spellings with Brennan)
5. **Stephanie Bourque's role on site** — mention only / dedicated section / her own page?
6. **Contact email** — what address goes in the mailto form?
7. **Kambo** — in scope for STA or separate project?
8. **Real domain** — what is the final URL?

---

## Compliance Notes (non-negotiable)

- No medical claims, diagnosis, treatment language, or promises of results
- No invented tribal affiliations, certifications, or source names
- No ecommerce until business registration, tobacco/age/shipping rules, Sananga safety handling, labeling, batch records, and payment processor approval are complete
- No reference to The Right Medicine Church or Ralph/Justin
- No ceremony/retreat packaging
- No fake testimonials
- Images and stories from Facebook/Instagram require permission before publishing
- "Directly supports tribes" claim cannot be made without a documented mechanism
- Legal status varies language required on Hapé and Sananga pages

---

## Deployment Steps (when ready)

1. Push files to GitHub root (not in a subfolder — the `brenen` subfolder issue must be fixed)
2. Go to Cloudflare Dashboard → Pages → Create a project → Connect to GitHub
3. Select `ryan-ai-42o/-sacred-tribal-alliance` repo
4. Set output directory to `/` (root)
5. No build command needed — static HTML
6. Deploy

---

*End of handoff document.*
