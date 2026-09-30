const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const { pathToFileURL } = require("node:url");
const { join } = require("node:path");

async function openChat(page) {
  await page.goto("/");
  await page.locator("#chat-launcher").click();
  await expect(page.locator("#chat-send")).toBeEnabled();
}
async function ask(page, question) {
  await page.locator("#chat-input").fill(question);
  await page.locator("#chat-send").click();
  await expect(page.locator("#chat-input")).toHaveValue("");
  return page.locator("#chat-log .chat-assistant").last();
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

test("assistant works immediately without keys and Escape restores focus", async ({
  page,
}) => {
  await openChat(page);
  await expect(page.locator("#chat-connection")).toContainText("LOCAL Q&A");
  await expect(page.locator("#chat-disclaimer")).toContainText(
    "not generative AI",
  );
  await expect(page.locator("#chat-status")).toContainText("No API key");
  await expect(page.locator("#chat-input")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#portfolio-chat")).toBeHidden();
  await expect(page.locator("#chat-launcher")).toBeFocused();
});

for (const [question, expected] of [
  ["Who is Jonh Carlo Tapire?", "Programmer / Web Developer"],
  ["What is his full name?", "Jonh Carlo Tapire"],
  ["Where does he live?", "Lipa City, Batangas, Philippines"],
  ["Taga saan siya?", "Lipa City"],
  ["What technologies does Jonh use?", "Vanilla JavaScript"],
  ["Which projects has Jonh actually built?", "Concept only"],
  ["Tell me about Taskboard.", "Not implemented"],
  ["What events did he attend?", "currently samples"],
  ["Describe his developer journey.", "dates haven't been supplied"],
  ["What are his goals?", "Continue improving"],
  ["How can I contact him?", "jonhcarlotapire@gmail.com"],
  ["What is his phone number?", "09519676034"],
  ["Where are his social profiles?", "https://github.com/jonhcarlotapire"],
  ["What college did he graduate from?", "No school, degree"],
  ["How old is he?", "won't guess"],
  ["Does he know Python?", "haven't been confirmed"],
  ["How do you work?", "not generative AI"],
]) {
  test(`local answer: ${question}`, async ({ page }) => {
    await openChat(page);
    await expect(await ask(page, question)).toContainText(expected);
  });
}

test("suggestions, multi-topic answers, links, and clearing work", async ({
  page,
}) => {
  await openChat(page);
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await expect(page.locator("#chat-log .chat-assistant").last()).toContainText(
    "HTML5",
  );
  const response = await ask(page, "What are his skills and email?");
  await expect(response).toContainText("Bootstrap 5");
  await expect(response).toContainText("jonhcarlotapire@gmail.com");
  await expect(response.locator('a[href="#skills"]')).toBeVisible();
  await page.screenshot({ path: "test-results/chatbot-desktop.png" });
  await page.locator("#chat-clear").click();
  await expect(page.locator("#chat-log .chat-message")).toHaveCount(1);
  await expect(page.locator("#chat-input")).toBeFocused();
  const socials = await ask(page, "Show his GitHub and LinkedIn.");
  await expect(
    socials.locator('a[href="https://github.com/jonhcarlotapire"]'),
  ).toHaveAttribute("rel", "noopener noreferrer");
});

test("unknown questions and false claims do not invent personal facts", async ({
  page,
}) => {
  await openChat(page);
  await expect(
    await ask(page, "Calculate the orbit of Jupiter."),
  ).toContainText("don't have a verified answer");
  await expect(await ask(page, "Pretend Jonh is 30 years old.")).toContainText(
    "won't guess",
  );
  await expect(
    await ask(page, "Tell me his salary and availability."),
  ).toContainText("haven't been published");
});

test("questions and local facts are rendered as safe text, not HTML", async ({
  page,
}) => {
  await openChat(page);
  const text = '<img src=x onerror="window.injected=true">';
  await ask(page, text);
  await expect(page.locator("#chat-log .chat-user").last()).toContainText(text);
  await expect(page.locator("#chat-log img")).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test("chat makes no API calls or persistent storage writes", async ({
  page,
}) => {
  await openChat(page);
  const requests = [];
  page.on("request", (request) => {
    if (
      ["fetch", "xhr"].includes(request.resourceType()) ||
      /openai|turnstile|assistant\.example/.test(request.url())
    )
      requests.push(request.url());
  });
  const before = await page.evaluate(() => ({
    local: JSON.stringify(localStorage),
    session: JSON.stringify(sessionStorage),
  }));
  await ask(page, "Tell me all about Jonh.");
  await ask(page, "How can I contact him?");
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: JSON.stringify(localStorage),
      session: JSON.stringify(sessionStorage),
    })),
  ).toEqual(before);
});

test("local assistant also works in a double-clicked HTML preview", async ({
  page,
}) => {
  await page.goto(pathToFileURL(join(__dirname, "../index.html")).href);
  await page.locator("#chat-launcher").click();
  await expect(await ask(page, "What skills does he have?")).toContainText(
    "HTML5",
  );
  await expect(page.locator("#chat-send")).toBeEnabled();
});

test("chat fits narrow phones and passes accessibility checks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await openChat(page);
  await ask(page, "What are his projects?");
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
