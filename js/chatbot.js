/* Local portfolio Q&A: no API, private key, backend, AI model, or external requests.
 * It deliberately does not claim to be generative AI. Facts come from script.js.
 */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const profile = window.JCT_PORTFOLIO;
  if (!profile) return;
  const panel = $("#portfolio-chat"),
    launcher = $("#chat-launcher");
  const form = $("#chat-form"),
    input = $("#chat-input"),
    log = $("#chat-log"),
    status = $("#chat-status");
  const normalize = (text) =>
    String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9+#@.\s/-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const contactLink = { label: "Contact Jonh", href: "#contact" };
  let lastTopic = "about";

  // Approved links are constructed from local data, never from a visitor's input.
  const safeLink = (value) => {
    if (/^#[a-z][a-z0-9-]*$/i.test(value)) return value;
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  };
  const appendMessage = (role, text, links = []) => {
    const message = document.createElement("div");
    message.className = `chat-message chat-${role}`;
    const label = document.createElement("span");
    label.className = "chat-message-label mono";
    label.textContent = role === "user" ? "YOU" : "PORTFOLIO ASSISTANT";
    const body = document.createElement("p");
    body.textContent = text;
    message.append(label, body);
    if (links.length) {
      const actions = document.createElement("div");
      actions.className = "chat-message-actions";
      const seen = new Set();
      for (const link of links) {
        const href = safeLink(link.href);
        if (!href || seen.has(href)) continue;
        seen.add(href);
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.textContent = link.label;
        if (href.startsWith("https:")) {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.setAttribute(
            "aria-label",
            `${link.label} (opens in a new tab)`,
          );
        } else anchor.addEventListener("click", () => panel.close());
        actions.append(anchor);
      }
      message.append(actions);
    }
    log.append(message);
    while (log.children.length > 31) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  };
  const socialAnswers = () => ({
    text: profile.socials
      .map((social) => `${social.label}: ${social.url || "Link not provided"}`)
      .join("\n"),
    links: profile.socials
      .filter((social) => social.url)
      .map((social) => ({ label: social.label, href: social.url })),
  });
  const topics = {
    about: () => ({
      text: `${profile.name} is a ${profile.role} based in ${profile.location}.\n\n${profile.introduction}`,
      links: [{ label: "About Jonh", href: "#about" }],
    }),
    name: () => ({
      text: `His full name is ${profile.name}. The spelling is Jonh, not John.`,
      links: [],
    }),
    role: () => ({
      text: `${profile.name}'s main role is ${profile.role}. His focus is creating responsive and interactive websites.`,
      links: [{ label: "Explore skills", href: "#skills" }],
    }),
    location: () => ({
      text: `${profile.name} is based in ${profile.location}. No street address or more specific location has been published.`,
      links: [contactLink],
    }),
    skills: () => ({
      text: `Jonh's listed technologies are:\n${profile.skills.map((skill) => `• ${skill}`).join("\n")}\n\nHTML structures content; CSS handles styling and layouts; Bootstrap provides responsive components; JavaScript adds interaction. No percentage ratings or experience durations have been supplied.`,
      links: [{ label: "View skills", href: "#skills" }],
    }),
    projects: () => ({
      text:
        profile.projects
          .map((project) => `• ${project.title}: ${project.status}`)
          .join("\n") +
        "\n\nThis portfolio is implemented. Entries labeled concept or sample are not completed applications.",
      links: [{ label: "View projects", href: "#projects" }],
    }),
    events: () => ({
      text:
        profile.events
          .map(
            (event) =>
              `${event.title}\nCategory: ${event.category}\nDate: ${event.date}\nLocation: ${event.location}\nRole: ${event.role}`,
          )
          .join("\n\n") +
        "\n\nThese entries are currently samples. Added photos do not establish attendance, achievements, or learning outcomes. Jonh needs to provide those details.",
      links: [{ label: "Explore events", href: "#events" }],
    }),
    journey: () => ({
      text:
        profile.journey
          .map((item) => `• ${item.title}: ${item.description}`)
          .join("\n") +
        "\n\nThis is the portfolio's editable learning overview; dates haven't been supplied.",
      links: [{ label: "Developer journey", href: "#journey" }],
    }),
    contact: () => ({
      text: `Email: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\n\nThe contact section includes email/phone links and a FormSubmit contact form. Form delivery requires the inbox owner's one-time activation. This chat cannot send messages or book appointments.`,
      links: [contactLink],
    }),
    email: () => ({
      text: `Jonh's email address is ${profile.email}. Use Send Email or the contact form in the contact section.`,
      links: [contactLink],
    }),
    phone: () => ({
      text: `Jonh's published phone number is ${profile.phone}. The contact section has a clickable phone link.`,
      links: [contactLink],
    }),
    education: () => ({
      text:
        profile.education +
        " No school, degree, course, graduation date, or grades are verified in this portfolio.",
      links: [contactLink],
    }),
    employment: () => ({
      text:
        profile.employment +
        " Contact Jonh directly to confirm qualifications or work history.",
      links: [contactLink],
    }),
    interests: () => ({
      text: `Jonh's published programming interests are ${profile.interests} Personal hobbies haven't been provided.`,
      links: [{ label: "About Jonh", href: "#about" }],
    }),
    goals: () => ({
      text: profile.goal,
      links: [{ label: "Current learning goal", href: "#journey" }],
    }),
    socials: socialAnswers,
    availability: () => ({
      text: "Availability, rates, working hours, CV, and hiring terms haven't been published. Please contact Jonh about a project, internship, job, or collaboration.",
      links: [contactLink],
    }),
    assistant: () => ({
      text: "I'm a local, scripted portfolio Q&A assistant—not generative AI. I match questions to Jonh's published information. No private key, backend, account, model download, or chat service is needed. Your chat stays in this tab and disappears when you clear it or reload.",
      links: [],
    }),
  };
  // Explicit topic matching keeps unknown facts unknown. Add aliases here as needed.
  const rules = [
    [
      "education",
      /\b(school|college|university|education|degree|course|graduat\w*|grades?|studying|student|paaralan|kolehiyo|nag aaral)\b/,
    ],
    [
      "employment",
      /\b(employ\w*|work history|experience|certificat\w*|awards?|achievements?|previous jobs?|years of|worked for|clients?)\b/,
    ],
    [
      "availability",
      /\b(hire|hiring|available|availability|rates?|salary|prices?|freelanc\w*|internship|opportunity|collaborat\w*|resume|cv|booking|working hours)\b/,
    ],
    [
      "socials",
      /\b(social\w*|github|linkedin|facebook|instagram|accounts?|profiles?)\b/,
    ],
    [
      "journey",
      /\b(journey|timeline|milestones?|started|learning path|history of learning)\b/,
    ],
    [
      "events",
      /\b(events?|workshops?|hackathons?|activities|seminars?|attend\w*|participat\w*|competition|joined)\b/,
    ],
    [
      "goals",
      /\b(goals?|aspiration\w*|ambition\w*|future|career plans?|next steps?|pangarap|layunin)\b/,
    ],
    [
      "interests",
      /\b(interests?|hobbies|hobby|passion\w*|enjoy\w*|likes?|hilig)\b/,
    ],
    [
      "projects",
      /\b(projects?|portfolio website|websites? built|built|created|applications?|apps?|gawa|ginawa)\b/,
    ],
    [
      "skills",
      /\b(skills?|technolog\w*|tech stack|languages?|html5?|css3?|bootstrap|javascript|programming knowledge|know|kaya|kasanayan)\b/,
    ],
    ["email", /\b(email|e mail|gmail)\b/],
    [
      "phone",
      /\b(phone|telephone|mobile number|contact number|call|text|numero)\b/,
    ],
    ["contact", /\b(contact|reach|connect|message|makontak|makausap)\b/],
    [
      "location",
      /\b(where|location|based|lives?|address|city|country|saan|taga)\b/,
    ],
    [
      "role",
      /\b(role|occupation|profession|what does he do|what do you do|developer|programmer|trabaho)\b/,
    ],
    ["name", /\b(name|pangalan)\b/],
    [
      "assistant",
      /\b(chatbot|assistant|artificial intelligence|ai|api|private key|openai|cloudflare|how do you work|send.*(data|chat)|privacy)\b/,
    ],
    [
      "about",
      /\b(about|who|background|bio|biography|introduc\w*|sino|jonh|john|tapire)\b/,
    ],
  ];
  const answer = (question) => {
    const text = normalize(question);
    if (
      /\b(age|old|birthday|born|birth|family|parents?|girlfriend|boyfriend|married|religion|height|weight|ilang taon)\b/.test(
        text,
      )
    )
      return {
        text: "That personal detail hasn't been provided in Jonh's portfolio, so I won't guess. Please contact him directly if it is relevant to your question.",
        links: [contactLink],
      };
    if (
      /\b(?:react|vue|angular|node|python|php|java|typescript|tailwind|mysql|sql)\b|\bc(?:\+\+|#)(?!\w)/.test(
        text,
      )
    )
      return {
        text: `The verified skills listed here are ${profile.skills.join(", ")}. Other technologies haven't been confirmed; that doesn't mean Jonh cannot use them. Contact him to ask about a specific technology.`,
        links: [{ label: "View skills", href: "#skills" }, contactLink],
      };
    const project = profile.projects.find(
      (item) =>
        text.includes(normalize(item.title)) ||
        (item.title === "Personal Portfolio" &&
          /\b(this website|this site|portfolio project)\b/.test(text)),
    );
    if (project) {
      lastTopic = "projects";
      return {
        text: `${project.title}\n${project.status}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(", ")}\n\n${project.features.map((feature) => `• ${feature}`).join("\n")}\n\nChallenges: ${project.challenges}\n\nLearning / learning goals: ${project.learned}`,
        links: [{ label: "View project details", href: "#projects" }],
      };
    }
    if (
      /^(tell me more|more|more details|details|what else|dagdag|continue)[.! ]*$/.test(
        text,
      )
    )
      return topics[lastTopic]();
    if (
      /^(hi|hello|hey|hello there|good morning|good afternoon|good evening|kumusta|kamusta|thanks|thank you)[.! ]*$/.test(
        text,
      )
    )
      return {
        text: "Hello! I can help with Jonh's background, skills, projects, events, learning journey, social links, and contact information. What would you like to know?",
        links: [],
      };
    if (/\b(everything|all about|lahat)\b/.test(text))
      return {
        text: [
          topics.about().text,
          topics.skills().text,
          topics.projects().text,
          topics.contact().text,
        ].join("\n\n"),
        links: [
          { label: "About", href: "#about" },
          { label: "Projects", href: "#projects" },
          contactLink,
        ],
      };
    const matches = rules
      .filter(([, pattern]) => pattern.test(text))
      .map(([topic]) => topic);
    // General names/phrases should not drown out specific topics or duplicate contact.
    let selected = matches.filter(
      (topic) => !["about", "name", "role"].includes(topic),
    );
    if (!selected.length) selected = matches.slice(0, 1);
    if (selected.includes("contact"))
      selected = selected.filter(
        (topic) => !["email", "phone"].includes(topic),
      );
    if (selected.length) {
      lastTopic = selected[0];
      const responses = selected.slice(0, 3).map((topic) => topics[topic]());
      return {
        text: responses.map((item) => item.text).join("\n\n"),
        links: responses.flatMap((item) => item.links),
      };
    }
    return {
      text: "I don't have a verified answer to that question. This local assistant only covers Jonh's published portfolio details. Try asking about his skills, projects, events, journey, social links, or contact information.",
      links: [contactLink],
    };
  };
  const welcome = () => {
    appendMessage(
      "assistant",
      "Hi! I'm Jonh's local portfolio assistant. Ask about his skills, projects, events, developer journey, social links, or how to contact him. I'll say when a detail hasn't been provided.",
    );
    status.textContent = "Ready • No API key or account needed.";
  };
  launcher.hidden = false;
  welcome();
  launcher.addEventListener("click", () => {
    if (panel.open) {
      panel.close();
      return;
    }
    panel.show();
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  });
  $("#chat-close").addEventListener("click", () => panel.close());
  panel.addEventListener("close", () => {
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus({ preventScroll: true });
  });
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      panel.close();
    }
  });
  $("#chat-clear").addEventListener("click", () => {
    log.replaceChildren();
    input.value = "";
    lastTopic = "about";
    welcome();
    input.focus();
  });
  document.querySelectorAll("[data-chat-question]").forEach((button) =>
    button.addEventListener("click", () => {
      input.value = button.dataset.chatQuestion;
      form.requestSubmit();
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || question.length > 600) {
      status.textContent = "Please enter a question of 1–600 characters.";
      input.focus();
      return;
    }
    const response = answer(question);
    appendMessage("user", question);
    appendMessage("assistant", response.text, response.links);
    input.value = "";
    status.textContent =
      "Answered from the published portfolio. Chat stays in this tab.";
    input.focus();
  });
})();
