# Jonh Carlo Tapire — Developer Portfolio

A responsive dark portfolio using **HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript**. No framework, Node.js runtime, or build step is required by the website.

## Open the website

Open `index.html` in a browser for a visual preview, or serve this folder with any static web server. **Sending messages requires an HTTP/HTTPS URL, not a `file://` preview.** Bootstrap, Bootstrap Icons, and Google Fonts load from CDNs, so an internet connection is needed for their styles and components. The website can be deployed to GitHub Pages or another static host without a build command.

## Active website files

```text
index.html
css/style.css
js/script.js
images/profile/avatar.svg
images/projects/       Original illustrative project covers
images/events/         Original illustrative event gallery covers
assets/jct-favicon.svg
```

The older root-level `styles.css`, `script.js`, `content.js`, and existing stock assets are retained for reference but are **not loaded by the redesigned website**. Existing development tooling is optional, not part of the site's runtime.

For an optional local preview with Python installed, run `python -m http.server 4173` in this folder and open `http://localhost:4173`.

## Customize before sharing

- **Profile:** replace the monogram placeholder with your own optimized photo in `images/profile/`, update both image paths and alt text in `index.html`, and remove the photo-placeholder captions.
- **Education:** replace the clearly marked education placeholder in `index.html`.
- **Projects:** edit the cards in `index.html` and matching `projects` records in `js/script.js`. Keep these synchronized so summaries are available without JavaScript. This portfolio is implemented; Taskboard, Campus Connect, and Weatherly are explicitly labeled illustrative concepts, not completed projects.
- **Events:** replace the sample cards and matching `events` records with events you actually attended. Each record supports multiple pictures for its Bootstrap Carousel. The included covers are illustrations, not attendance photographs.
- **Socials:** your supplied GitHub, LinkedIn, Facebook, and Instagram profiles are linked in the contact section and footer. To change them, edit `settings.socials` in `js/script.js` and the matching static links in `index.html` so they also work without JavaScript.
- **Journey:** edit the timeline directly in `index.html`. No dates or unverified institutions are invented.
- **Colors and spacing:** adjust the CSS variables at the top of `css/style.css`.
- **SEO:** after deployment, add the actual absolute public `og:url`, canonical URL, and an absolute raster `og:image` URL (for example a 1200×630 PNG). The current relative SVG is an illustrative placeholder; social platforms may not preview SVG images.

## Contact form

The form now sends submissions to **jonhcarlotapire@gmail.com** through [FormSubmit](https://formsubmit.co/), using Vanilla JavaScript `fetch`. No Gmail password, SMTP credentials, or backend code is exposed. Visitor names, email addresses, subjects, and messages pass through this third-party service; the form discloses this.

### Required one-time activation

1. Open the portfolio at `http://localhost:4173` or its published HTTPS URL. If needed, run `python -m http.server 4173` in this folder. Do not use a double-clicked `file://` page to send messages.
2. Fill in the form with a valid sender email and submit a test message.
3. Open **jonhcarlotapire@gmail.com**, check Inbox and Spam for the **FormSubmit activation email**, and click its confirmation link. Only the inbox owner can complete this step; the site cannot bypass it.
4. Submit another test and confirm it arrives in Gmail. FormSubmit says unverified submissions are retained for up to 30 days, but verify receipt rather than assuming delivery.
5. If a new deployment triggers another activation, confirm that email as well. Replies to received messages address the visitor's email.

The integration checks both HTTP status and FormSubmit's JSON `success` value. It preserves text on errors or activation notices, blocks duplicate submissions while sending, provides a 20-second timeout, and includes a honeypot. A success notice confirms service acceptance, **not verified Gmail inbox delivery**. Provider outages, filtering, or rate limits can still interrupt email. The Send Email link remains an alternative.

Without JavaScript, the form uses a standard POST to FormSubmit and may show its verification screen. FormSubmit's normal anti-spam protections are not disabled. Never put private keys or a Gmail password in `js/script.js`.

## AI portfolio chatbot

The floating **Ask about me** panel supports a real OpenAI chatbot through a secure plain-JavaScript Cloudflare Worker. It never exposes an API key in the browser. Answers are grounded in a curated profile, with missing personal facts and sample projects clearly identified.

**Deployment and keys are still required:** the widget displays a connection-pending message until a Worker endpoint and public Turnstile sitekey are configured. Follow **[`worker/README.md`](worker/README.md)**. Do not put private keys in this repository. The integration includes server-side anti-bot verification, rate limits, timeouts, bounded conversation history, safe text rendering, and a privacy notice.

## Accessibility and motion

- Semantic sections, skip link, visible keyboard focus, labeled forms, and field-level errors.
- Bootstrap modals with focus trapping, Escape dismissal, and return-to-trigger focus.
- Galleries are manually controlled, not autoplaying.
- `prefers-reduced-motion` disables animation; pointer effects are desktop-only.
- Native cursor stays visible alongside the decorative cursor.
- Static card summaries and page content remain readable without JavaScript.
- Lazy-loaded local SVG images have declared dimensions and meaningful alt text.

## Checks

`tests/redesign.spec.cjs` covers the website, `tests/chatbot.spec.cjs` covers social links and the AI interface, and `tests/worker.spec.cjs` covers the secure Worker. The pre-existing `tests/portfolio.spec.cjs` targets the original website and is retained as reference, not included in the current test run. The tests use the optional Playwright development installation; it is not needed to publish or run the website. Run `npx playwright test` with the existing development tools and Python installed. Checks cover nine viewport widths, local assets, navigation, filters, keyboard modals, galleries, contact validation, mocked provider responses, reduced motion, touch, JavaScript-disabled content, chat verification and errors, safe text rendering, Worker input limits and secret handling, and axe WCAG scans. No real email or paid AI request is sent by the tests.
