# Images to add

Drop your photos into this `images/` folder using **exactly** these file names (all lowercase).
The site picks them up automatically, with no code changes needed. Until a file exists, the site shows a soft colored placeholder labeled with the file name it's waiting for.

**Tips**
- Photos: export as **JPG, quality ~80%**, under **400 KB** each (free tool: [squoosh.app](https://squoosh.app)).
- Cutouts: export as **PNG with a transparent background** (free tool: [remove.bg](https://www.remove.bg)).
- Bigger is fine if the **shape** matches; the site crops to fill each frame.
- Only use client work you're allowed to share publicly.

---

## 1. Home page cutouts → `images/cutouts/` folder

These sit along the bottom of the home page hero, Pretty Little Marketer style. Use **transparent PNGs** with the object touching the bottom edge of the image. Black-and-white works great for the photo of you.

| File name | Shape (w × h) | Idea |
|---|---|---|
| `cutouts/helena.png` | 900 × 1200 | You, cut out (the centerpiece) |
| `cutouts/palm.png` | 800 × 1200 | A palm tree (Miami) |
| `cutouts/cafecito.png` | 800 × 800 | A cafecito or coffee cup |
| `cutouts/dog.png` | 800 × 800 | One of your dogs |
| `cutouts/popcorn.png` | 900 × 1200 | Popcorn bucket or film clapper |
| `cutouts/vinyl.png` | 800 × 800 | A record or headphones |
| `cutouts/boots.png` | 900 × 1200 | Cowboy boots (Texas) |

Want different objects? Use any names you like, then update the matching `cutouts/...` lines near the top of `index.html`.

## 2. About page (the book) & home "get to know me"

| File name | Size (px) | Shape | Where |
|---|---|---|---|
| `helena-about.jpg` | 1000 × 1250 | 4:5 | Chapter 1 of the book, plus the Home page collage |
| `dogs-1.jpg`, `dogs-2.jpg`, `dogs-3.jpg` | 600 × 600 | square | Chapter 8 photo-booth strip, plus Home |
| `film-interstellar.jpg`, `film-arrival.jpg`, `film-dune.jpg`, `film-little-miss-sunshine.jpg` | 400 × 600 | 2:3 poster | Chapter 3: your top 4 films |
| `book-normal-people.jpg`, `book-talking-at-night.jpg`, `book-song-of-achilles.jpg`, `book-project-hail-mary.jpg` | 400 × 600 | 2:3 cover | Chapter 4: your favorite books |
| `food.jpg` | 800 × 800 | square | Chapter 6: a favorite meal |

**Text still to fill in:** open `about.html` and search for these placeholders: `restaurant` (Beli top spots), `song · artist` (on repeat) and `name · name` (your dogs).

## 3. Work: covers and case study galleries

| File names | Size (px) | Shape |
|---|---|---|
| `quit-games-cover.jpg`, `monarch-cover.jpg`, `sra-cover.jpg`, `classical-waves-cover.jpg` | 1600 × 900 | 16:9 (the Work page crops to 4:3, so keep the subject centered) |
| `quit-games-1.jpg`, `monarch-1.jpg`, `sra-1.jpg`, `classical-waves-1.jpg` | 1600 × 800 | 2:1 wide banner |
| `…-2.jpg` and `…-3.jpg` for each project (e.g. `monarch-2.jpg`) | 1200 × 900 | 4:3 |

## 4. Social page & Home dark section

| File names | Size (px) | Shape |
|---|---|---|
| `social-01.jpg` … `social-06.jpg` | 1080 × 1350 | 4:5 (Instagram portrait) |

## 5. Photography page (polaroids)

| File names | Size (px) | Shape |
|---|---|---|
| `photo-01.jpg` … `photo-12.jpg` | 1200 × 1200 | square (polaroid style) |

**Captions:** open `photography.html` and replace each `caption goes here · location`.

## 6. Link preview

| File name | Size (px) | What to use |
|---|---|---|
| `og-image.jpg` | 1200 × 630 | Shown when your link is shared on LinkedIn, iMessage or Slack. A screenshot of your home page works well. |
