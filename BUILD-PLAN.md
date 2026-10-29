# BUILD-PLAN.md — aman dixit · Personal Portfolio

> Master creative brief + implementation instructions for Claude Code.
> Status: **IMPLEMENTED — source files included; hero video assets are still pending.**

---

## 1. Website Overview

| | |
|---|---|
| **Name / brand** | aman dixit (lowercase wordmark; handle `am4ncodes`) |
| **Site type** | Personal portfolio |
| **Owner** | Aman Dixit — first-year B.Tech (CS & AI/ML) at Newton School of Technology, Pune. Aspiring AI engineer. NST '30. |
| **Goal** | Make a visitor (recruiter, hackathon judge, open-source maintainer, collaborator) feel in 10 seconds that this person ships real things, and reach his GitHub / LinkedIn / email in one click. |
| **Primary CTA** | Contact: GitHub, LinkedIn, Email (three-way "Let's talk" block) |
| **Feeling** | Cinematic, premium, 3D, liquid glass, minimal, friendly |
| **Palette** | Black and white, one light-green accent (mint). Lavender appears only as a faint refraction tint inside glass. |
| **Hero media** | One continuous, seamless 3-scene video, scroll-scrubbed |

Existing material to reuse (from the current `am4ncodes Portfolio`): project copy, journey timeline, highlights, email, links.

---

## 2. Core Positioning

**One-liner:** *Builds AI and web projects that actually work.*

**Positioning statement:** aman dixit is a student engineer who ships. Voice-deepfake detection, a healthcare screening prototype, a full-stack TypeScript assistant — real demos, real code, built in public, with Google Summer of Code 2027 as the next target.

**Tagline options (pick one at approval):**
1. *Built to work.*
2. *For ideas that deserve working code.* (existing line, keep as secondary)
3. *Small details, shipped properly.* (existing line, use in the pillars)

**Honest-claims rule:** No invented stats, clients, or awards. Only use facts from this brief.

---

## 3. Brand Personality

- **Calm, confident, curious.** Not loud, not corporate.
- **Friendly builder.** Warm microcopy, lowercase voice, first person.
- **Precise.** Details are sharp: alignment, easing, spacing.
- **Voice:** short sentences. Plain words. A little dry humor allowed.

Do: "I build things that work." Don't: "Passionate synergistic innovator."

---

## 4. Visual Direction

**Concept: "Liquid glass in a black void."**
A near-black cinematic world where soft, refractive glass objects (cards, orbs, panels) catch mint-green rim light. Everything feels like looking through thick, clean glass: blur, specular edges, subtle chromatic dispersion. White typography floats over it.

- **Mood references:** Apple visionOS glass, Awwwards "SOTD" cinematic scroll sites, product-launch hero films.
- **Light:** soft mint rim light from one side, faint lavender fill from the other, deep black falloff.
- **Space:** lots of negative space. One idea per screen.
- **Depth:** parallax layers, glass elements at different z-depths, subtle 3D tilt on hover.

---

## 5. Higgsfield Seedance 2.0 Asset Generation

**Settings (all clips):** 1080p · 8–12 s each · 24 fps · 16:9 · no text/logos in frame · no audio needed.

**Identity reference:** Use the reference photo of Aman from the project folder `Media/` (file to be placed at `Media/aman-reference.jpg`) as the identity reference for **every** generation, to keep the character consistent. *(Reference image was not found in this chat's files — it must be placed in `Media/` before generating.)*

**Continuity workflow (seamless single video):**
1. Generate **Scene 1**. Export its **last frame**.
2. Use that last frame as the **start frame** for **Scene 2**. Export its last frame.
3. Use that as the **start frame** for **Scene 3**.
4. Concatenate the three clips into one master video (ffmpeg, no re-encode gaps), then export the web versions in section 24.

**Global style prompt (prepend to every scene):**
> Cinematic, premium, calm confidence. Pure black void studio, soft mint-green rim light with a faint lavender fill, polished liquid-glass objects with refraction and specular highlights, subtle film grain, shallow depth of field, 35mm anamorphic feel, smooth slow camera motion, no text, no logos, no UI text legible.

**Negative prompt:** cheesy motivational look, text, watermark, extra fingers, warped face, fast cuts, shaky cam, bright daylight, cartoon.

---

## 6. Three Cinematic Scenes (one continuous shot)

### Scene 1 — THE ARRIVAL (≈10 s)
Aman stands calmly in a black void, mint rim light tracing his shoulders. Slow-floating liquid-glass shards drift around him. Camera does a slow, gentle half-orbit to a front-on view. He looks up toward camera with a subtle, friendly half-smile.
**Ends on:** medium-close front shot, glass shards forming a faint ring behind him.
*Scroll range: hero (0–25%).*

### Scene 2 — THE BUILDER (≈10 s)
Continuing from his face: camera pushes slowly past his shoulder as the glass shards unfold into floating glass panels around a dark desk. Panels softly glow with abstract shapes only: an audio waveform, a pulse/health ring, lines of code-like texture (no readable text). He sits and works; light flickers across his face.
**Ends on:** over-the-shoulder shot, one large glass panel filling frame.
*Scroll range: stats + mission + pillars (25–60%).*

### Scene 3 — THE SHOWCASE (≈10 s)
The camera pushes *into* the large glass panel and out the other side into a long dark glass gallery lined with softly lit glass cards. Aman walks toward camera, stops, and turns with a relaxed open hero pose. Mint light blooms behind him. Camera settles.
**Ends on:** wide, centered, symmetrical final frame — used as the closing backdrop for the CTA.
*Scroll range: work + story + CTA (60–100%).*

---

## 7. Website Structure

1. Loader
2. Fixed header (wordmark, nav, theme-neutral glass pill)
3. **Hero** (video scene 1)
4. **Stats strip**
5. **Mission**
6. **Three pillars**
7. **Story / journey**
8. **Featured work** (project showcase)
9. **Community / open source** (GSoC 2027)
10. **Final CTA** ("Let's talk.")
11. **Footer**

Single page, anchored sections: `#work`, `#about`, `#journey`, `#connect`.

---

## 8. Hero Section

- Full-viewport sticky video canvas, scrubbed by scroll.
- Giant kinetic headline, split by character, rises in on load:
  **"aman dixit"** (huge, lowercase) with a smaller line beneath: **"builds AI & web projects that work."**
- Small mono labels: `NST '30`, `Pune, India · IST`, `scroll ↓`.
- Mint glass pill CTA: **"See the work"** (anchors to work) and a ghost link **"Let's talk"**.
- As the user scrolls, headline scales up and fades, revealing Scene 1 → 2.

---

## 9. Animated Stats Strip

Four glass cells, numbers count up on enter, using real facts only:

| Value | Label |
|---|---|
| **3rd** | Place, Hacktober Hackday hackathon |
| **11** | Public repositories on GitHub |
| **2** | Projects with live demos |
| **2027** | Target year for Google Summer of Code |

Cells have a faint glass blur, 1px mint-tinted border, magnetic hover tilt.

---

## 10. Mission Section

Large scroll-revealed paragraph, word-by-word opacity reveal (dim → bright):

> I build tools that work in the real world — AI that listens for fakes, software that makes screening simpler, apps that are clean from the first commit to the deploy. Small details, shipped properly.

Label: `01 / Mission`.

---

## 11. Three Pillars Section

Three tall glass cards with 3D flip on hover/tap (front: title + one line; back: stack chips).

1. **Web development** — Responsive interfaces and the services behind them, from first commit to deployment. *Stack: HTML, JavaScript, TypeScript, React, Vite, Python, Flask, Express, Prisma, PostgreSQL.*
2. **AI applications** — Tools built on pretrained models, such as detecting AI-generated voices. *Stack: Hugging Face, wav2vec2, Python, Flask.*
3. **Tools & workflow** — Version control, tests and hosting habits that keep projects moving. *Stack: Git, GitHub, Vercel, Render, Vitest.*

---

## 12. Story Section ("Journey")

Horizontal-feeling vertical timeline, four steps with a mint progress line that draws on scroll:

1. **Learn** — Started at Newton School of Technology. First year, focused on AI engineering and web development.
2. **Build** — Three projects shipped: VoiceShield, MediLink, Palash Assistant Pro. Live demos for two.
3. **Compete** — 3rd place at Hacktober Hackday, Vishwakarma University, organised by Google Developer Group VU.
4. **Contribute** — Next stop: Google Summer of Code 2027. Contributing to open source and building in public to get ready.

Short "about" card beside it: studying (NST, 1st year), focus (AI engineering + web), goal (GSoC 2027).

---

## 13. Product / Service / Community Section

Reframed as **"Open source & community"** since there is no product to sell:
- Heading: *Building in public.*
- Copy: contributing to open source, aiming for GSoC 2027, competing in hackathons (GDG VU).
- Visual: a glass orb with a subtle commit-grid texture; button **"Follow the work on GitHub"**.

*(Do not claim any specific merged contributions or mentorships unless the owner adds them.)*

---

## 14. Featured Work / Content Section

Large, cinematic project rows, each a glass card with tilt + cursor-follow highlight. Hover reveals a live-demo cursor label.

| Project | Description | Stack | Links |
|---|---|---|---|
| **VoiceShield** | AI deepfake voice detector. Upload or record a sample and get a trust score from a wav2vec2 model, with every analysis saved to a history API. | React, Flask, Hugging Face, PostgreSQL | Code ↗ · voiceshield-phi.vercel.app |
| **MediLink** | Healthcare platform prototype built around needle-free anemia screening from a phone camera, with a patient portal and admin console. *A demo, not a validated medical tool.* | React, Vite, Express, Prisma | Code ↗ · medilink-swart.vercel.app |
| **Palash Assistant Pro** | Full-stack TypeScript project with separate client, server and shared code. | TypeScript, Vite, Drizzle, Vitest | Code ↗ (github.com/am4ndixit) |

Also mention: `luxdropz`, `nst` (practice repo) as small "more on GitHub" links.
**Hackathon project (SkillStress):** add a fourth row **only if** the owner supplies the repo link/description at approval (not found in public repos).

---

## 15. Final CTA Section

Full-viewport, Scene 3 end-frame behind a dark glass overlay.

- Giant kinetic type: **"Let's talk."**
- Subline: *For ideas that deserve working code.*
- Three large glass buttons: **GitHub** (github.com/am4ndixit) · **LinkedIn** (linkedin.com/in/am4ncodes) · **Email** (dixitaman117@gmail.com — click to copy with toast "copied").
- Magnetic buttons, mint glow on hover.

---

## 16. Footer

- Sitemap: Work · About · Journey · Connect
- Channels: GitHub · LinkedIn
- Email (click to copy)
- `India · IST` + live local-time clock
- `©2026 Aman Dixit · Aspiring AI engineer · NST '30`
- "Back to top" glass pill.

---

## 17. Complete Visual Style Guide

**Color tokens**
```
--black:        #0A0A0A   /* background */
--ink:          #F4F6F2   /* primary text (off-white) */
--ink-muted:    rgba(244,246,242,.62)
--glass:        rgba(255,255,255,.06)
--glass-border: rgba(255,255,255,.14)
--mint:         #9DF7BB   /* accent (≈ hsl(138 85% 78%)) */
--lavender:     #C9B8FF   /* refraction tint only, never text */
```
- Backgrounds are black; one optional light (off-white) section for contrast in the pillars/story block.
- Accent usage ≤ 5% of any screen.

**Liquid-glass recipe (CSS)**
```
background: linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.03));
backdrop-filter: blur(24px) saturate(160%);
border: 1px solid var(--glass-border);
box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 20px 60px rgba(0,0,0,.5);
border-radius: 28px;
```
Add a pseudo-element specular highlight that follows the cursor (radial-gradient at `--mx/--my`).

**Grain:** fixed full-screen noise overlay (SVG `feTurbulence` data-URI or small PNG tile), `opacity: .06`, `mix-blend-mode: overlay`, animated by 8-step jitter.

**Radii:** 28px cards, 999px pills. **Spacing:** 8-pt scale, generous section padding (`clamp(6rem, 14vw, 14rem)`).

---

## 18. Typography

- **Display / body:** **Geist** (500/600), tight tracking (`-0.06em` to `-0.08em` on display).
- **Labels / mono:** **Geist Mono** (500), uppercase, small, `+0.04em`.
- Fluid scale:
  - Display `clamp(3.5rem, 1.5rem + 9vw, 11rem)`
  - H1 `clamp(2.75rem, 2rem + 3vw, 6rem)`
  - H2 `clamp(1.75rem, 1.2rem + 2vw, 3.5rem)`
  - Body `clamp(1rem, .9rem + .3vw, 1.25rem)`; Label `.72rem`
- Line-height: display `.9`, body `1.4`.
- Loaded from Google Fonts with `display=swap` and system-ui fallback.

---

## 19. Animation Direction

- **Easing:** primary `cubic-bezier(.5,.6,0,1)` (GSAP: `power4.out` / custom ease). Never linear except scrub.
- **Kinetic typography:** split text into chars/words (own lightweight splitter, no paid plugin); stagger rise + slight rotateX, masked by overflow hidden.
- **Reveal:** word-by-word opacity on the mission paragraph (scrubbed).
- **Counters:** numbers count up with `snap`.
- **Page loader:** counter 0 → 100, glass shard assembles, then wipes up to reveal hero.
- **Section transitions:** clip-path / blur-to-sharp crossfades, 0.9–1.2 s.
- **Marquee:** slow horizontal text strip ("AI · Web · Open source · Hackathons") between sections.
- Durations: micro 0.25–0.4 s, section 0.9–1.4 s.
- Respect `prefers-reduced-motion` (see section 22).

---

## 20. Interaction Design

- **Custom cursor:** small mint dot + trailing ring; grows over links, shows "View" over projects, "Drag/Flip" over pillars. Disabled on touch.
- **Magnetic buttons:** translate toward cursor within 80 px radius.
- **Tilt cards:** 3D tilt (±8°) with specular highlight following the pointer.
- **Flip cards:** pillars flip on hover (desktop) / tap (mobile).
- **Email copy:** click copies, shows toast.
- **Nav:** glass pill header hides on scroll down, returns on scroll up; active-section indicator.
- **Focus states:** visible mint outline for keyboard users.

---

## 21. Scroll Behavior

- **Lenis** smooth scroll (`lerp: 0.085`, `smoothWheel: true`), wired to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker`.
- **Video scrubbing:** hero video is a `<video muted playsinline preload="auto">` pinned in a sticky container (total scroll length ≈ 600–700 vh). `ScrollTrigger` maps scroll progress → `video.currentTime`. Update with `requestAnimationFrame` and a small lerp to avoid jitter.
- **Scrub-friendly encoding is mandatory** (all-intra / short GOP, see section 24), otherwise scrubbing will stutter.
- **Fallback:** if video scrubbing is janky (Safari) or the device is low-power, switch to a **JPEG/WebP image sequence on canvas** (~120–150 frames, preloaded progressively).
- Sections overlay the pinned video using `z-index` and glass backgrounds; text blocks pin briefly (`pin: true`) with scrubbed reveals.
- Scroll progress bar: thin mint line at top.

---

## 22. Mobile Behavior

- Breakpoints: 480 / 768 / 1024 / 1440.
- Serve a **portrait-cropped / lower-bitrate** scrub video (720×1280 or 9:16 recrop) or the image sequence at fewer frames (≈ 80).
- Disable custom cursor, magnetic and tilt effects; keep tap-to-flip.
- Reduce blur radii (`backdrop-filter: blur(14px)`) for performance.
- Lenis kept on, with `syncTouch: false` (native touch scrolling).
- Hit targets ≥ 48 px, no horizontal scroll, safe-area insets respected.
- `prefers-reduced-motion`: no scrub-pin; show static poster, instant reveals, no grain animation.

---

## 23. Technical Implementation

**Stack (strict):** static site — HTML, CSS, vanilla JS. No React, no Next.js, no frameworks.

```
/ (project root)
├── BUILD-PLAN.md
├── index.html
├── style.css
├── script.js
├── Media/
│   └── aman-reference.jpg        # identity reference for Higgsfield
└── assets/
    ├── video/
    │   ├── hero-scrub-1080.mp4   # scrub-optimised master
    │   ├── hero-scrub-720.mp4    # mobile
    │   └── poster.webp
    ├── frames/                   # image-sequence fallback (frame-0001.webp …)
    ├── img/                      # og-image, favicon, project thumbs
    └── fonts/                    # (optional self-hosted Geist subset)
```

**CDN (pinned versions):** GSAP, ScrollTrigger, Lenis via cdnjs / jsDelivr, loaded with `defer`.

**Key build notes**
- Semantic HTML (`header, main, section, footer`), one `<h1>`, ARIA labels on icon buttons, skip link.
- All paths relative (`./assets/...`).
- CSS custom properties for tokens; mobile-first; `@media (hover:hover)` guards on hover effects.
- Performance: `will-change` only on animated layers, `transform/opacity` animations only, `IntersectionObserver` for lazy work, preload poster, lazy-load frames, single `requestAnimationFrame` loop, avoid layout thrash.
- Targets: Lighthouse Performance ≥ 90 mobile, LCP < 2.5 s (poster first), CLS ≈ 0.
- SEO/social: title, description, Open Graph + Twitter card, favicon, `theme-color: #0A0A0A`.
- Accessibility: contrast ≥ 4.5:1, focus-visible, reduced-motion path, alt text, no autoplay audio.

---

## 24. Video Export Specs (for scrubbing)

```bash
# concatenate scenes (same codec/res) then make scrub-friendly encodes
ffmpeg -i hero-master.mp4 -c:v libx264 -preset slow -crf 22 -g 1 -keyint_min 1 \
  -pix_fmt yuv420p -an -movflags +faststart hero-scrub-1080.mp4

ffmpeg -i hero-master.mp4 -vf "scale=720:-2" -c:v libx264 -crf 24 -g 2 \
  -pix_fmt yuv420p -an -movflags +faststart hero-scrub-720.mp4

# image sequence fallback
ffmpeg -i hero-master.mp4 -vf "fps=12,scale=1280:-2" -c:v libwebp -quality 75 frames/frame-%04d.webp
```
Keep 1080 scrub file under ~25 MB, 720 under ~10 MB.

---

## 25. Build Checklist (for Claude Code, after approval)

- [ ] Create file structure from section 23
- [ ] Build `index.html` with all sections in order (section 7)
- [ ] Write `style.css` using tokens and glass recipe (sections 17–18)
- [ ] Write `script.js`: Lenis + GSAP + ScrollTrigger, loader, splitter, video scrub with image-sequence fallback, cursor, magnetic, tilt, counters, copy-email
- [ ] Wire placeholders: `poster.webp` and a gradient fallback so the site works **before** the videos exist
- [ ] Test at 375, 768, 1440 widths; test reduced-motion
- [ ] Performance + accessibility pass

---

## 26. Open Items (need owner input)

1. Final **tagline** choice (section 2).
2. **Accent**: mint (default) or lavender?
3. **Reference image** for Higgsfield — place at `Media/aman-reference.jpg`.
4. **SkillStress** hackathon repo: link + one-line description to add as a featured project.
5. Confirm email/links to publish: dixitaman117@gmail.com · github.com/am4ndixit · linkedin.com/in/am4ncodes.
