# Helena Restrepo · Portfolio

My personal portfolio and resume site: plain HTML, CSS and JavaScript, hosted free on GitHub Pages.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Me (flip book + experience, skills, education) | `about.html` |
| Work (overview) | `work.html` |
| Case studies | `work-quit-games.html`, `work-monarch.html`, `work-storage-rentals.html`, `work-classical-waves.html` |
| Social | `social.html` |
| Photography | `photography.html` |

Other files:

```
css/styles.css               ← colors, fonts, layout (palette is at the very top)
js/main.js                   ← mobile menu, fade-ins, counters, flip book, photo viewer
images/                      ← your photos go here (see images/README.md)
Helena-Restrepo-Resume.pdf   ← linked from every "Résumé" button
```

## Common edits

- **Change text:** open the page's `.html` file and edit the words between the tags.
- **Nav or footer:** these are repeated at the top and bottom of every page, so update them in each file.
- **Update the resume:** replace `Helena-Restrepo-Resume.pdf` with a new file of the **exact same name**.
- **Add photos:** see [`images/README.md`](images/README.md).
- **Colors and fonts:** edit the `:root` section at the top of `css/styles.css`.
- **About-me book pages:** each page is an `<article class="page">` inside `about.html`. Edit text there; keep the order (cover first).

## Preview locally
Double-click `index.html` to open it in your browser.

## Publish (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, `/ (root)` → Save.
Live at **https://helenarestrepo.github.io/my-website/**
