// Domain Scraper Bookmarklet — source (minified version embedded in index.html)
(function () {
  'use strict';

  // --- Platform detection ---
  var host = window.location.hostname;
  var platform = null;
  if (host.includes('chatgpt.com') || host.includes('chat.openai.com')) {
    platform = 'chatgpt';
  } else if (host.includes('perplexity')) {
    platform = 'perplexity';
  } else if (host.includes('google.com')) {
    platform = 'google';
  }

  if (!platform) {
    alert('Domain Scraper: This page is not ChatGPT, Perplexity, or Google AI Mode.');
    return;
  }

  // --- Internal domains to filter out ---
  var internalDomains = [
    'chatgpt.com', 'chat.openai.com', 'openai.com',
    'perplexity.ai',
    'google.com', 'accounts.google.com', 'support.google.com',
    'policies.google.com', 'play.google.com', 'maps.google.com',
    'mail.google.com', 'drive.google.com', 'docs.google.com'
  ];

  function isInternal(domain) {
    for (var i = 0; i < internalDomains.length; i++) {
      if (domain === internalDomains[i]) return true;
    }
    // google.co.* pattern
    if (/^google\.co(\.[a-z]+)?$/i.test(domain)) return true;
    if (/^www\.google\./i.test(domain)) return true;
    return false;
  }

  // --- Google URL unwrapping ---
  function unwrapUrl(href) {
    if (href.includes('google.com/url')) {
      var match = href.match(/[?&](?:url|q)=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return href;
  }

  // --- Extract domain from href ---
  function extractDomain(href) {
    try {
      href = unwrapUrl(href);
      var url = new URL(href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
      var domain = url.hostname.replace(/^www\./, '');
      if (isInternal(domain)) return null;
      return domain;
    } catch (e) {
      return null;
    }
  }

  // --- Layered container finding ---
  function findLinks() {
    var links = [];

    // Layer 1: Semantic selectors — elements with source/citation in class or data-testid
    var semanticContainers = document.querySelectorAll(
      '[class*="source" i], [class*="Source"], [class*="citation" i], [class*="Citation"], ' +
      '[data-testid*="source" i], [data-testid*="citation" i]'
    );
    semanticContainers.forEach(function (el) {
      var anchors = el.querySelectorAll('a[href]');
      anchors.forEach(function (a) { links.push(a.href); });
    });

    if (links.length >= 2) return links;

    // Layer 2: Structural selectors — dialogs, panels, drawers, sidebars
    var structuralSelectors = [
      '[role="dialog"]', '[role="complementary"]',
      '[class*="drawer" i]', '[class*="panel" i]',
      '[class*="sidebar" i]', '[class*="modal" i]',
      '[class*="overlay" i]'
    ];
    structuralSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var anchors = el.querySelectorAll('a[href]');
        if (anchors.length >= 2) {
          anchors.forEach(function (a) { links.push(a.href); });
        }
      });
    });

    if (links.length >= 2) return links;

    // Layer 3: Content-based selectors (platform-specific)
    if (platform === 'perplexity') {
      document.querySelectorAll(
        '[class*="ref" i], [class*="web-result" i], [class*="search-result" i], [class*="result" i]'
      ).forEach(function (el) {
        el.querySelectorAll('a[href]').forEach(function (a) { links.push(a.href); });
      });
    }
    if (platform === 'google') {
      // cite elements often contain source URLs nearby
      document.querySelectorAll('cite').forEach(function (el) {
        var parent = el.closest('a[href]') || el.parentElement;
        if (parent) {
          var anchors = parent.querySelectorAll ? parent.querySelectorAll('a[href]') : [];
          anchors.forEach(function (a) { links.push(a.href); });
          if (parent.href) links.push(parent.href);
        }
      });
      // data-ved attributed links
      document.querySelectorAll('a[data-ved][href]').forEach(function (a) {
        links.push(a.href);
      });
      // favicon-adjacent links
      document.querySelectorAll('img[src*="favicon"], img[src*="s2/favicons"]').forEach(function (img) {
        var container = img.closest('div') || img.parentElement;
        if (container) {
          container.querySelectorAll('a[href]').forEach(function (a) { links.push(a.href); });
        }
      });
    }

    if (links.length >= 2) return links;

    // Layer 4: Broad fallback — main content area external links
    var broadSelectors = [
      'article', 'main',
      '[class*="response" i]', '[class*="answer" i]',
      '[class*="prose" i]', '[class*="markdown" i]',
      '[class*="conversation" i]', '[class*="message" i]',
      '[class*="result" i]', '[class*="content" i]'
    ];
    broadSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.querySelectorAll('a[href]').forEach(function (a) { links.push(a.href); });
      });
    });

    return links;
  }

  // --- Main extraction ---
  var rawLinks = findLinks();
  var seen = {};
  var domains = [];

  rawLinks.forEach(function (href) {
    var domain = extractDomain(href);
    if (domain && !seen[domain]) {
      seen[domain] = true;
      domains.push(domain);
    }
  });

  if (domains.length === 0) {
    alert('Domain Scraper: No source domains found.\n\nMake sure the source list is expanded/open before clicking this bookmarklet.');
    return;
  }

  var result = domains.join(', ');

  // --- Clipboard + notification ---
  function showNotification(count) {
    var el = document.createElement('div');
    el.textContent = '\u2713 ' + count + ' domain' + (count === 1 ? '' : 's') + ' copied!';
    el.style.cssText = 'position:fixed;top:16px;right:16px;z-index:999999;background:#10b981;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:15px;font-weight:700;padding:12px 20px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:opacity 0.4s;opacity:1;';
    document.body.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; }, 2000);
    setTimeout(function () { el.remove(); }, 2500);
  }

  try {
    navigator.clipboard.writeText(result).then(function () {
      showNotification(domains.length);
    }).catch(function () {
      window.prompt('Domain Scraper: Copy the domains below:', result);
    });
  } catch (e) {
    window.prompt('Domain Scraper: Copy the domains below:', result);
  }
})();
