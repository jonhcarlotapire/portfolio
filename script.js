/* Vanilla JavaScript. Works from a static host or by opening index.html. */
(() => {
  "use strict";
  const content = window.PORTFOLIO;
  if (!content) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const icon = (name, className = "") =>
    `<svg class="icon ${className}" aria-hidden="true"><use href="#i-${escapeHTML(name)}"/></svg>`;
  const safeURL = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:"
        ? url.href
        : "";
    } catch {
      return "";
    }
  };
  const imageURL = (value) => {
    // Allow local assets and HTTPS images, but never executable URL schemes.
    if (typeof value !== "string") return "";
    return /^(?:\.\/)?assets\/[a-zA-Z0-9_./-]+$/.test(value)
      ? value
      : safeURL(value).startsWith("https:")
        ? safeURL(value)
        : "";
  };
  const tags = (items) =>
    `<div class="tag-list">${items.map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div>`;
  const externalLink = (
    url,
    label,
    iconName,
    className = "project-external",
  ) => {
    const href = safeURL(url);
    return href
      ? `<a class="${className}" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(label)} (opens in a new tab)">${icon(iconName)} ${escapeHTML(label)}</a>`
      : "";
  };

  // Identity and contact details are edited once in content.js.
  $$("[data-name]").forEach((element) => {
    element.textContent = content.name;
  });
  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  $("[data-education]").textContent = content.education;
  $("[data-school]").textContent = content.school;
  $("[data-location]").textContent = content.location;
  const profileImage = $("[data-profile-image]");
  profileImage.src = imageURL(content.profileImage);
  profileImage.alt = content.profileImageAlt;
  const emailLink = $("[data-email-link]");
  emailLink.textContent = content.email;
  emailLink.href = `mailto:${encodeURIComponent(content.email)}`;
  document.title = `${content.name} — Personal Portfolio`;
  $$("[data-socials]").forEach((container) => {
    container.innerHTML = content.socials
      .map((social) => {
        const href = safeURL(social.url);
        return href
          ? `<a class="social-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(social.label)} (opens in a new tab)" title="${escapeHTML(social.label)}">${icon(social.icon)}</a>`
          : "";
      })
      .join("");
  });

  const skillCard = (category, index) =>
    `<article class="skill-category reveal" style="--reveal-delay:${index * 70}ms"><div class="skill-category-top"><span class="category-icon">${icon(category.icon)}</span><span class="category-label">${escapeHTML(category.label)}</span></div><h3>${escapeHTML(category.title)}</h3><p class="category-description">${escapeHTML(category.description)}</p><ul class="skill-list">${category.items.map((skill) => `<li><span class="skill-mark" aria-hidden="true">${escapeHTML(skill.mark)}</span><div><strong>${escapeHTML(skill.name)}</strong><small>${escapeHTML(skill.note)}</small></div></li>`).join("")}</ul></article>`;
  const eventCard = (event, index) =>
    `<article class="event-card reveal" style="--reveal-delay:${index * 70}ms"><button class="event-image-button" data-event="${escapeHTML(event.id)}" aria-label="View ${escapeHTML(event.title)} details"><img src="${escapeHTML(imageURL(event.image))}" alt="${escapeHTML(event.imageAlt)}" width="640" height="420" loading="lazy"><span class="event-badge">${escapeHTML(event.category)}</span></button><div class="event-content"><span class="event-date">${icon("calendar")} Sample · ${escapeHTML(event.date)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description)}</p><span class="event-role">${icon("users")} ${escapeHTML(event.role)}</span><button class="card-detail-button" data-event="${escapeHTML(event.id)}" aria-label="Read about ${escapeHTML(event.title)}">Explore the experience ${icon("arrow-up-right")}</button></div></article>`;
  const projectCard = (project, index) =>
    `<article class="project-card reveal" data-category="${escapeHTML(project.category)}" style="--reveal-delay:${(index % 2) * 70}ms">
      <button class="project-image-button" data-project="${escapeHTML(project.id)}" aria-label="View ${escapeHTML(project.title)} details">
        <img src="${escapeHTML(imageURL(project.image))}" alt="${escapeHTML(project.imageAlt)}" width="1000" height="575" loading="lazy">
        <span class="project-image-arrow">${icon("arrow-up-right")}</span>
        <span class="project-hover-info"><span>MY ROLE</span><strong>${escapeHTML(project.role)}</strong></span>
      </button>
      <div class="project-content">
        <div class="project-meta"><span class="project-category">${escapeHTML(project.category)}</span><span class="sample-label">${project.id === "folio" ? "This portfolio" : "Concept project"}</span></div>
        <h3>${escapeHTML(project.title)}</h3><p class="project-subtitle">${escapeHTML(project.subtitle)}</p>
        <p class="project-description">${escapeHTML(project.description)}</p>
        <div class="project-tools">${tags(project.tools)}</div>
        <div class="project-footer"><button class="card-detail-button" data-project="${escapeHTML(project.id)}" aria-label="View ${escapeHTML(project.title)} details">View Project ${icon("arrow-up-right")}</button><div class="project-links">${externalLink(project.github, "GitHub", "github")}${externalLink(project.demo, "Live Demo", "globe")}</div></div>
      </div>
    </article>`;
  $("#skills-grid").innerHTML = content.skills.map(skillCard).join("");
  $("#events-grid").innerHTML = content.events.map(eventCard).join("");
  $("#projects-grid").innerHTML = content.projects.map(projectCard).join("");
  $('.filter-button[data-filter="all"] span').textContent = String(
    content.projects.length,
  ).padStart(2, "0");
  $("#project-counter").textContent = `${content.projects.length} projects`;

  // Mobile navigation; Escape closes it, and hidden links cannot receive focus.
  const menuToggle = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  const setMenu = (open, restoreFocus = false) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    // Preserve the clicked SVG node so the outside-click handler sees it.
    $("use", menuToggle).setAttribute("href", open ? "#i-close" : "#i-menu");
    mobileNav.hidden = !open;
    if (restoreFocus) menuToggle.focus();
  };
  menuToggle.addEventListener("click", () =>
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
  );
  $$("a", mobileNav).forEach((link) =>
    link.addEventListener("click", () => setMenu(false)),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!mobileNav.hidden && !$("#site-header").contains(event.target))
      setMenu(false);
  });
  const desktopMedia = window.matchMedia("(min-width: 901px)");
  desktopMedia.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  // Active section highlighting, including at the very bottom of the page.
  const sections = $$("main > section[id]");
  const navLinks = $$(".site-header .nav-link");
  let scrollScheduled = false;
  let activeSection = "";
  const updateNavigation = () => {
    $("#site-header").classList.toggle("scrolled", window.scrollY > 12);
    let current = sections[0].id;
    const offset = $("#site-header").offsetHeight + 100;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    }
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 3
    )
      current = sections.at(-1).id;
    if (current !== activeSection) {
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      activeSection = current;
    }
    scrollScheduled = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(updateNavigation);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateNavigation);
  updateNavigation();

  // Reveal once, rather than repeatedly animating while scrolling.
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
    );
    $$(".reveal").forEach((element) => revealObserver.observe(element));
    document.documentElement.classList.add("js");
  }

  // Project filters keep focus on the selected control and announce the count.
  $$(".filter-button").forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      $$(".filter-button").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let count = 0;
      $$(".project-card").forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.hidden = !visible;
        card.classList.remove("filter-enter");
        if (visible) {
          count++;
          card.classList.add("visible");
          requestAnimationFrame(() => card.classList.add("filter-enter"));
        }
      });
      $("#project-counter").textContent =
        `${count} ${count === 1 ? "project" : "projects"}`;
    }),
  );

  // Native dialog makes the background inert and supports Escape.
  const dialog = $("#detail-dialog");
  let dialogTrigger = null;
  const detailList = (items) =>
    `<ul class="dialog-list">${items.map((item) => `<li>${icon("check")}<span>${escapeHTML(item)}</span></li>`).join("")}</ul>`;
  const openDetails = (type, id, trigger) => {
    const item = (type === "project" ? content.projects : content.events).find(
      (entry) => entry.id === id,
    );
    if (!item) return;
    let body;
    if (type === "project") {
      body = `<span class="eyebrow">${escapeHTML(item.category)} / SELECTED WORK</span><h2 id="dialog-title">${escapeHTML(item.title)}</h2><p>${escapeHTML(item.description)}</p><div class="dialog-tools">${tags(item.tools)}</div><h3>My role</h3><p>${escapeHTML(item.role)}</p><h3>Project features</h3>${detailList(item.features)}<div class="dialog-actions">${externalLink(item.github, "View on GitHub", "github", "button button-primary")}${externalLink(item.demo, "Live Demo", "globe", "button button-secondary")}</div><p class="dialog-sample">${escapeHTML(item.note)}</p>`;
    } else {
      body = `<span class="eyebrow">${escapeHTML(item.category)} / SAMPLE ACTIVITY</span><h2 id="dialog-title">${escapeHTML(item.title)}</h2><div class="dialog-info"><span>${icon("calendar")}${escapeHTML(item.date)}</span><span>${icon("pin")}${escapeHTML(item.location)}</span></div><p>${escapeHTML(item.details)}</p><h3>My role</h3><p>${escapeHTML(item.role)}</p><h3>What I learned</h3>${detailList(item.takeaways)}<p class="dialog-sample">Example event and stock image. Replace all details with your real participation and achievements.</p>`;
    }
    $("#dialog-content").innerHTML =
      `<img class="dialog-cover" src="${escapeHTML(imageURL(item.image))}" alt="${escapeHTML(item.imageAlt)}" width="1000" height="575"><div class="dialog-body">${body}</div>`;
    dialogTrigger = trigger;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("dialog-open");
    $(".dialog-close").focus();
  };
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project], [data-event]");
    if (trigger)
      openDetails(
        trigger.dataset.project ? "project" : "event",
        trigger.dataset.project || trigger.dataset.event,
        trigger,
      );
  });
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = $$(
      "button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex='0']",
      dialog,
    ).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    dialogTrigger?.focus({ preventScroll: true });
  });

  let toastTimeout;
  const notify = (message) => {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3500);
  };
  $(".copy-email").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(content.email);
      notify("Email address copied.");
    } catch {
      notify("Copy is unavailable here. Select the email address to copy it.");
    }
  });

  // Honest form behavior: a real endpoint sends; no endpoint opens a mail draft.
  const form = $("#contact-form");
  const formStatus = $("#form-status");
  const configuredEndpoint = safeURL(content.formEndpoint);
  const endpoint = configuredEndpoint.startsWith("https://")
    ? configuredEndpoint
    : "";
  const sendButton = $(".send-button");
  sendButton.disabled = false;
  if (endpoint)
    $("#form-note").textContent =
      "Your message is sent securely. Your email is only used to reply.";
  if (content.email === "hello@example.com" && !endpoint)
    $("#form-note").textContent =
      "Demo form: add your email in content.js to enable email drafts, or connect a form service.";
  const validate = (field) => {
    let error = "";
    const value = field.value.trim();
    if (!value)
      error =
        field.id === "message"
          ? "Please write a message."
          : `Please enter your ${field.id === "email" ? "email address" : "name"}.`;
    else if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      error = "Please enter a valid email address.";
    else if (field.id === "message" && value.length < 10)
      error = "Please include at least 10 characters.";
    $(`#${field.id}-error`).textContent = error;
    if (error) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !error;
  };
  const fields = [$("#name"), $("#email"), $("#message")];
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value || field.hasAttribute("aria-invalid")) validate(field);
    });
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) validate(field);
      formStatus.textContent = "";
    });
  });
  const setStatus = (message, type = "error") => {
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sendButton.disabled) return;
    formStatus.textContent = "";
    const validFields = fields.map(validate);
    if (validFields.includes(false)) {
      setStatus("Please check the highlighted fields.");
      fields[validFields.indexOf(false)].focus();
      return;
    }
    if ($("#website").value) {
      setStatus(
        "Your message could not be submitted. Please contact me by email.",
      );
      return;
    }
    if (!endpoint) {
      if (content.email === "hello@example.com") {
        setStatus(
          "This is a demo form. The portfolio owner needs to add their email or connect a form service before messages can be sent.",
        );
        return;
      }
      const subject = encodeURIComponent(
        `Portfolio message from ${$("#name").value.trim()}`,
      );
      const body = encodeURIComponent(
        `Name: ${$("#name").value.trim()}\nEmail: ${$("#email").value.trim()}\n\n${$("#message").value.trim()}`,
      );
      window.location.href = `mailto:${encodeURIComponent(content.email)}?subject=${subject}&body=${body}`;
      setStatus(
        "An email draft was requested. Send it from your email app to finish. Nothing has been sent by this website.",
        "success",
      );
      return;
    }
    sendButton.disabled = true;
    sendButton.setAttribute("aria-busy", "true");
    fields.forEach((field) => {
      field.readOnly = true;
    });
    $("span", sendButton).textContent = "Sending…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: $("#name").value.trim(),
          email: $("#email").value.trim(),
          message: $("#message").value.trim(),
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("Thank you! Your message was sent successfully.", "success");
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
    } catch (error) {
      setStatus(
        error.name === "AbortError"
          ? "The request timed out. Your message is still here; please try again or use email."
          : "Your message could not be sent. Please try again or contact me by email.",
      );
    } finally {
      clearTimeout(timeout);
      sendButton.disabled = false;
      sendButton.removeAttribute("aria-busy");
      fields.forEach((field) => {
        field.readOnly = false;
      });
      $("span", sendButton).textContent = "Send Message";
    }
  });
})();
