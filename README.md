# JC Tapire — Personal Portfolio

A responsive, accessible portfolio made with **HTML, CSS, and vanilla JavaScript**. No framework, build step, or production dependencies.

## Preview

Open `index.html` in a modern browser, or run the optional local preview server:

```sh
node server.cjs
```

Then visit `http://localhost:4173`. Stop the server with Ctrl+C.

## Make it yours

1. Edit **`content.js`**: name, email, school, location, profile photo, social accounts, skills, activities, and projects.
2. Edit **`index.html`**: hero introduction, professional title, about text, interests, and personal values.
3. Replace images in **`assets/`**. Update alt text to accurately describe your photos. Use compressed JPG/WebP images and retain dimensions to prevent layout shifts.
4. Adjust colors and typography using the custom properties at the beginning of **`styles.css`**.

**All biography text, skills, activities, and concept projects are sample content.** The displayed name is taken from the configured Git identity; replace it with your preferred full name. School, location, and email are intentionally placeholders. No real achievements or project results are implied. The GitHub profile and portfolio source link use the repository owner's account. Empty social, demo, and source URLs are hidden, not linked to fake destinations.

### Contact form

The form validates required fields, email format, and message length. It includes field-specific errors, a honeypot, loading feedback, timeouts, and honest delivery messages.

- **Default:** a demo form, which clearly explains that sending is not configured.
- **Email draft:** replace `email` in `content.js` and leave `formEndpoint` empty. Valid submission opens the visitor's email application. The visitor must send the email themselves; the site does not claim delivery.
- **Real delivery:** create and verify a form with [Formspree](https://formspree.io), then set `formEndpoint` to your HTTPS endpoint. Configure allowed domains and spam protection in the service. A 2xx response produces a success message; network/server errors preserve the message. The provider remains responsible for actual email delivery.

Never put secret keys or tokens in this static site. A production form service must validate and rate-limit submissions on its own server. `hello@example.com` is not your inbox.

## GitHub Pages

After the files are pushed, open the repository's **Settings → Pages**. Select **Deploy from a branch**, choose **main**, choose **/ (root)**, and save. The expected URL is:

`https://jonhcarlotapire.github.io/portfolio/`

All local asset paths are relative so the site works under `/portfolio/`. Pages must be enabled by the repository owner; pushing alone does not activate it.

## Accessibility & interaction

- Semantic headings, a skip link, keyboard-visible focus, and meaningful labels.
- Active section navigation, a mobile menu with Escape support, and accessible project filters.
- Native modal dialogs with keyboard focus containment, Escape closing, and return-to-trigger focus.
- Hover information is also available via visible buttons on touch screens.
- Reduced-motion preferences disable animation and smooth scrolling.
- Optimized local images, lazy loading, inline SVG icons, and no JavaScript libraries.

Google Fonts supplies DM Sans and Instrument Serif; system/Georgia fallbacks keep the site usable if fonts are unavailable. Photos are stock placeholders from Unsplash, not photos of the portfolio owner or their actual events. Replace them before presenting the portfolio as your own. Illustrative project covers and icons are local SVG assets.

## Optional development checks

Node.js is only needed for the preview server and tests, not to run the website.

```sh
npm ci
npx playwright install chromium
npm test
```

The automated checks cover nine viewport widths, local assets, navigation, filters, keyboard dialogs, contact validation, mocked form-service success/errors, reduced motion, JavaScript-disabled content, and axe WCAG accessibility scans. These tests do not send real emails. Screenshots are saved to the ignored `test-results/` directory. Automated accessibility checks supplement, not replace, manual review.

Run `npm run format` to format the source. Test tools are development-only dependencies; the public site remains plain HTML/CSS/JavaScript.

### Placeholder photo sources

- [Profile portrait](https://images.unsplash.com/photo-1506794778202-cad84cf45f1d)
- [Study workspace](https://images.unsplash.com/photo-1499750310107-5fef28a66643)
- [Event audience](https://images.unsplash.com/photo-1515187029135-18ee286d815b)
- [Team workshop](https://images.unsplash.com/photo-1522071820081-009f0129c71c)
- [Community gathering](https://images.unsplash.com/photo-1511632765486-a01980e01a18)

## Files

```text
index.html        Semantic sections, form, navigation, icon sprite
styles.css        Responsive design, motion, and interactive states
content.js        Editable portfolio data
script.js         Cards, filtering, navigation, dialogs, form logic
assets/           Stock placeholder photos and illustrative SVGs
server.cjs        Optional dependency-free local preview server
tests/            Optional automated browser checks
```
