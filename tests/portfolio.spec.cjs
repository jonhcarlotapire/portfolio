const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("all sections and reusable cards render without JavaScript errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("JC Tapire — Personal Portfolio");
  await expect(page.locator("main > section")).toHaveCount(6);
  await expect(page.locator(".skill-category")).toHaveCount(3);
  await expect(page.locator(".skill-list li")).toHaveCount(12);
  await expect(page.locator(".event-card")).toHaveCount(3);
  await expect(page.locator(".project-card")).toHaveCount(4);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 680, 768, 900, 1024, 1440, 1920]) {
  test(`responsive layout has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(overflow.document).toBeLessThanOrEqual(overflow.viewport);
    for (const selector of [
      ".hero h1",
      ".hero-actions",
      ".skills-grid",
      ".events-grid",
      ".projects-grid",
      ".contact-form-wrap",
    ]) {
      const bounds = await page.locator(selector).boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
    }
    await page.locator(".footer-bottom").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test("all local photos, mockups, and icon references resolve", async ({
  page,
}) => {
  await page.goto("/");
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  const missingIcons = await page
    .locator("use")
    .evaluateAll((uses) =>
      uses
        .map((use) => use.getAttribute("href"))
        .filter((id) => !document.querySelector(id)),
    );
  expect(missingIcons).toEqual([]);
});

test("mobile menu opens, closes after navigation, and responds to Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.locator('#mobile-nav a[href="#skills"]').click();
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await expect(page).toHaveURL(/#skills$/);
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("navigation follows the section being viewed", async ({ page }) => {
  await page.goto("/");
  for (const id of ["about", "skills", "events", "projects", "contact"]) {
    await page
      .locator(`#${id}`)
      .evaluate((element) => element.scrollIntoView());
    await expect(page.locator(`.desktop-nav a[href="#${id}"]`)).toHaveAttribute(
      "aria-current",
      "location",
    );
  }
});

test("filters update project cards, pressed states, and counts", async ({
  page,
}) => {
  await page.goto("/");
  for (const [category, count] of [
    ["Development", 2],
    ["Design", 1],
    ["Business", 1],
    ["all", 4],
  ]) {
    const button = page.locator(`[data-filter="${category}"]`);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".project-card:visible")).toHaveCount(count);
    await expect(page.locator("#project-counter")).toHaveText(
      `${count} ${count === 1 ? "project" : "projects"}`,
    );
  }
});

test("event dialog contains details and returns focus after Escape", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.locator('.card-detail-button[data-event="leadership"]');
  await trigger.click();
  await expect(page.locator("#detail-dialog")).toBeVisible();
  await expect(page.locator("#dialog-title")).toHaveText(
    "Student Leadership Summit",
  );
  await expect(page.locator(".dialog-list li")).toHaveCount(3);
  await expect(page.locator(".dialog-close")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".dialog-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#detail-dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveClass(/dialog-open/);
});

test("project dialog hides missing external URLs and closes by button", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('.card-detail-button[data-project="budget"]').click();
  await expect(page.locator("#dialog-title")).toHaveText("Pennywise Dashboard");
  await expect(page.locator(".dialog-actions a")).toHaveCount(0);
  await expect(page.locator(".dialog-sample")).toContainText("Concept only");
  await page.locator(".dialog-close").click();
  await expect(page.locator("#detail-dialog")).toBeHidden();
});

test("project role appears on hover and keyboard focus", async ({ page }) => {
  await page.goto("/");
  const card = page
    .locator('.project-card[data-category="Development"]')
    .first();
  const info = card.locator(".project-hover-info");
  await card.hover();
  await expect(info).toHaveCSS("opacity", "1");
  await expect(info).toContainText("Design & front-end development");
  await page.locator("#hero-title").hover();
  await card.locator(".project-image-button").focus();
  await expect(info).toHaveCSS("opacity", "1");
});

test("touch-screen navigation and details are usable without hover", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await page.locator(".menu-toggle").tap();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.locator('#mobile-nav a[href="#projects"]').tap();
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await expect(page.locator(".project-hover-info").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.locator('.card-detail-button[data-project="folio"]').tap();
  await expect(page.locator("#detail-dialog")).toBeVisible();
  const bounds = await page.locator("#detail-dialog").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  await page.locator(".dialog-close").tap();
  await expect(page.locator("#detail-dialog")).toBeHidden();
  await context.close();
});

test("email copy button copies the address and announces feedback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator(".copy-email").click();
  await expect(page.locator("#toast")).toHaveText("Email address copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "hello@example.com",
  );
});

test("dialog also closes on a backdrop click", async ({ page }) => {
  await page.goto("/");
  await page.locator('.card-detail-button[data-event="innovation"]').click();
  await expect(page.locator("#detail-dialog")).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.locator("#detail-dialog")).toBeHidden();
});

test("contact form reports errors without claiming demo delivery", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".send-button").click();
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#message")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("invalid@email");
  await page.locator("#message").fill("short");
  await page.locator(".send-button").click();
  await expect(page.locator("#email-error")).toHaveText(
    "Please enter a valid email address.",
  );
  await expect(page.locator("#message-error")).toContainText("10 characters");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#message").fill("Hello, this is a test message.");
  await page.locator(".send-button").click();
  await expect(page.locator("#form-status")).toContainText(
    "This is a demo form",
  );
  await expect(page.locator("#message")).toHaveValue(
    "Hello, this is a test message.",
  );
});

async function configureForm(
  page,
  endpoint = "https://formspree.io/f/test-endpoint",
) {
  await page.route("**/content.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    await route.fulfill({
      response,
      body: body.replace(/formEndpoint:\s*""/, `formEndpoint: "${endpoint}"`),
    });
  });
  await page.goto("/");
  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#message").fill("Hello, this is an automated test.");
}

test("configured form submits a real request and handles success", async ({
  page,
}) => {
  let payload;
  await page.route("https://formspree.io/f/test-endpoint", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  await configureForm(page);
  await page.locator(".send-button").click();
  await expect(page.locator("#form-status")).toContainText("sent successfully");
  expect(payload).toEqual({
    name: "Test Person",
    email: "test@example.com",
    message: "Hello, this is an automated test.",
  });
  await expect(page.locator("#message")).toHaveValue("");
  await expect(page.locator(".send-button")).toBeEnabled();
});

test("configured form preserves messages after a server error", async ({
  page,
}) => {
  await page.route("https://formspree.io/f/test-endpoint", (route) =>
    route.fulfill({ status: 500, body: "{}" }),
  );
  await configureForm(page);
  await page.locator(".send-button").click();
  await expect(page.locator("#form-status")).toContainText("could not be sent");
  await expect(page.locator("#message")).toHaveValue(
    "Hello, this is an automated test.",
  );
  await expect(page.locator(".send-button")).toBeEnabled();
});

test("reduced motion removes animation and keeps reveal content visible", async ({
  page,
}) => {
  await page.goto("/");
  const motion = await page
    .locator(".floating-note")
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(motion).toBe("none");
  expect(
    await page
      .locator(".skill-category")
      .first()
      .evaluate((element) => getComputedStyle(element).opacity),
  ).toBe("1");
});

test("scroll reveals become visible with standard motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const category = page.locator(".skill-category").first();
  await category.scrollIntoViewIfNeeded();
  await expect(category).toHaveClass(/visible/);
});

test("essential content remains available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator(".no-script")).toBeVisible();
  await expect(page.locator(".no-script")).toContainText("Enable JavaScript");
  await expect(page.locator(".send-button")).toBeDisabled();
  await expect(page.locator("[data-email-link]")).toHaveAttribute(
    "href",
    "mailto:hello@example.com",
  );
  await context.close();
});

test("WCAG accessibility scan for desktop and mobile", async ({ page }) => {
  await page.goto("/");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
});

test("detail dialog passes accessibility checks", async ({ page }) => {
  await page.goto("/");
  await page.locator('.card-detail-button[data-project="folio"]').click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});

test("capture desktop and mobile preview screenshots", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  // Full-page capture doesn't trigger offscreen lazy images by itself.
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/desktop-preview.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/mobile-preview.png",
    fullPage: true,
  });
});
