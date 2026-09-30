# OpenAI portfolio assistant — setup required

This is a **real OpenAI integration**, not keyword matching. The public website stays HTML/CSS/Bootstrap/Vanilla JavaScript. `assistant.mjs` runs separately as a Cloudflare Worker using standard Web APIs, with no Node.js runtime or application framework.

**The widget is intentionally disconnected until you deploy this Worker and configure its public URL and Turnstile sitekey.** It does not pretend to generate AI answers without them. The repository does not contain private keys, and no paid AI requests have been made during development.

## 1. Accounts and billing

- Create or use your Cloudflare account and an OpenAI API account with billing enabled. A ChatGPT subscription alone does not supply API credits.
- Create a dedicated OpenAI project/key for this assistant. Restrict permissions to the required Responses API where your account supports that.
- Configure spend alerts and monitor usage. **Rate limits and dashboard budgets are not guaranteed hard spending caps.** Keep the service disabled if you cannot accept API charges.
- Never paste API keys into chat, `index.html`, `js/chatbot.js`, GitHub, or the Wrangler file.

## 2. Turnstile protection

In Cloudflare → **Turnstile**, add a Managed widget. Allow your actual website hostname, such as `jonhcarlotapire.github.io`. Add `localhost` and `127.0.0.1` only if needed for local testing. Save:

- **Sitekey:** public, used in the browser.
- **Secret key:** private, used only as a Worker secret.

The Worker validates every token, its `portfolio_chat` action, and its exact hostname. Tokens are single-use. Do not use Turnstile test keys in production.

## 3. Deploy the Worker

Deploy the `worker/` directory with `wrangler.toml`. For a no-local-tooling route, use Cloudflare **Workers & Pages → Create → Import repository** after this code has been pushed:

- Repository: your portfolio repository.
- Worker root directory: `worker`.
- Build command: leave empty; there is no frontend build.
- Deploy command: the platform's managed `npx wrangler deploy`.

Cloudflare's managed deployment uses Wrangler as deployment tooling; the deployed application itself does **not** run Node.js. Alternatively use Wrangler externally if you already have it. Configure the required rate-limit binding through the supplied Wrangler file, not just a bare editor upload: the Worker deliberately refuses AI calls without that binding.

In Worker **Settings → Variables and Secrets**, add these as **secrets**, not plain variables:

| Secret                 | Value                         |
| ---------------------- | ----------------------------- |
| `OPENAI_API_KEY`       | Your private OpenAI API key   |
| `TURNSTILE_SECRET_KEY` | Your private Turnstile secret |

Nonsecret variables:

- `ALLOWED_ORIGINS`: exact website origins separated by commas, without paths or trailing slashes. Default: `https://jonhcarlotapire.github.io`. For local testing, explicitly add the origin you use, such as `http://localhost:4173`. Do not use `*`.
- `OPENAI_MODEL`: default `gpt-4.1-mini`; change only to a model supported by the Responses API in your account.

The configured `CHAT_RATE_LIMITER` uses namespace `1001` and a limit of 8 calls per 60 seconds. Choose a different positive namespace ID if this one is already used in your account. Visitor quotas use a coarse IP key, and a second quota limits total traffic per Cloudflare location. Shared networks may share a quota. Cloudflare's counters are approximate, per-location limits—not a global financial cap.

## 4. Connect the website

Edit only these **public** values at the top of `js/chatbot.js`:

```javascript
const config = Object.freeze({
  endpoint: "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/chat",
  turnstileSiteKey: "YOUR_PUBLIC_TURNSTILE_SITEKEY",
});
```

Publish the updated website. Open it via HTTP/HTTPS, not `file://`. Open **Ask about me**, complete verification if prompted, and ask a question. Confirm both the Turnstile challenge and an actual OpenAI reply work before announcing the chatbot as live.

## 5. Keep the knowledge accurate

Edit `PROFILE` in `assistant.mjs`, then redeploy the Worker whenever verified facts change. The profile includes Jonh's supplied identity, contact details, main technologies, goals, and four social links. Education, work history, dates, and certifications remain unknown. Events remain sample entries until their details are supplied. Concept projects are explicitly distinguished from implemented work.

The AI is instructed not to invent missing facts, impersonate Jonh, or claim to send emails or book appointments. **An AI model can still make mistakes**; the widget tells visitors to confirm important details directly. Prompt instructions are grounding, not a formal correctness guarantee.

## Privacy and security

- Conversations remain in page memory only; clearing chat or reloading removes that local history. No localStorage or analytics capture is added by this integration.
- Questions and limited conversation context are sent to Cloudflare and OpenAI. Cloudflare also handles anti-bot checks and IP-based rate limits. Provider retention policies still apply; `store: false` is not a promise of zero provider retention.
- Request bodies, model output, and exception details are not logged by this code. Review platform logging settings separately.
- Model output is rendered with `textContent`, not injected HTML or executable Markdown.
- CORS restrictions, server-side Turnstile validation, input/body limits, output-token limits, timeouts, and rate limits protect the endpoint. CORS alone is **not** authentication.
- Failed verification or missing secrets/configuration fails closed and does not call OpenAI.
- No API key or secret is sent to the visitor or included in the knowledge prompt.

## Troubleshooting

| Result             | Check                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Connection pending | Set the public Worker `/chat` URL and Turnstile sitekey.                                 |
| 403                | Exact allowed origin; widget hostname; real Turnstile key/secret pair; challenge action. |
| 429                | Wait a minute; review anonymous/shared-IP and per-location quotas.                       |
| 503                | Worker secrets, rate-limit binding, and provider availability.                           |
| 502                | OpenAI billing, key permissions, model access, or incomplete model answer.               |
| 504                | Provider timeout; retry a shorter question.                                              |

Automated tests mock both providers. They do not prove that a deployed account has credits, working keys, or live AI availability.
