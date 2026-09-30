/* HTML + Bootstrap + Vanilla JavaScript. No build step or runtime server. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  const safeURL = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, location.href);
      return ["https:", "http:"].includes(url.protocol) ||
        (location.protocol === "file:" && url.protocol === "file:")
        ? url.href
        : "";
    } catch {
      return "";
    }
  };

  // EDITABLE CONTENT: add your real URLs, photos, projects, and event history here.
  // Matching cards in index.html remain readable when JavaScript is disabled.
  const settings = {
    email: "jonhcarlotapire@gmail.com",
    // FormSubmit delivers to this inbox after its owner confirms the activation email.
    // No SMTP password or private API key belongs in client-side code.
    formEndpoint: "https://formsubmit.co/ajax/jonhcarlotapire@gmail.com",
    socials: [
      {
        label: "GitHub",
        icon: "github",
        url: "https://github.com/jonhcarlotapire",
      },
      {
        label: "LinkedIn",
        icon: "linkedin",
        url: "https://www.linkedin.com/in/jonh-carlo-tapire-53351a435/",
      },
      {
        label: "Facebook",
        icon: "facebook",
        url: "https://www.facebook.com/jc.tapire71",
      },
      {
        label: "Instagram",
        icon: "instagram",
        url: "https://www.instagram.com/jctapiree/?__d=1",
      },
    ],
  };
  const projects = {
    portfolio: {
      title: "Personal Portfolio",
      image: "images/projects/portfolio.svg",
      alt: "Illustrative preview of this portfolio",
      status: "Implemented · This website",
      description:
        "A modern and responsive programmer portfolio designed to showcase my skills, projects, experiences, and achievements. Built with semantic HTML, custom CSS, Bootstrap 5, and Vanilla JavaScript.",
      technologies: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
      features: [
        "Responsive layouts and mobile navigation",
        "Project filtering and detail modals",
        "Event image galleries using Bootstrap Carousel",
        "Keyboard-friendly forms and reduced-motion support",
        "Typing, scroll reveals, and subtle desktop pointer effects",
      ],
      problem:
        "Bring a developer profile, technical skills, learning journey, and work into one organized and accessible place.",
      challenges:
        "Balancing visual details with performance, keeping interactions accessible, and handling mobile screens without heavy libraries.",
      learned:
        "This project brings together Bootstrap components, IntersectionObserver, CSS custom properties, progressive enhancement, and client-side validation.",
      github: "",
      demo: "./index.html",
    },
    taskboard: {
      title: "Taskboard",
      image: "images/projects/taskboard.svg",
      alt: "Illustrative task manager concept",
      status: "Concept only · Not implemented",
      description:
        "A proposed task management interface for keeping daily work organized. The image is an original UI illustration. There is no completed application or repository attached to this entry.",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      features: [
        "Planned: create, edit, and complete tasks",
        "Planned: filter tasks by status",
        "Planned: save tasks in local storage",
      ],
      problem:
        "Proposed goal: make daily tasks easier to organize without an overwhelming interface.",
      challenges:
        "To explore: reliable local persistence, empty states, keyboard interactions, and consistent status updates.",
      learned:
        "Learning goals: DOM manipulation, event handling, local storage, and interface state. Outcomes will be added after implementation.",
      github: "",
      demo: "",
    },
    campus: {
      title: "Campus Connect",
      image: "images/projects/campus.svg",
      alt: "Illustrative school landing page concept",
      status: "School project sample · Not implemented",
      description:
        "A sample entry showing how a future school project could be presented. It is not a claim of completed school work. Replace this entry with your actual assignment, screenshots, and source links.",
      technologies: ["HTML5", "CSS3", "Bootstrap 5"],
      features: [
        "Planned: responsive information sections",
        "Planned: announcements and event cards",
        "Planned: accessible navigation",
      ],
      problem:
        "Proposed goal: organize campus information into a clear, mobile-friendly experience.",
      challenges:
        "To explore: content hierarchy, responsive card layouts, and readable navigation across devices.",
      learned:
        "Learning goals: Bootstrap grids, semantic page structure, and component customization. Actual lessons will be added with a real project.",
      github: "",
      demo: "",
    },
    weather: {
      title: "Weatherly",
      image: "images/projects/weather.svg",
      alt: "Illustrative weather dashboard concept",
      status: "Concept only · Not implemented",
      description:
        "A proposed weather dashboard focused on easy-to-read conditions. All values in the illustration are sample interface data, not live weather information. No API integration is implemented.",
      technologies: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript"],
      features: [
        "Planned: search for a city",
        "Planned: display weather summaries",
        "Planned: loading, empty, and error states",
      ],
      problem:
        "Proposed goal: present weather information in a concise and approachable interface.",
      challenges:
        "To explore: asynchronous requests, missing data, network failures, and secure API integration without exposing secrets.",
      learned:
        "Learning goals: fetch, asynchronous JavaScript, data formatting, and error handling. Actual outcomes will be documented after building.",
      github: "",
      demo: "",
    },
  };
  const events = {
    workshop: {
      title: "Programming Workshop",
      category: "Web Development · Workshop",
      date: "To be added",
      location: "To be added",
      role: "To be added",
      description:
        "This is a sample event entry, not a claim of attendance. Replace it with a programming workshop you actually joined, including the event date, venue, and a description of the sessions.",
      experience:
        "Add your actual role, practical activities, challenges, and personal experience here.",
      learned: [
        "Add the technologies you practiced.",
        "Describe a specific lesson or technique.",
        "Explain how you applied what you learned.",
      ],
      pictures: [
        {
          src: "images/events/bec1.jpg",
          alt: "Illustrative programming workshop cover",
        },
        {
          src: "images/events/bec2.jpg",
          alt: "Illustrative coding session gallery placeholder",
        },
      ],
    },
    collaboration: {
      title: "Collaborative Coding Activity",
      category: "Programming · Collaboration",
      date: "To be added",
      location: "To be added",
      role: "To be added",
      description:
        "This is a sample entry for a collaborative coding activity. Add the details of a real activity, hackathon, or team exercise you joined. These illustrations are placeholders, not event photographs.",
      experience:
        "Describe your contribution, how you worked with others, and the outcome of the activity.",
      learned: [
        "Add an actual teamwork takeaway.",
        "Explain a problem your group solved.",
        "Document programming skills you developed.",
      ],
      pictures: [
        {
          src: "images/events/mhack.jpg",
          alt: "Illustrative collaborative coding workspace",
        },
        {
          src: "images/events/mhack2.jpg",
          alt: "Illustrative coding session gallery placeholder",
        },
      ],
    },
  };
  const badges = (items) =>
    `<div class="technology-badges">${items.map((item) => `<span class="badge">${escapeHTML(item)}</span>`).join("")}</div>`;
  const list = (items) =>
    `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  const externalLink = (url, label) => {
    const href = safeURL(url);
    return href
      ? `<a class="btn btn-outline" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗<span class="visually-hidden"> (opens in a new tab)</span></a>`
      : `<span class="project-external unavailable">${escapeHTML(label)}: link not added</span>`;
  };

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  $$("[data-socials]").forEach((container) => {
    container.innerHTML = settings.socials
      .map((social) => {
        const href = safeURL(social.url);
        const contents = `<i class="bi bi-${escapeHTML(social.icon)}" aria-hidden="true"></i>`;
        return href
          ? `<a class="social-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(social.label)} (opens in a new tab)">${contents}</a>`
          : `<span class="social-placeholder" title="${escapeHTML(social.label)} URL to be added">${contents}<span class="visually-hidden">${escapeHTML(social.label)}: URL to be added</span></span>`;
      })
      .join("");
  });

  // Short, non-blocking loading screen. No artificial wait for remote assets.
  const loader = $("#loader");
  if (!reducedMotion.matches) {
    loader.hidden = false;
    setTimeout(() => {
      $("#loader-status").textContent = "Welcome.";
      loader.classList.add("leaving");
      setTimeout(() => {
        loader.hidden = true;
      }, 350);
    }, 450);
  }

  // Bootstrap mobile navigation, with a small fallback if the CDN is unavailable.
  const menu = $("#navbar-menu");
  const toggle = $(".navbar-toggler");
  const closeMenu = (restoreFocus = false) => {
    if (window.bootstrap) {
      // Bootstrap ignores hide() mid-expansion. Queue it until expansion ends.
      if (
        menu.classList.contains("collapsing") &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        menu.addEventListener(
          "shown.bs.collapse",
          () => closeMenu(restoreFocus),
          { once: true },
        );
        return;
      }
      bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    } else {
      menu.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
    }
    if (restoreFocus) toggle.focus();
  };
  if (!window.bootstrap)
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", String(open));
    });
  $$(".navbar a").forEach((link) =>
    link.addEventListener("click", () => closeMenu()),
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    )
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("show") &&
      !$("#site-header").contains(event.target)
    )
      closeMenu();
  });

  // Share a single animation frame for scroll progress, navigation, and back-to-top.
  const sections = $$("main > section[id]");
  const navLinks = $$(".navbar .nav-link");
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const progress =
      maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    $("#scroll-progress").style.transform = `scaleX(${progress})`;
    $("#site-header").classList.toggle("scrolled", scrollY > 20);
    $("#back-to-top").hidden = scrollY < 550;
    let current = "home";
    for (const section of sections)
      if (section.getBoundingClientRect().top <= 150) current = section.id;
    if (progress > 0.99) current = "contact";
    // Journey intentionally shares the Projects navigation entry.
    if (current === "journey") current = "projects";
    navLinks.forEach((link) => {
      const active = link.hash === `#${current}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const scheduleScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  };
  addEventListener("scroll", scheduleScroll, { passive: true });
  addEventListener("resize", scheduleScroll, { passive: true });
  updateScroll();
  // Font swaps can shift section positions even when the visitor isn't scrolling.
  if (document.fonts) document.fonts.ready.then(scheduleScroll);
  $("#back-to-top").addEventListener("click", () => {
    scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
    $(".navbar-brand").focus({ preventScroll: true });
  });

  // IntersectionObserver: reveal once and stop observing to minimize work.
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    document.documentElement.classList.add("motion-enabled");
    $$(".reveal").forEach((element) => observer.observe(element));
  }

  // Typing animation pauses in background tabs; assistive text is static in HTML.
  const roles = [
    "Programmer",
    "Web Developer",
    "Front-End Developer",
    "JavaScript Developer",
  ];
  const roleElement = $("#typed-role");
  roleElement.setAttribute("aria-hidden", "true");
  let roleIndex = 1,
    letterIndex = roles[1].length,
    deleting = true,
    typingTimer;
  const typeRole = () => {
    if (reducedMotion.matches || document.hidden) return;
    const word = roles[roleIndex];
    letterIndex += deleting ? -1 : 1;
    roleElement.textContent = word.slice(0, Math.max(0, letterIndex));
    let delay = deleting ? 38 : 85;
    if (!deleting && letterIndex === word.length) {
      deleting = true;
      delay = 1900;
    } else if (deleting && letterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }
    typingTimer = setTimeout(typeRole, delay);
  };
  if (!reducedMotion.matches) typingTimer = setTimeout(typeRole, 2200);
  document.addEventListener("visibilitychange", () => {
    clearTimeout(typingTimer);
    if (!document.hidden && !reducedMotion.matches)
      typingTimer = setTimeout(typeRole, 500);
  });

  // Terminal starts only when visible. Keep the completed output for no-JS visits.
  const terminal = $("#terminal-output");
  const animateTerminal = () => {
    const lines = [
      ["jonh@portfolio:~$ whoami", true],
      ["Jonh Carlo Tapire", false],
      ["Programmer & Web Developer", false],
      ["", false],
      ["jonh@portfolio:~$ skills", true],
      ["HTML CSS Bootstrap JavaScript", false],
      ["", false],
      ["jonh@portfolio:~$ status", true],
      ["Building something awesome...", false],
    ];
    terminal.replaceChildren();
    const cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    cursor.textContent = "▌";
    cursor.setAttribute("aria-hidden", "true");
    terminal.append(cursor);
    let lineIndex = 0,
      characterIndex = 0,
      lineNode;
    const next = () => {
      if (reducedMotion.matches) {
        terminal.innerHTML = lines
          .map(([text, command]) =>
            command
              ? `<span class="terminal-command">${escapeHTML(text)}</span>`
              : escapeHTML(text),
          )
          .join("\n");
        return;
      }
      if (lineIndex >= lines.length) return;
      if (characterIndex === 0) {
        lineNode = document.createElement("span");
        if (lines[lineIndex][1]) lineNode.className = "terminal-command";
        terminal.insertBefore(lineNode, cursor);
      }
      lineNode.textContent = lines[lineIndex][0].slice(0, ++characterIndex);
      let delay = 17;
      if (characterIndex >= lines[lineIndex][0].length) {
        lineIndex++;
        characterIndex = 0;
        if (lineIndex < lines.length)
          terminal.insertBefore(document.createTextNode("\n"), cursor);
        delay = 160;
      }
      setTimeout(next, delay);
    };
    next();
  };
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateTerminal();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(terminal);
  }

  const marqueeButton = $(".marquee-toggle");
  marqueeButton.addEventListener("click", () => {
    const paused = $(".stack-marquee").classList.toggle("paused");
    marqueeButton.setAttribute("aria-pressed", String(paused));
    marqueeButton.setAttribute(
      "aria-label",
      `${paused ? "Resume" : "Pause"} technology animation`,
    );
    $("i", marqueeButton).className = `bi bi-${paused ? "play" : "pause"}-fill`;
  });

  // Cancel the previous filter transition so rapid clicks cannot leave stale cards.
  let filterTimer;
  $$(".filter-btn").forEach((button) =>
    button.addEventListener("click", () => {
      clearTimeout(filterTimer);
      const filter = button.dataset.filter;
      $$(".filter-btn").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      const items = $$(".project-item");
      const visible = items.filter(
        (item) =>
          filter === "all" ||
          item.dataset.categories.split(" ").includes(filter),
      );
      items.forEach((item) => {
        item.classList.toggle("filter-out", !visible.includes(item));
      });
      const apply = () => {
        items.forEach((item) => {
          item.hidden = !visible.includes(item);
          if (!item.hidden) {
            $(".reveal", item).classList.add("is-visible");
            item.classList.remove("filter-out");
          }
        });
        $("#project-count").textContent =
          `${visible.length} project${visible.length === 1 ? "" : "s"}`;
        scheduleScroll();
      };
      if (reducedMotion.matches) apply();
      else filterTimer = setTimeout(apply, 180);
    }),
  );

  // Reusable Bootstrap modal; carousel never auto-advances.
  const modalElement = $("#detail-modal");
  let modalTrigger,
    fallbackModal = false,
    carousel;
  const notify = (message) => {
    $("#toast-message").textContent = message;
    if (window.bootstrap)
      bootstrap.Toast.getOrCreateInstance($("#site-toast"), {
        delay: 5000,
      }).show();
    else {
      $("#site-toast").classList.add("show");
      setTimeout(() => $("#site-toast").classList.remove("show"), 5000);
    }
  };
  const openModal = (trigger, html, kind) => {
    modalTrigger = trigger;
    if (carousel) {
      carousel.dispose();
      carousel = null;
    }
    $("#modal-kind").textContent = kind;
    $("#modal-body").innerHTML = html;
    if (window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
      const gallery = $("#event-gallery");
      if (gallery)
        carousel = new bootstrap.Carousel(gallery, {
          interval: false,
          ride: false,
          touch: true,
        });
    } else {
      // Focus trap and close support remain functional if Bootstrap JS fails to load.
      fallbackModal = true;
      modalElement.classList.add("show");
      modalElement.style.display = "block";
      modalElement.removeAttribute("aria-hidden");
      modalElement.setAttribute("aria-modal", "true");
      modalElement.setAttribute("role", "dialog");
      document.body.classList.add("modal-open");
      $(".btn-close", modalElement).focus();
      notify(
        "Some components could not load. Gallery previews are still available.",
      );
    }
  };
  const restoreModalFocus = () => {
    if (carousel) {
      carousel.dispose();
      carousel = null;
    }
    if (modalTrigger?.isConnected) modalTrigger.focus({ preventScroll: true });
  };
  modalElement.addEventListener("hidden.bs.modal", restoreModalFocus);
  const closeFallback = () => {
    if (!fallbackModal) return;
    fallbackModal = false;
    modalElement.classList.remove("show");
    modalElement.style.display = "";
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");
    modalElement.removeAttribute("role");
    document.body.classList.remove("modal-open");
    restoreModalFocus();
  };
  $(".btn-close", modalElement).addEventListener("click", closeFallback);
  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) closeFallback();
  });
  document.addEventListener("keydown", (event) => {
    if (!fallbackModal) return;
    if (event.key === "Escape") closeFallback();
    if (event.key === "Tab") {
      const focusable = $$(
        'button:not([disabled]), a[href], [tabindex="0"]',
        modalElement,
      ).filter((element) => element.getClientRects().length);
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  $$("[data-project]").forEach((button) =>
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      if (!project) return;
      openModal(
        button,
        `<img class="modal-cover" src="${escapeHTML(project.image)}" alt="${escapeHTML(project.alt)}" width="1000" height="620"><h2 id="modal-title">${escapeHTML(project.title)}</h2><p class="modal-note">${escapeHTML(project.status)}</p><p>${escapeHTML(project.description)}</p>${badges(project.technologies)}<div class="row g-4"><div class="col-md-6"><h3>Main features</h3>${list(project.features)}<h3>Problem solved / proposed goal</h3><p>${escapeHTML(project.problem)}</p></div><div class="col-md-6"><h3>Challenges</h3><p>${escapeHTML(project.challenges)}</p><h3>What I learned / learning goals</h3><p>${escapeHTML(project.learned)}</p></div></div><div class="d-flex flex-wrap align-items-center gap-3 mt-3">${externalLink(project.demo, "Live Demo")}${externalLink(project.github, "GitHub")}</div>`,
        "PROJECT DETAILS",
      );
    }),
  );
  $$("[data-event]").forEach((button) =>
    button.addEventListener("click", () => {
      const event = events[button.dataset.event];
      if (!event) return;
      const gallery = `<div id="event-gallery" class="carousel slide" role="region" aria-label="${escapeHTML(event.title)} image gallery" aria-roledescription="carousel"><div class="carousel-indicators">${event.pictures.map((_, index) => `<button type="button" data-bs-target="#event-gallery" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" ${index === 0 ? 'aria-current="true"' : ""} aria-label="Show image ${index + 1}"></button>`).join("")}</div><div class="carousel-inner">${event.pictures.map((picture, index) => `<div class="carousel-item ${index === 0 ? "active" : ""}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${event.pictures.length}"><img src="${escapeHTML(picture.src)}" alt="${escapeHTML(picture.alt)}" width="800" height="480"><div class="carousel-caption">Placeholder illustration · ${index + 1} / ${event.pictures.length}</div></div>`).join("")}</div><button class="carousel-control-prev" type="button" data-bs-target="#event-gallery" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous image</span></button><button class="carousel-control-next" type="button" data-bs-target="#event-gallery" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next image</span></button></div>`;
      openModal(
        button,
        `${gallery}<h2 id="modal-title">${escapeHTML(event.title)}</h2><p class="modal-note">Sample event · Attendance and details have not been supplied.</p><p class="accent mono">${escapeHTML(event.category)}</p><p>${escapeHTML(event.description)}</p><div class="modal-meta"><span><i class="bi bi-calendar3" aria-hidden="true"></i> Date: ${escapeHTML(event.date)}</span><span><i class="bi bi-geo-alt" aria-hidden="true"></i> Location: ${escapeHTML(event.location)}</span><span><i class="bi bi-person" aria-hidden="true"></i> Role: ${escapeHTML(event.role)}</span></div><div class="row g-4"><div class="col-md-6"><h3>My experience</h3><p>${escapeHTML(event.experience)}</p></div><div class="col-md-6"><h3>Skills learned</h3>${list(event.learned)}</div></div>`,
        "EVENT & GALLERY",
      );
    }),
  );

  // Pointer enhancements: native cursor stays visible; RAF runs only during movement.
  const dot = $("#cursor-dot"),
    ring = $("#cursor-ring");
  let pointerX = 0,
    pointerY = 0,
    ringX = 0,
    ringY = 0,
    cursorFrame = 0;
  const pointerEnabled = () => finePointer.matches && !reducedMotion.matches;
  const drawCursor = () => {
    if (!pointerEnabled()) {
      cursorFrame = 0;
      return;
    }
    ringX += (pointerX - ringX) * 0.2;
    ringY += (pointerY - ringY) * 0.2;
    dot.style.transform = `translate3d(${pointerX - 2}px, ${pointerY - 2}px, 0)`;
    const radius = ring.classList.contains("hovering") ? 20 : 13;
    ring.style.transform = `translate3d(${ringX - radius}px, ${ringY - radius}px, 0)`;
    cursorFrame =
      Math.abs(pointerX - ringX) + Math.abs(pointerY - ringY) > 0.2
        ? requestAnimationFrame(drawCursor)
        : 0;
  };
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!pointerEnabled() || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!document.body.classList.contains("cursor-visible")) {
        ringX = pointerX;
        ringY = pointerY;
      }
      document.body.classList.add("cursor-visible");
      ring.classList.toggle(
        "hovering",
        Boolean(event.target.closest("a, button, input, textarea")),
      );
      if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () =>
    document.body.classList.remove("cursor-visible"),
  );
  addEventListener("blur", () =>
    document.body.classList.remove("cursor-visible"),
  );
  $$(".spotlight").forEach((card) => {
    let frame = 0,
      x = 0,
      y = 0;
    card.addEventListener(
      "pointermove",
      (event) => {
        if (!pointerEnabled() || event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (!pointerEnabled()) return;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            if (card.classList.contains("project-card"))
              card.style.transform = `perspective(1200px) rotateX(${-(y / rect.height - 0.5) * 3}deg) rotateY(${(x / rect.width - 0.5) * 3}deg) translateY(-3px)`;
          });
      },
      { passive: true },
    );
    card.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.style.transform = "";
    });
  });
  const resetMotion = () => {
    document.body.classList.remove("cursor-visible");
    $$(".spotlight").forEach((card) => {
      card.style.transform = "";
    });
    if (reducedMotion.matches) {
      clearTimeout(typingTimer);
      roleElement.textContent = "Web Developer";
      loader.hidden = true;
      $$(".reveal").forEach((element) => element.classList.add("is-visible"));
    }
  };
  reducedMotion.addEventListener("change", resetMotion);
  finePointer.addEventListener("change", resetMotion);

  // Real email submission through FormSubmit. Only a positive JSON confirmation
  // counts as acceptance; HTTP 200 alone is not proof that a form succeeded.
  const form = $("#contact-form");
  form.noValidate = true;
  const fields = $$("input[required], textarea[required]", form);
  const feedback = $("#form-feedback");
  const honeypot = $("input[name='_honey']", form);
  const pageURL = ["http:", "https:"].includes(location.protocol)
    ? `${location.origin}${location.pathname}`
    : "";
  $("input[name='_url']", form).value = pageURL;
  let sending = false;
  const validField = (field) =>
    field.value.trim().length > 0 && field.checkValidity();
  const markField = (field) => {
    const valid = validField(field);
    field.classList.toggle("is-invalid", !valid);
    if (valid) field.removeAttribute("aria-invalid");
    else field.setAttribute("aria-invalid", "true");
    return valid;
  };
  fields.forEach((field) =>
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) markField(field);
    }),
  );
  const showFeedback = (message, type) => {
    feedback.hidden = false;
    feedback.className = `alert alert-${type} mt-3 mb-0`;
    feedback.textContent = message;
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    const invalid = fields.filter((field) => !markField(field));
    if (invalid.length) {
      showFeedback(
        invalid.some((field) => field.id === "email" && field.value.trim())
          ? "Please enter a valid email address and complete all required fields."
          : "Please complete all required fields.",
        "danger",
      );
      invalid[0].focus();
      return;
    }
    const data = Object.fromEntries(
      fields.map((field) => [field.name, field.value.trim()]),
    );
    if (honeypot.value) {
      showFeedback(
        "Your submission could not be processed. Please reload the page and try again.",
        "danger",
      );
      return;
    }
    if (!pageURL) {
      showFeedback(
        "To send messages, open this portfolio through http://localhost:4173 or its published HTTPS website, not by double-clicking index.html. You can also use Send Email.",
        "danger",
      );
      return;
    }
    const endpoint = safeURL(settings.formEndpoint);
    if (!endpoint.startsWith("https://")) {
      showFeedback(
        "The message service is not configured correctly. Please use Send Email instead.",
        "danger",
      );
      return;
    }
    const button = $('button[type="submit"]', form);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    sending = true;
    button.disabled = true;
    fields.forEach((field) => {
      field.disabled = true;
    });
    button.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    showFeedback("Sending your message securely...", "info");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          _subject: `Portfolio contact: ${data.subject}`,
          _replyto: data.email,
          _template: "table",
          _url: pageURL,
          _honey: "",
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json();
      const accepted = result.success === true || result.success === "true";
      // An unverified inbox may receive activation rather than message delivery.
      const needsActivation =
        /activat|confirm.{0,30}email|verif.{0,30}email/i.test(
          String(result.message ?? ""),
        );
      if (needsActivation) {
        showFeedback(
          `FormSubmit requires a one-time activation. Jonh must check ${settings.email} (including Spam) and confirm the FormSubmit activation email, then you can submit again. Your message is kept here.`,
          "info",
        );
        return;
      }
      if (!accepted) throw new Error("Service did not confirm acceptance");
      showFeedback(
        "Thank you! FormSubmit accepted your message for Jonh's Gmail inbox. Delivery requires the inbox owner's one-time activation.",
        "info",
      );
      form.reset();
      $("input[name='_url']", form).value = pageURL;
      notify("Your message was submitted successfully.");
    } catch (error) {
      showFeedback(
        error.name === "AbortError"
          ? "The email service took too long to respond, so submission could not be confirmed. Your message is kept here. Please wait before retrying, or use Send Email."
          : "Your message could not be confirmed by the email service. Your text is kept here. Please try again later or use Send Email.",
        "danger",
      );
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      fields.forEach((field) => {
        field.disabled = false;
      });
      button.innerHTML =
        'Send Message <i class="bi bi-send" aria-hidden="true"></i>';
      form.removeAttribute("aria-busy");
    }
  });
})();
