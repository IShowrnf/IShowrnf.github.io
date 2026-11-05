# NullClient launcher site

The NullClient (EaglercraftX 1.12 · Aether edition) launcher website.
Two ways to play, zero install:

- **Play online (no download)** — boots the client in the browser (iframe wrapper + fullscreen button)
- **Download for pc** — the same build as a single offline `.html` file

Two themes, switchable site-wide (saved in the browser):

| theme | look |
|---|---|
| `✿ femboy` | soft pastel pink, sparkles, floating hearts, cute bubble mascot |
| `▣ steel` | black glass, silver trim, code-drawn helmet — no gold |

## files that matter

```
index.html      ← launcher page (theme picker, CTAs, faq)
play/index.html ← "playing now" page: themed top bar + fullscreen-iframed game
game/aether.html← THE BUILD (NullClient offline html, ~35 MB)
css/  themes.css (palettes) + site.css (layout)
js/   theme.js   (theme switcher, localStorage)
assets/img/mascot.png ← optional; drop an image here and it replaces the bubble mascot automatically
```

## publish it (10 minutes)

> the 35 MB game file is over the 25 MB limit of GitHub's web upload, so push with git
> once — after that, edits to the css/html alone can be done in the web editor.

1. create an empty repository on GitHub (any name, e.g. `nullclient-site`)
2. from inside this folder, run:

```bash
git init
git add .
git commit -m "nullclient launcher site"
git branch -M main
git remote add origin https://github.com/YOURNAME/YOURREPO.git
git push -u origin main
```

3. on GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**

4. wait ~1 minute → your site is live at
   `https://YOURNAME.github.io/`

## quick remote preview before publishing

from this folder:

```bash
python -m http.server 8080
```

open `http://localhost:8080` — html/css preview fully; the game iframe needs an
origin with storage, so it's most reliable on the published pages URL.

## swapping in a newer build

replace `game/aether.html` with the new offline html and push. nothing else changes.

## adding a theme

1. add a palette block to `css/themes.css` (`:root[data-theme="sunset"] { ... }`)
2. add a button to `index.html`'s header nav: `<button data-head-to="sunset">styled</button>`
3. (optional) add a matching swatch card in the "choose the look" section
