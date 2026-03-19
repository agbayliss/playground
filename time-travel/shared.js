/**
 * ============================================================================
 * ChronoVoyage — Time Travel Vacation Planner
 * SHARED.JS — Common Utilities
 * ============================================================================
 *
 * This file provides shared utilities used by every page in the ChronoVoyage
 * demo. It is loaded via a <script> tag (after data.js) and exposes
 * everything on `window.ChronoShared`.
 *
 * Modules:
 *   1. State Management   — localStorage-backed cross-page persistence
 *   2. Tool Logging       — collapsible log panel for WebMCP tool calls
 *   3. Navigation Helper  — consistent nav bar across all pages
 *   4. WebMCP Check       — banner when navigator.modelContext is unavailable
 *
 * Design system:
 *   - Background:  #0f0f1a (deep dark navy)
 *   - Surface:     #1a1a2e (card / panel background)
 *   - Border:      #2a2a4a (subtle dividers)
 *   - Text:        #e0e0e0 (primary), #a0a0b0 (secondary)
 *   - Accent:      #6C63FF (indigo)
 *   - Accent hover: #7B73FF
 *   - Danger:      #FF6B6B
 *   - Success:     #4ECB71
 *   - Font body:   'DM Sans', sans-serif
 *   - Font mono:   'DM Mono', monospace
 *
 * No build tools — plain JS, no imports.
 * ============================================================================
 */

window.ChronoShared = (function () {
  "use strict";

  // ==========================================================================
  // DESIGN TOKENS
  // ==========================================================================
  // Centralized so every component stays consistent.

  const COLORS = {
    bg: "#0f0f1a",
    surface: "#1a1a2e",
    surfaceHover: "#22223a",
    border: "#2a2a4a",
    text: "#e0e0e0",
    textSecondary: "#a0a0b0",
    accent: "#6C63FF",
    accentHover: "#7B73FF",
    accentMuted: "rgba(108, 99, 255, 0.15)",
    danger: "#FF6B6B",
    success: "#4ECB71",
    warning: "#FFB84D",
  };

  const FONTS = {
    body: "'DM Sans', sans-serif",
    mono: "'DM Mono', monospace",
  };

  // ==========================================================================
  // 1. STATE MANAGEMENT
  // ==========================================================================
  // A simple localStorage-backed store for cross-page persistence.
  // The full state shape:
  //
  // {
  //   travelerProfile: null | { id, name, riskTolerance, fitnessLevel,
  //                              eraInterests, clearanceLevel, ... },
  //   selectedEra:     null | eraId,
  //   packageConfig:   null | { eraId, templateId, duration, addOns,
  //                              totalPrice },
  //   clearanceStatus: {
  //     [prerequisiteId]: "not_started" | "pending" | "approved"
  //   }
  // }

  const STATE_KEY = "chronovoyage_state";

  /**
   * Returns the default (empty) state object.
   */
  function _defaultState() {
    return {
      travelerProfile: null,
      selectedEra: null,
      packageConfig: null,
      clearanceStatus: {},
    };
  }

  /**
   * Reads the full state from localStorage. Returns the default state if
   * nothing is stored yet (or if the stored value is corrupted).
   */
  function getState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (!raw) return _defaultState();
      var parsed = JSON.parse(raw);
      // Merge with defaults so new keys are always present
      return Object.assign(_defaultState(), parsed);
    } catch (e) {
      console.warn("[ChronoShared] Failed to read state, returning defaults:", e);
      return _defaultState();
    }
  }

  /**
   * Updates a single top-level key in the state and persists to localStorage.
   * @param {string} key   — one of: travelerProfile, selectedEra,
   *                          packageConfig, clearanceStatus
   * @param {*}      value — the new value for that key
   */
  function updateState(key, value) {
    var state = getState();
    state[key] = value;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("[ChronoShared] Failed to persist state:", e);
    }
  }

  /**
   * Resets the entire state to defaults. Useful for testing / demo resets.
   */
  function clearState() {
    try {
      localStorage.removeItem(STATE_KEY);
    } catch (e) {
      console.error("[ChronoShared] Failed to clear state:", e);
    }
  }

  /** Shortcut — returns the traveler profile or null. */
  function getTravelerProfile() {
    return getState().travelerProfile;
  }

  /** Shortcut — returns the clearanceStatus object. */
  function getClearanceStatus() {
    return getState().clearanceStatus;
  }

  // ==========================================================================
  // 2. TOOL LOGGING
  // ==========================================================================
  // A reusable, collapsible log panel that records every WebMCP tool call.
  // Each entry shows a timestamp, tool name, parameters, and result summary.

  var _logContainer = null;
  var _logEntries = [];

  /**
   * Initializes the tool log inside the given DOM container.
   * Creates the collapsible panel structure and injects styles.
   * @param {string} containerId — the id of the DOM element to mount into
   */
  function initToolLog(containerId) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.warn("[ChronoShared] Tool log container not found:", containerId);
      return;
    }

    // Inject the log panel HTML
    container.innerHTML =
      '<div id="cv-tool-log" style="' +
        "background:" + COLORS.surface + ";" +
        "border:1px solid " + COLORS.border + ";" +
        "border-radius:8px;" +
        "margin-top:24px;" +
        "overflow:hidden;" +
        "font-family:" + FONTS.mono + ";" +
        "font-size:13px;" +
      '">' +
        '<div id="cv-tool-log-header" style="' +
          "display:flex;" +
          "align-items:center;" +
          "justify-content:space-between;" +
          "padding:12px 16px;" +
          "cursor:pointer;" +
          "user-select:none;" +
          "background:" + COLORS.bg + ";" +
          "border-bottom:1px solid " + COLORS.border + ";" +
        '">' +
          '<span style="color:' + COLORS.accent + ';font-weight:600;">' +
            "Tool Call Log" +
          "</span>" +
          '<span id="cv-tool-log-toggle" style="color:' + COLORS.textSecondary + ';">' +
            "&#9660;" +
          "</span>" +
        "</div>" +
        '<div id="cv-tool-log-body" style="' +
          "max-height:300px;" +
          "overflow-y:auto;" +
          "padding:0;" +
          "display:none;" +
        '">' +
          '<div id="cv-tool-log-entries" style="padding:8px 16px;">' +
            '<p style="color:' + COLORS.textSecondary + ';margin:8px 0;font-style:italic;">' +
              "No tool calls recorded yet." +
            "</p>" +
          "</div>" +
        "</div>" +
      "</div>";

    _logContainer = document.getElementById("cv-tool-log-entries");

    // Toggle expand/collapse
    var header = document.getElementById("cv-tool-log-header");
    var body = document.getElementById("cv-tool-log-body");
    var toggle = document.getElementById("cv-tool-log-toggle");

    header.addEventListener("click", function () {
      var isOpen = body.style.display !== "none";
      body.style.display = isOpen ? "none" : "block";
      toggle.innerHTML = isOpen ? "&#9660;" : "&#9650;";
    });
  }

  /**
   * Adds a log entry to the tool log panel.
   * @param {string} toolName — the name of the WebMCP tool called
   * @param {object} params   — the parameters passed to the tool
   * @param {*}      result   — the result summary (string or object)
   */
  function addLog(toolName, params, result) {
    var timestamp = new Date().toLocaleTimeString();
    var entry = { toolName: toolName, params: params, result: result, timestamp: timestamp };
    _logEntries.push(entry);

    if (!_logContainer) {
      console.log("[ChronoShared] Tool log not initialized, logging to console:", entry);
      return;
    }

    // Clear the placeholder if this is the first entry
    if (_logEntries.length === 1) {
      _logContainer.innerHTML = "";
    }

    var paramsStr = "";
    try {
      paramsStr = JSON.stringify(params, null, 2);
    } catch (e) {
      paramsStr = String(params);
    }

    var resultStr = "";
    try {
      resultStr = typeof result === "string" ? result : JSON.stringify(result, null, 2);
    } catch (e) {
      resultStr = String(result);
    }

    var entryHtml =
      '<div style="' +
        "border-bottom:1px solid " + COLORS.border + ";" +
        "padding:10px 0;" +
      '">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="color:' + COLORS.accent + ';font-weight:600;">' +
            _escapeHtml(toolName) +
          "</span>" +
          '<span style="color:' + COLORS.textSecondary + ';font-size:11px;">' +
            _escapeHtml(timestamp) +
          "</span>" +
        "</div>" +
        '<details style="margin-top:4px;">' +
          '<summary style="color:' + COLORS.textSecondary + ';cursor:pointer;font-size:12px;">' +
            "Parameters" +
          "</summary>" +
          '<pre style="' +
            "background:" + COLORS.bg + ";" +
            "padding:8px;" +
            "border-radius:4px;" +
            "margin:4px 0 0 0;" +
            "overflow-x:auto;" +
            "color:" + COLORS.text + ";" +
            "font-size:12px;" +
            "white-space:pre-wrap;" +
            "word-break:break-word;" +
          '">' +
            _escapeHtml(paramsStr) +
          "</pre>" +
        "</details>" +
        '<details style="margin-top:4px;">' +
          '<summary style="color:' + COLORS.textSecondary + ';cursor:pointer;font-size:12px;">' +
            "Result" +
          "</summary>" +
          '<pre style="' +
            "background:" + COLORS.bg + ";" +
            "padding:8px;" +
            "border-radius:4px;" +
            "margin:4px 0 0 0;" +
            "overflow-x:auto;" +
            "color:" + COLORS.success + ";" +
            "font-size:12px;" +
            "white-space:pre-wrap;" +
            "word-break:break-word;" +
          '">' +
            _escapeHtml(resultStr) +
          "</pre>" +
        "</details>" +
      "</div>";

    // Prepend newest entry at the top
    _logContainer.insertAdjacentHTML("afterbegin", entryHtml);

    // Auto-expand the log body when a new entry arrives
    var body = document.getElementById("cv-tool-log-body");
    var toggle = document.getElementById("cv-tool-log-toggle");
    if (body && body.style.display === "none") {
      body.style.display = "block";
      if (toggle) toggle.innerHTML = "&#9650;";
    }
  }

  // ==========================================================================
  // 3. NAVIGATION HELPER
  // ==========================================================================
  // Renders a consistent horizontal nav bar at the top of every page.

  /** @type {{ id: string, label: string, href: string }[]} */
  var NAV_PAGES = [
    { id: "profile",    label: "Profile",    href: "index.html" },
    { id: "explore",    label: "Explore",    href: "explore.html" },
    { id: "build",      label: "Build",      href: "build.html" },
    { id: "clearance",  label: "Clearance",  href: "clearance.html" },
    { id: "checkout",   label: "Checkout",   href: "checkout.html" },
  ];

  /**
   * Renders the navigation bar into the page.
   * Should be called once on DOMContentLoaded.
   * @param {string} currentPage — the `id` of the active page (e.g. "explore")
   */
  function renderNav(currentPage) {
    // Create the nav element
    var nav = document.createElement("nav");
    nav.id = "cv-nav";
    nav.style.cssText =
      "display:flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "gap:4px;" +
      "padding:16px 24px;" +
      "background:" + COLORS.bg + ";" +
      "border-bottom:1px solid " + COLORS.border + ";" +
      "font-family:" + FONTS.body + ";" +
      "position:sticky;" +
      "top:0;" +
      "z-index:1000;";

    // Logo / title
    var logo = document.createElement("a");
    logo.href = "index.html";
    logo.style.cssText =
      "font-size:18px;" +
      "font-weight:700;" +
      "color:" + COLORS.accent + ";" +
      "text-decoration:none;" +
      "margin-right:24px;" +
      "white-space:nowrap;";
    logo.textContent = "ChronoVoyage";
    nav.appendChild(logo);

    // Step indicators with connecting lines
    for (var i = 0; i < NAV_PAGES.length; i++) {
      var page = NAV_PAGES[i];
      var isActive = page.id === currentPage;
      var stepNum = i + 1;

      // Connecting line (between steps, not before first)
      if (i > 0) {
        var line = document.createElement("div");
        line.style.cssText =
          "width:32px;" +
          "height:2px;" +
          "background:" + COLORS.border + ";";
        nav.appendChild(line);
      }

      // Step link
      var link = document.createElement("a");
      link.href = page.href;
      link.style.cssText =
        "display:flex;" +
        "align-items:center;" +
        "gap:8px;" +
        "padding:8px 16px;" +
        "border-radius:8px;" +
        "text-decoration:none;" +
        "font-size:14px;" +
        "font-weight:" + (isActive ? "600" : "400") + ";" +
        "color:" + (isActive ? COLORS.accent : COLORS.textSecondary) + ";" +
        "background:" + (isActive ? COLORS.accentMuted : "transparent") + ";" +
        "transition:background 0.2s, color 0.2s;" +
        "white-space:nowrap;";

      // Step number badge
      var badge = document.createElement("span");
      badge.style.cssText =
        "display:inline-flex;" +
        "align-items:center;" +
        "justify-content:center;" +
        "width:24px;" +
        "height:24px;" +
        "border-radius:50%;" +
        "font-size:12px;" +
        "font-weight:700;" +
        "background:" + (isActive ? COLORS.accent : COLORS.border) + ";" +
        "color:" + (isActive ? "#fff" : COLORS.textSecondary) + ";";
      badge.textContent = stepNum;
      link.appendChild(badge);

      // Label
      var label = document.createElement("span");
      label.textContent = page.label;
      link.appendChild(label);

      // Hover effect
      (function (linkEl, active) {
        linkEl.addEventListener("mouseenter", function () {
          if (!active) {
            linkEl.style.background = COLORS.surfaceHover;
            linkEl.style.color = COLORS.text;
          }
        });
        linkEl.addEventListener("mouseleave", function () {
          if (!active) {
            linkEl.style.background = "transparent";
            linkEl.style.color = COLORS.textSecondary;
          }
        });
      })(link, isActive);

      nav.appendChild(link);
    }

    // Insert at the very top of the body
    document.body.insertBefore(nav, document.body.firstChild);
  }

  // ==========================================================================
  // 4. WEBMCP AVAILABILITY CHECK
  // ==========================================================================
  // Shows a subtle, dismissible banner when navigator.modelContext is absent.

  /**
   * Checks for WebMCP support and renders a non-intrusive banner if missing.
   * Call once on DOMContentLoaded.
   */
  function checkWebMCP() {
    // If the API is present, do nothing
    if (typeof navigator !== "undefined" && navigator.modelContext) {
      return;
    }

    var banner = document.createElement("div");
    banner.id = "cv-webmcp-banner";
    banner.style.cssText =
      "display:flex;" +
      "align-items:center;" +
      "justify-content:center;" +
      "gap:12px;" +
      "padding:10px 20px;" +
      "background:" + COLORS.accentMuted + ";" +
      "border-bottom:1px solid " + COLORS.accent + ";" +
      "font-family:" + FONTS.body + ";" +
      "font-size:13px;" +
      "color:" + COLORS.text + ";" +
      "text-align:center;";

    var msg = document.createElement("span");
    msg.innerHTML =
      '<strong style="color:' + COLORS.accent + ';">WebMCP not detected.</strong> ' +
      "AI agent features require Chrome Canary with the WebMCP flag enabled. " +
      "You can still browse the demo manually.";
    banner.appendChild(msg);

    var dismiss = document.createElement("button");
    dismiss.textContent = "Dismiss";
    dismiss.style.cssText =
      "background:transparent;" +
      "border:1px solid " + COLORS.accent + ";" +
      "color:" + COLORS.accent + ";" +
      "padding:4px 12px;" +
      "border-radius:4px;" +
      "cursor:pointer;" +
      "font-family:" + FONTS.body + ";" +
      "font-size:12px;";
    dismiss.addEventListener("click", function () {
      banner.remove();
    });
    banner.appendChild(dismiss);

    // Insert after the nav (if it exists) or at the top of body
    var nav = document.getElementById("cv-nav");
    if (nav && nav.nextSibling) {
      document.body.insertBefore(banner, nav.nextSibling);
    } else if (nav) {
      document.body.appendChild(banner);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  // ==========================================================================
  // INTERNAL HELPERS
  // ==========================================================================

  /** Simple HTML escaping to prevent injection in log entries. */
  function _escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  return {
    // Design tokens (for pages that need them)
    COLORS: COLORS,
    FONTS: FONTS,

    // State management
    getState: getState,
    updateState: updateState,
    clearState: clearState,
    getTravelerProfile: getTravelerProfile,
    getClearanceStatus: getClearanceStatus,

    // Tool logging
    initToolLog: initToolLog,
    addLog: addLog,

    // Navigation
    renderNav: renderNav,

    // WebMCP check
    checkWebMCP: checkWebMCP,
  };
})();
