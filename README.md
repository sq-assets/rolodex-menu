# Rolodex menu

A 3D drum of titles from a blog or portfolio that spins on its own. The page always scrolls normally and the drum spins along with it, so visitors are never trapped. Visitors can also drag it. Hovering a title in the centre strip stops the drum, the title grows and changes colour, and its photos pop up behind it. Clicking a title opens its post. The sides stay free so the drum keeps spinning there.

### Content
A blog or portfolio, one title per post or project:
- **Title:** the post or project title
- **Photo:** the thumbnail; GIF and WebP thumbnails animate

Or use `data-collections="/a,/b,/c"` to show one title per collection, with all of that collection's thumbnails as its photos.

### Install

Paste into **Pages → Website Tools → Code Injection → Footer**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sq-assets/rolodex-menu@v1.4.0/effect.css">
<script src="https://cdn.jsdelivr.net/gh/sq-assets/rolodex-menu@v1.4.0/effect.js"></script>
```

This loads a fixed version (`@v1.4.0`), so the script and styles always match. To use a newer version, change the number in both lines to the latest tag under **Releases / Tags**. `@main` also works, but jsDelivr can take up to 12 hours to pick up changes to it, and may briefly serve a mismatched script and style file.

### Code Block

Put this in a Code Block in the section where you want the rolodex:

```html
<div class="rolodex"
  data-collection="/portfolio"
  data-max="20"
  data-label="Our work"

  data-text-size="clamp(28px,4vw,72px)"
  data-text-color="#111111"
  data-font-name=""
  data-font-url=""
  data-font-weight="700"
  data-uppercase="on"
  data-row-height="130"
  data-spacing="20"

  data-active-color="#F2AED1"
  data-active-font-name=""
  data-active-font-url=""
  data-active-italic="off"
  data-grow="1.3"
  data-active-outline="1"
  data-active-outline-color="#111111"
  data-glow="on"
  data-glow-color="#E8A6D6"
  data-glow-size="24"

  data-images="3"
  data-image-position="random"
  data-image-size="250"
  data-image-size-max="400"
  data-ratio="4/5"
  data-swap="1.2"
  data-gap="20"
  data-image-link="on"
  data-image-link-target="same"

  data-height="640"
  data-spin="1"
  data-scroll-spin="1"
  data-drag="on"
  data-hit-width="50"></div>
```

Leave out any setting to use its default.

### Settings

**Content**
| Setting | What it does |
|---|---|
| `data-collection` | Blog or portfolio URL, one title per post |
| `data-collections` | Instead: `/a,/b,/c`, one title per collection |
| `data-max` | Most titles to show (default 20) |
| `data-label` | Name for screen readers and SEO |

**Titles**
| Setting | What it does |
|---|---|
| `data-text-size` | Title size, e.g. `clamp(28px,4vw,72px)` or `90px` |
| `data-text-color` | Title colour (default black) |
| `data-font-name` | A Google Font by name, or your uploaded font's name. Default: your site's heading font |
| `data-font-url` | Link to an uploaded font file (then `data-font-name` is just its name) |
| `data-font-weight` | `100`–`900` |
| `data-uppercase` | `on` (default) or `off` |
| `data-fit` | `on` (default) = titles shrink so the longest one, plus its hover grow, fits the screen. `data-text-size` is then the largest they get. `off` = always use `data-text-size` |
| `data-fit-width` | How much of the width the longest title may use, in % (default 92) |
| `data-row-height` | Height of each row in px (default 130). Lower = closer together |
| `data-spacing` | Extra gap between rows in px (default 30) |

**Hovered title**
| Setting | What it does |
|---|---|
| `data-active-color` | Colour on hover (default: your site's light accent colour) |
| `data-active-font-name` / `data-active-font-url` / `data-active-font-weight` | Switch to a different font on hover |
| `data-active-italic` | `on` = italic on hover |
| `data-grow` | How much it grows (`1.3` = 30% bigger) |
| `data-active-outline` | Outline around the hovered title's letters, in px, e.g. `1` |
| `data-active-outline-color` | Outline colour (default `#111111`) |
| `data-glow` | `on` = a soft glow around the hovered title |
| `data-glow-color` | Glow colour (default: the hover colour) |
| `data-glow-size` | How far the glow spreads, in px (default 24) |

**Images**
| Setting | What it does |
|---|---|
| `data-images` | How many show at once, 1–8 (default 3) |
| `data-image-position` | `random` = scattered around the section, `centre` = centred behind the title (several overlap like a loose pile). Default: `centre` for 1 image, `random` for more |
| `data-image-size` / `data-image-size-max` | Smallest and largest width in px; each image picks a size in between. Set both the same for one size |
| `data-ratio` | Frame shape, e.g. `4/5`, `1/1`, `16/9` |
| `data-swap` | Seconds between new images when a collection has more than fit |
| `data-gap` | Random only: minimum space between images in px |
| `data-image-link` | `on` = clicking an image opens the same post as its title. Default `off` |
| `data-image-link-target` | `new` = open in a new tab. Default: same tab |

**Motion**
| Setting | What it does |
|---|---|
| `data-height` | Height of the rolodex in px (default 640) |
| `data-spin` | Auto-spin speed (`0` = off, `3` = three times faster) |
| `data-scroll-spin` | How much scrolling the page spins it (`0` = off) |
| `data-drag` | `on` / `off`: drag to spin |
| `data-hit-width` | How much of the width, in the middle, picks up hovers and clicks (default `50` = middle 50%). The sides stay free so the drum keeps spinning |

### Corner text (optional)
Add to the same Code Block, after the `div`:

```html
<span class="rdx-c tl">Top left</span>
<span class="rdx-c tr">Top right</span>
<span class="rdx-c bl">Bottom left</span>
<span class="rdx-c br">Bottom right</span>
```

### Notes
- Phones have no hover, so on mobile the titles spin and open their post when tapped.
- The images step aside while you're in Edit mode.
