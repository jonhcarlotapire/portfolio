/* Real AI frontend. Only PUBLIC configuration belongs here. Never add an API key. */
(() => {
  "use strict";
  const config = Object.freeze({
    endpoint: "", // Deployed Cloudflare Worker HTTPS URL ending in /chat.
    turnstileSiteKey: "", // PUBLIC Turnstile sitekey, not its secret.
  });
  const $ = (selector) => document.querySelector(selector);
  const panel = $("#portfolio-chat");
  const launcher = $("#chat-launcher");
  const form = $("#chat-form");
  const input = $("#chat-input");
  const send = $("#chat-send");
  const log = $("#chat-log");
  const status = $("#chat-status");
  const suggestions = [...document.querySelectorAll("[data-chat-question]")];
  let history = [],
    busy = false,
    token = "",
    widget,
    verificationLoading;
  let controller,
    requestGeneration = 0;
  const configured = (() => {
    try {
      return (
        new URL(config.endpoint).protocol === "https:" &&
        Boolean(config.turnstileSiteKey) &&
        ["http:", "https:"].includes(location.protocol)
      );
    } catch {
      return false;
    }
  })();

  // Render model output as TEXT, never HTML or executable Markdown.
  const appendMessage = (role, text, extraClass = "") => {
    const message = document.createElement("div");
    message.className = `chat-message chat-${role} ${extraClass}`;
    const label = document.createElement("span");
    label.className = "chat-message-label mono";
    label.textContent = role === "user" ? "YOU" : "JONH'S ASSISTANT";
    const body = document.createElement("p");
    body.textContent = text;
    message.append(label, body);
    log.append(message);
    // Bound the visible transcript and memory; no browser storage is used.
    while (log.children.length > 31) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
    return message;
  };
  const refreshControls = () => {
    input.disabled = !configured || busy;
    send.disabled = !configured || busy || !token;
    suggestions.forEach((button) => {
      button.disabled = !configured || busy || !token;
    });
    form.setAttribute("aria-busy", String(busy));
  };
  const welcome = () => {
    appendMessage(
      "assistant",
      "Hi! Ask me about Jonh's web development skills, projects, developer journey, or how to get in touch. I can only use the portfolio information he has provided.",
    );
    if (!configured) {
      $("#chat-connection").textContent = "AI CONNECTION PENDING";
      status.textContent =
        "The AI service isn't connected yet. Please contact Jonh directly for now.";
      input.placeholder = "AI service not connected yet";
    } else status.textContent = "Preparing secure verification...";
    refreshControls();
  };

  // Load Turnstile only on opening the chat, not on every portfolio visit.
  const loadVerification = () => {
    if (!configured) return Promise.resolve();
    if (widget !== undefined) {
      if (!token && !busy) window.turnstile?.reset(widget);
      return Promise.resolve();
    }
    if (verificationLoading) return verificationLoading;
    verificationLoading = new Promise((resolve, reject) => {
      if (window.turnstile?.render) return resolve();
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error("Verification timed out"));
      }, 12000);
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error("Verification unavailable"));
      };
      document.head.append(script);
    })
      .then(() => {
        if (!window.turnstile?.render)
          throw new Error("Verification unavailable");
        widget = window.turnstile.render("#chat-verification", {
          sitekey: config.turnstileSiteKey,
          theme: "dark",
          size: innerWidth < 380 ? "compact" : "flexible",
          action: "portfolio_chat",
          appearance: "interaction-only",
          callback: (value) => {
            token = value;
            if (!busy) status.textContent = "Ready for your question.";
            refreshControls();
          },
          "expired-callback": () => {
            token = "";
            if (!busy)
              status.textContent = "Verification expired. Please verify again.";
            refreshControls();
            if (!busy) window.turnstile.reset(widget);
          },
          "error-callback": () => {
            token = "";
            if (!busy)
              status.textContent =
                "Verification failed. Close and reopen chat to retry.";
            refreshControls();
          },
        });
      })
      .catch(() => {
        verificationLoading = null;
        status.textContent =
          "Couldn't load secure verification. Close and reopen chat to retry, or contact Jonh directly.";
      });
    return verificationLoading;
  };
  const resetVerification = () => {
    token = "";
    refreshControls();
    if (widget !== undefined && window.turnstile)
      window.turnstile.reset(widget);
  };
  const cancelPending = () => {
    requestGeneration++;
    controller?.abort();
    controller = undefined;
    busy = false;
    log.querySelector(".chat-thinking")?.remove();
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
    loadVerification();
    if (configured) input.focus();
    else $("#chat-close").focus();
  });
  $("#chat-close").addEventListener("click", () => panel.close());
  panel.addEventListener("close", () => {
    const wasBusy = busy;
    cancelPending();
    launcher.setAttribute("aria-expanded", "false");
    if (wasBusy) {
      status.textContent = "Request cancelled. You can ask again.";
      resetVerification();
    }
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
    cancelPending();
    history = [];
    log.replaceChildren();
    input.value = "";
    welcome();
    resetVerification();
    if (configured) input.focus();
  });
  suggestions.forEach((button) =>
    button.addEventListener("click", () => {
      input.value = button.dataset.chatQuestion;
      form.requestSubmit();
    }),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !configured) return;
    const question = input.value.trim();
    if (!question || question.length > 600) {
      status.textContent = "Please enter a question of 1–600 characters.";
      input.focus();
      return;
    }
    if (!token) {
      status.textContent = "Please complete the secure verification first.";
      return;
    }
    busy = true;
    refreshControls();
    const generation = ++requestGeneration;
    const currentController = new AbortController();
    controller = currentController;
    const timeout = setTimeout(() => currentController.abort(), 30000);
    appendMessage("user", question);
    const thinking = appendMessage("assistant", "Thinking...", "chat-thinking");
    status.textContent = "Asking the AI assistant...";
    try {
      const payload = {
        message: question,
        history: history.slice(-8),
        turnstileToken: token,
      };
      // Unicode text can use multiple bytes per character. Trim whole turn pairs.
      while (
        new TextEncoder().encode(JSON.stringify(payload)).byteLength > 14000 &&
        payload.history.length
      )
        payload.history.splice(0, 2);
      const response = await fetch(config.endpoint, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: currentController.signal,
      });
      if (!response.ok) {
        const error = new Error("AI unavailable");
        error.status = response.status;
        throw error;
      }
      const result = await response.json();
      if (
        typeof result.reply !== "string" ||
        !result.reply.trim() ||
        result.reply.length > 5000
      )
        throw new Error("Invalid response");
      if (generation !== requestGeneration) return;
      thinking.remove();
      appendMessage("assistant", result.reply);
      history.push(
        { role: "user", content: question },
        { role: "assistant", content: result.reply.slice(0, 1200) },
      );
      history = history.slice(-8);
      input.value = "";
      status.textContent =
        "AI response received. Verify important details with Jonh.";
    } catch (error) {
      if (generation !== requestGeneration) return;
      thinking.remove();
      const message =
        error.status === 429
          ? "Too many questions right now. Please wait a minute and try again."
          : error.status === 403
            ? "Secure verification failed. Please verify again and retry."
            : error.name === "AbortError"
              ? "The AI took too long to respond. Your question is kept here; please try again."
              : "The AI service is unavailable. Your question is kept here. Please retry later or contact Jonh directly.";
      appendMessage("assistant", message, "chat-error");
      status.textContent = message;
    } finally {
      clearTimeout(timeout);
      if (generation === requestGeneration) {
        busy = false;
        controller = undefined;
        resetVerification();
        if (panel.open) input.focus();
      }
    }
  });
})();
