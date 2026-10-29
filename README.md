# aman dixit — personal portfolio

A cinematic, responsive personal portfolio built with plain HTML, CSS, and modern JavaScript. Features a real-time interactive 3D WebGL Neural Core model, an interactive 3D GitHub Contributions matrix (Three.js), liquid-glass aesthetics, GSAP ScrollTrigger timeline choreography, and Lenis smooth scrolling.

## Run locally

1. Extract this folder.
2. Open it in VS Code or any text editor.
3. Start **Live Server** from `index.html`, or run a local server:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
4. Open `http://localhost:8000` (or the URL shown by your server).

## Features & 3D Model Rendering

- **3D WebGL Holographic Neural Core:** Real-time interactive 3D model with a faceted liquid-glass icosahedron core, glowing neural wireframe lattice, inner pulsing quantum nucleus, nested gyroscopic gimbal rings with orbiting data satellites, floating geometric crystal shards, and a dynamic 3D neural particle constellation.
- **3D GitHub Contributions Landscape:** Real-time interactive 3D commit matrix visualizing contributions on `github.com/am4ndixit` across 53 weeks. Extrudes 3D glowing emerald/mint pillars with heights proportional to daily commits, floating energy beacons on peak days, 3D drag-to-rotate orbital controls, and raycasting hover inspection.
- **Featured Projects:** Showcases **SkillStress** (AI agent evaluation & stress-testing prototype deployed at [skillstress.vercel.app](https://skillstress.vercel.app/)), **MediLink**, and **Palash Assistant Pro**.
- **Lighting & Interactivity:** Mint-green rim light (`#9DF7BB`) and lavender backlight (`#C9B8FF`) dynamically track mouse/touch pointer movements with smooth inertia damping.
- **Scroll Choreography:** Synchronized 4-phase camera transitions that guide the visitor seamlessly through the Hero, About/Stats, Selected Work, and Connect/CTA sections.
- **Zero Errors:** Zero 404 network requests, resilient clipboard copying, and responsive character splitting with word-boundary preservation.

## Main files

- `index.html` — Semantic structure, meta tags, and stage markup
- `style.css` — Design system, tokens, liquid-glass cards, and 3D transform hierarchy
- `script.js` — Three.js 3D scene engine, 3D contributions model, Lenis smooth scrolling, GSAP animations, and interaction handlers
- `assets/video/` — Optional cinematic hero video assets & generated fallback poster
- `BUILD-PLAN.md` — Master creative brief and design specifications
