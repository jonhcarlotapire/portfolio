const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const endpoint = "https://assistant.example.test/chat";

async function connectedChat(page, handler) {
  await page.addInitScript(() => {
    // Simulated Turnstile: no real provider tokens or paid requests in tests.
    let callback;
    window.turnstile = {
      render: (_, options) => {
        callback = options.callback;
        callback("mock-token");
        return "mock-widget";
      },
      reset: () => callback("fresh-mock-token"),
    };
  });
  await page.route("**/js/chatbot.js", (route) => {
    const source = readFileSync(join(__dirname, "../js/chatbot.js"), "utf8")
      .replace(/endpoint:\s*""/, `endpoint: "${endpoint}"`)
      .replace(/turnstileSiteKey:\s*""/, 'turnstileSiteKey: "mock-public-key"');
    return route.fulfill({
      contentType: "application/javascript",
      body: source,
    });
  });
  await page.route(
    endpoint,
    handler ||
      ((route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            reply:
              "Jonh uses HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript.",
          }),
        })),
  );
  await page.goto("/");
  await page.locator("#chat-launcher").click();
  await expect(page.locator("#chat-send")).toBeEnabled();
}

test("all supplied social profiles appear twice with safe new-tab links", async ({
  page,
}) => {
  await page.goto("/");
  for (const url of [
    "https://github.com/jonhcarlotapire",
    "https://www.facebook.com/jc.tapire71",
    "https://www.instagram.com/jctapiree/?__d=1",
    "https://www.linkedin.com/in/jonh-carlo-tapire-53351a435/",
  ]) {
    const links = page.locator(`[data-socials] a[href="${url}"]`);
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAttribute("target", "_blank");
    }
  }
});

test("unconfigured real AI is honestly labeled and keyboard closing returns focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#portfolio-chat")).toBeHidden();
  await page.locator("#chat-launcher").click();
  await expect(page.locator("#portfolio-chat")).toBeVisible();
  await expect(page.locator("#chat-connection")).toHaveText(
    "AI CONNECTION PENDING",
  );
  await expect(page.locator("#chat-status")).toContainText(
    "isn't connected yet",
  );
  await expect(page.locator("#chat-send")).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.locator("#portfolio-chat")).toBeHidden();
  await expect(page.locator("#chat-launcher")).toBeFocused();
});

test("AI request uses verification and bounded history, with suggestions and clearing", async ({
  page,
}) => {
  const payloads = [];
  await connectedChat(page, (route) => {
    payloads.push(route.request().postDataJSON());
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ reply: "Jonh uses HTML5 and JavaScript." }),
    });
  });
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await expect(page.locator("#chat-log")).toContainText(
    "Jonh uses HTML5 and JavaScript.",
  );
  expect(payloads[0]).toMatchObject({
    message: "What technologies does Jonh use?",
    history: [],
    turnstileToken: "mock-token",
  });
  await page.locator("#chat-input").fill("And how can I contact him?");
  await page.locator("#chat-send").click();
  await expect.poll(() => payloads.length).toBe(2);
  expect(payloads[1].history).toHaveLength(2);
  expect(payloads[1].history.map((item) => item.role)).toEqual([
    "user",
    "assistant",
  ]);
  await expect(page.locator("#chat-send")).toBeEnabled();
  await page.screenshot({ path: "test-results/chatbot-desktop.png" });
  await page.locator("#chat-clear").click();
  await expect(page.locator("#chat-log .chat-message")).toHaveCount(1);
  await expect(page.locator("#chat-input")).toHaveValue("");
});

test("model HTML is plain text and cannot execute", async ({ page }) => {
  const text = '<img src=x onerror="window.injected=true">';
  await connectedChat(page, (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ reply: text }),
    }),
  );
  await page.locator("#chat-input").fill("What is his name?");
  await page.locator("#chat-send").click();
  await expect(page.locator("#chat-log")).toContainText(text);
  await expect(page.locator("#chat-log img")).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

for (const status of [403, 429, 502]) {
  test(`AI error ${status} preserves the question and reenables controls`, async ({
    page,
  }) => {
    await connectedChat(page, (route) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal details must not be echoed." }),
      }),
    );
    await page.locator("#chat-input").fill("Tell me about Jonh.");
    await page.locator("#chat-send").click();
    await expect(page.locator(".chat-error")).toBeVisible();
    await expect(page.locator("#chat-input")).toHaveValue(
      "Tell me about Jonh.",
    );
    await expect(page.locator("#chat-send")).toBeEnabled();
    await expect(page.locator("#chat-log")).not.toContainText(
      "Internal details",
    );
  });
}

test("clear aborts pending requests without resurrecting old answers", async ({
  page,
}) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await connectedChat(page, async (route) => {
    await gate;
    await route
      .fulfill({
        contentType: "application/json",
        body: JSON.stringify({ reply: "Stale answer" }),
      })
      .catch(() => {});
  });
  await page.locator("#chat-input").fill("Ask a slow question.");
  await page.locator("#chat-send").click();
  await expect(page.locator(".chat-thinking")).toBeVisible();
  await page.locator("#chat-clear").click();
  release();
  await expect(page.locator("#chat-log .chat-message")).toHaveCount(1);
  await expect(page.locator("#chat-log")).not.toContainText("Stale answer");
  await expect(page.locator("#chat-send")).toBeEnabled();
});

test("chat fits narrow phones and passes keyboard/accessibility scans", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await connectedChat(page);
  const box = await page.locator("#portfolio-chat").boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page.screenshot({ path: "test-results/chatbot-mobile.png" });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("static social links remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await expect(
    page.locator('[data-socials] a[href="https://github.com/jonhcarlotapire"]'),
  ).toHaveCount(2);
  await expect(page.locator("#chat-launcher")).toBeHidden();
  await context.close();
});
