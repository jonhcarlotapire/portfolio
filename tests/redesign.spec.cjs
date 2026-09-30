// Optional development checks; none of these tools is shipped with the website.
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const contactEndpoint = "https://formsubmit.co/ajax/jonhcarlotapire@gmail.com";

// Never send real messages during automated checks. Specific tests override this.
test.beforeEach(async ({ page }) => {
  await page.route("https://formsubmit.co/**", (route) => route.abort());
});

test("identity, seven sections, Bootstrap, and local assets load without errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/^Jonh Carlo Tapire/);
  await expect(page.locator("main > section")).toHaveCount(7);
  await expect(page.locator(".skill-card")).toHaveCount(4);
  await expect(page.locator(".event-card")).toHaveCount(2);
  await expect(page.locator(".project-card")).toHaveCount(4);
  expect(await page.evaluate(() => Boolean(window.bootstrap?.Modal))).toBe(
    true,
  );
  expect(
    await page
      .locator(".row")
      .first()
      .evaluate((el) => getComputedStyle(el).display),
  ).toBe("flex");
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 390, 680, 768, 900, 1024, 1440, 1920]) {
  test(`responsive layout stays within ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Fail clearly if a CDN stylesheet was blocked, instead of blaming the grid.
    expect(
      await page
        .locator(".row")
        .first()
        .evaluate((el) => getComputedStyle(el).display),
    ).toBe("flex");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    for (const selector of [
      ".hero h1",
      ".hero-actions",
      "#skills-grid",
      "#projects-grid",
      ".contact-form",
      ".footer-top",
    ]) {
      const box = await page.locator(selector).boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
    if (width === 1440) {
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate((el) => el.complete && el.naturalWidth > 0),
          )
          .toBe(true);
      }
      await page.evaluate(() => scrollTo(0, 0));
    }
    await page.screenshot({
      path: `test-results/redesign-${width}.png`,
      fullPage: width === 1440,
    });
  });
}

test("mobile menu closes after navigation and restores focus with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".navbar-toggler");
  await expect(page.locator("#navbar-menu")).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.locator('.navbar a[href="#skills"]').click();
  await expect(page.locator("#navbar-menu")).toBeHidden();
  await expect(page).toHaveURL(/#skills$/);
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("navigation, scroll progress, and back-to-top follow scrolling", async ({
  page,
}) => {
  await page.goto("/");
  // Anchor positions must be checked after web fonts have settled.
  await page.evaluate(() => document.fonts.ready);
  for (const id of ["about", "skills", "events", "projects", "contact"]) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView());
    await expect(
      page.locator(`.navbar .nav-link[href="#${id}"]`),
    ).toHaveAttribute("aria-current", "location");
  }
  await expect(page.locator("#back-to-top")).toBeVisible();
  expect(
    await page.locator("#scroll-progress").evaluate((el) => el.style.transform),
  ).not.toBe("scaleX(0)");
  await page.locator("#back-to-top").click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".navbar-brand")).toBeFocused();
});

test("filters match technology and project categories", async ({ page }) => {
  await page.goto("/");
  for (const [filter, count] of [
    ["html-css", 4],
    ["bootstrap", 3],
    ["javascript", 3],
    ["school", 1],
    ["personal", 3],
    ["all", 4],
  ]) {
    const button = page.locator(`[data-filter="${filter}"]`);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".project-item:visible")).toHaveCount(count);
    await expect(page.locator("#project-count")).toHaveText(
      `${count} project${count === 1 ? "" : "s"}`,
    );
  }
});

test("project modal supports keyboard closing and restores trigger focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page
    .locator('.project-card button[data-project="portfolio"]')
    .last();
  await trigger.click();
  await expect(page.locator("#detail-modal")).toBeVisible();
  await expect(page.locator("#modal-title")).toHaveText("Personal Portfolio");
  await expect(page.locator("#modal-body")).toContainText("Challenges");
  await expect(page.locator("#modal-body")).toContainText("What I learned");
  await page.keyboard.press("Escape");
  await expect(page.locator("#detail-modal")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("event modal galleries advance and reset between events", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator('.event-card button[data-event="workshop"]')
    .last()
    .click();
  await expect(page.locator("#event-gallery .carousel-item")).toHaveCount(2);
  await page.locator(".carousel-control-next").click();
  await expect(
    page.locator("#event-gallery .carousel-item").nth(1),
  ).toHaveClass(/active/);
  await page.keyboard.press("Escape");
  await page
    .locator('.event-card button[data-event="collaboration"]')
    .last()
    .click();
  await expect(page.locator("#event-gallery .carousel-item")).toHaveCount(2);
  await expect(
    page.locator("#event-gallery .carousel-item").first(),
  ).toHaveClass(/active/);
  await expect(page.locator("#modal-body")).toContainText("Sample event");
});

test("form validates fields and submits the correct Gmail payload", async ({
  page,
}) => {
  let payload;
  await page.route(contactEndpoint, async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: "true",
        message: "Success! Form submitted successfully.",
      }),
    });
  });
  await page.goto("/");
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator("#full-name")).toBeFocused();
  await expect(page.locator(".is-invalid")).toHaveCount(4);
  await page.locator("#full-name").fill("Test Visitor");
  await page.locator("#email").fill("invalid-email");
  await page.locator("#subject").fill("Test subject");
  await page.locator("#message").fill("This is a test; no real email is sent.");
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#form-feedback")).toContainText("valid email");
  await page.locator("#email").fill("visitor@example.com");
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator("#form-feedback")).toContainText(
    "accepted your message",
  );
  expect(payload).toMatchObject({
    name: "Test Visitor",
    email: "visitor@example.com",
    subject: "Test subject",
    message: "This is a test; no real email is sent.",
    _subject: "Portfolio contact: Test subject",
    _replyto: "visitor@example.com",
    _template: "table",
    _url: "http://127.0.0.1:4180/",
    _honey: "",
  });
  expect(payload).not.toHaveProperty("_captcha");
  await expect(page.locator("#message")).toBeEmpty();
});

for (const scenario of [
  {
    name: "acceptance",
    status: 200,
    body: { success: true, message: "Form submitted successfully." },
    expected: "accepted your message",
    accepted: true,
  },
  {
    name: "HTTP failure",
    status: 500,
    body: { success: false },
    expected: "could not be confirmed",
  },
  {
    name: "rejection despite HTTP 200",
    status: 200,
    body: { success: "false", message: "Unable to submit form." },
    expected: "could not be confirmed",
  },
  {
    name: "unconfirmed JSON response",
    status: 200,
    body: {},
    expected: "could not be confirmed",
  },
  {
    name: "malformed server response",
    status: 200,
    body: "<html>Service error</html>",
    expected: "could not be confirmed",
  },
  {
    name: "activation required",
    status: 200,
    body: { success: false, message: "Please activate your form." },
    expected: "one-time activation",
  },
]) {
  test(`email service handles ${scenario.name} without sending real mail`, async ({
    page,
  }) => {
    await page.route(contactEndpoint, (route) =>
      route.fulfill({
        status: scenario.status,
        contentType: "application/json",
        body:
          typeof scenario.body === "string"
            ? scenario.body
            : JSON.stringify(scenario.body),
      }),
    );
    await page.goto("/");
    await page.locator("#full-name").fill("Test Visitor");
    await page.locator("#email").fill("visitor@example.com");
    await page.locator("#subject").fill("Mocked service test");
    await page.locator("#message").fill("No real submission occurs.");
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator("#form-feedback")).toContainText(
      scenario.expected,
    );
    await expect(
      page.locator('#contact-form button[type="submit"]'),
    ).toBeEnabled();
    if (scenario.accepted) await expect(page.locator("#message")).toBeEmpty();
    else
      await expect(page.locator("#message")).toHaveValue(
        "No real submission occurs.",
      );
  });
}

test("sending state prevents duplicate submissions and protects the message", async ({
  page,
}) => {
  let count = 0,
    release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route(contactEndpoint, async (route) => {
    count++;
    await gate;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
  await page.goto("/");
  await page.locator("#full-name").fill("Test Visitor");
  await page.locator("#email").fill("visitor@example.com");
  await page.locator("#subject").fill("Duplicate test");
  await page.locator("#message").fill("Only one mocked submission.");
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator("#contact-form")).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await expect(page.locator("#message")).toBeDisabled();
  await page.evaluate(() =>
    document.querySelector("#contact-form").requestSubmit(),
  );
  await expect.poll(() => count).toBe(1);
  release();
  await expect(page.locator("#form-feedback")).toContainText(
    "accepted your message",
  );
  await expect(page.locator("#message")).toBeEnabled();
  expect(count).toBe(1);
});

test("honeypot submissions are blocked without contacting the email provider", async ({
  page,
}) => {
  let requests = 0;
  await page.route(contactEndpoint, (route) => {
    requests++;
    return route.abort();
  });
  await page.goto("/");
  await page.locator("#full-name").fill("Test Visitor");
  await page.locator("#email").fill("visitor@example.com");
  await page.locator("#subject").fill("Bot test");
  await page.locator("#message").fill("This must not be submitted.");
  await page.locator("#contact-website").evaluate((input) => {
    input.value = "spam";
  });
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator("#form-feedback")).toContainText(
    "could not be processed",
  );
  expect(requests).toBe(0);
});

test("reduced motion disables loader and decorative pointer animation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#loader")).toBeHidden();
  await page.mouse.move(100, 100);
  await expect(page.locator("#cursor-ring")).toBeHidden();
  await expect(page.locator("#typed-role")).toHaveText("Web Developer");
  expect(
    await page
      .locator(".profile-frame")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("normal motion loads quickly, types, reveals, and handles fast filter changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#loader")).toBeHidden({ timeout: 3000 });
  await expect(page.locator("#hero-title")).toHaveClass(/is-visible/);
  await expect
    .poll(() => page.locator("#typed-role").textContent(), { timeout: 6000 })
    .not.toBe("Web Developer");
  await page.evaluate(() => {
    for (const filter of ["school", "personal", "bootstrap", "all"])
      document.querySelector(`[data-filter="${filter}"]`).click();
  });
  await expect(page.locator(".project-item:not([hidden])")).toHaveCount(4);
  await expect(page.locator("#project-count")).toHaveText("4 projects");
});

test("touch screens disable pointer effects and fit animated content", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await expect(page.locator("#loader")).toBeHidden();
  await page.mouse.move(100, 100);
  await expect(page.locator("#cursor-ring")).toBeHidden();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page
    .locator('.project-card button[data-project="portfolio"]')
    .last()
    .click();
  await expect(page.locator("#modal-title")).toHaveText("Personal Portfolio");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await context.close();
});

test("static content remains useful with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await expect(page.locator("#loader")).toBeHidden();
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await context.close();
});

test("WCAG accessibility checks for the page, project modal, and event gallery", async ({
  page,
}) => {
  await page.goto("/");
  const scan = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  };
  await scan();
  await page
    .locator('.project-card button[data-project="portfolio"]')
    .last()
    .click();
  await scan();
  await page.keyboard.press("Escape");
  await page
    .locator('.event-card button[data-event="workshop"]')
    .last()
    .click();
  await scan();
});
