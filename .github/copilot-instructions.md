Project: pcd-site — single-page static site

Summary
- Minimal static site with two top-level files: [index.html](index.html#L1-L248) and [styles.css](styles.css). No build system, bundler, or tests.

Quickstart (developer)
- Serve locally: `python -m http.server 8000` or `npx http-server` from the repository root.
- Open `http://localhost:8000` in a browser and use DevTools to inspect behaviors.

Architecture & why
- Single-page static HTML: interactive behavior implemented by an inline script inside [index.html](index.html#L1-L248).
- CSS handles layout and visual states; JS manipulates DOM classes and inline styles to animate elements.

Key runtime pieces (copy/paste examples)
- Menu positioning: items use `data-top` and `data-right` attributes and are positioned in `menuData` mapping created on DOMContentLoaded. When changing layout, update these dataset values instead of hardcoding positions in CSS.
  - See the mapping at the top of the inline script in [index.html](index.html#L1-L248).
- Radial word explosion: words with classes `.reform`, `.resist`, `.reflect` compute an `angle` via `getBoundingClientRect()` and are moved on scroll using `requestAnimationFrame` style transforms. Constants to tune: `scrollFactor` (scroll sensitivity).
  - Search for `const scrollFactor =` in [index.html](index.html#L1-L248).
- Oval animation for previous editions: `animateOval()` places `.edition-link` elements in an ellipse using `radiusX`, `radiusY`, and `angleOffset`. Hovering an edition link pauses the animation (`isPaused`).
  - Adjust `radiusX`, `radiusY`, and `speed` at the top of the inline script.
- Quote-section pinning: `.quote-section` uses getBoundingClientRect to compute `progress` and calls `updateBlackout(cat)` to toggle `.visible` and `.active` classes on text and header labels.
  - Function: `updateBlackout(cat)` controls which `.text` items get `.visible`.

Conventions & patterns
- Inline script is the single source of JS behavior. If you split it into a separate file, keep the same load timing (run after DOMContentLoaded).
- Visual state is driven by toggling CSS classes (`visible`, `active`) — prefer toggling classes rather than directly setting many inline styles for maintainability.
- Data attributes drive layout (e.g., `data-top`, `data-right`) — preserve these when refactoring markup.
- Edition link count determines spacing: code uses `i / editionLinks.length` to compute position; adding/removing `.edition-link` affects spacing automatically.

Editing & debugging tips
- Use DevTools to simulate scroll/resize and to step through `DOMContentLoaded` handlers.
- Place breakpoints in the inline script (search for `animateOval`, `updateBlackout`, `window.addEventListener('scroll'`) to inspect values like `angleOffset`, `scrollY`, `progress`.
- Quick local server commands:
  - Python 3: `python -m http.server 8000`
  - Node: `npx http-server -p 8000`

Testing & CI
- There is currently no test suite or CI configured. Keep changes small and verify visually in multiple viewport sizes.

When changing animations or timings
- Update the constants at the top of the inline script: `scrollFactor`, `radiusX`, `radiusY`, `speed`.
- If animation feels janky, prefer reducing work in scroll handlers: move heavy math to `requestAnimationFrame` and cache bounding rects where possible.

Files to inspect when troubleshooting
- [index.html](index.html#L1-L248): primary behavior and content.
- [styles.css](styles.css): visual rules, classes like `.visible` and `.active` control presentation.

Commit & code style guidance
- Small, focused commits. When adding JS, prefer extracting the inline script into `assets/js/` only if you also update the HTML to load it at the same point (after DOM ready).

Questions for maintainers (ask the user)
- Would you like the inline script split into `assets/js/main.js`? This makes testing and linting easier.
- Are there accessibility or responsiveness targets (screen widths) to validate beyond visual checks?

If anything above is unclear or you want the instructions adjusted, tell me what to expand or change.
