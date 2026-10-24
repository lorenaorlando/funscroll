# funscroll.life

FUNSCROLL is the opposite of doomscroll: websites that use the scroll to play, not to trap you.
A project by [Lorena Orlando](https://lorenaorlando.com).

Plain HTML, CSS and JS. No build step. Open `index.html` in a browser (or use Live Server).

| page | what it is |
| --- | --- |
| `index.html` | the funscrollable home |
| `manifiesto.html` | the full essay as a scroll that unrolls sideways (ES / EN) |
| `funscrollers.html` | the inspiring sites as a deck of cards, the random door, the webring |
| `kit.html` | the funscroll kit docs, logos and badges |
| `es/` | Spanish versions of the home, funscrollers and kit pages |

English pages live in the root, Spanish ones in `es/`. Each page has an EN | ES switch next to the logo.
The manifesto is a single page with both languages (Spanish by default, `manifiesto.html#en` opens it in English).
When you change text on an English page, change its twin in `es/` too.

## Where to edit things

- **The funscrollers (cards):** `assets/js/funscrollers.js`. Each site has a `concept` and an optional `note` (the "why it's here" text on the back of the card).
- **Webring members:** the `MEMBERS` list at the top of `kit/ring.js`.
- **Submissions** arrive as GitHub issues through `.github/ISSUE_TEMPLATE/join-the-ring.yml`.
- **Colors and fonts:** the `:root` block in `assets/css/site.css`. Fonts: Bricolage Grotesque (titles), Recursive with its casual axis (text), JetBrains Mono (labels).
- **The menu (the ship's wheel) and the face shapes:** `assets/js/site.js`.

## The funscroll kit

`kit/funscroll.js` + `kit/funscroll.css`: dependency-free effects driven by `data-fs-*` attributes.
The full list is in the comment at the top of `kit/funscroll.js`, and live demos are on `kit.html`.
