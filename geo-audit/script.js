/* ═══════════════════════════════════════════════════════════════════════════
   script.js — OneXP GEO Audit Tool
   No ES module import/export. No frameworks. Reads window.AUDIT_CONTENT.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// Application State — single object, no other mutable globals
// ─────────────────────────────────────────────────────────────────────────────

var state = {
  pageName: "",
  pageUrl: "",
  pageType: "",               // ID from AUDIT_CONTENT.pageTypes
  currentSectionIndex: 0,
  sections: [],               // Resolved flat array of section objects (10 total)
  checkboxState: {},          // { "section-id": { 0: true/false, ... }, ... }
  notesState: {},             // { "section-id": "notes text", ... }
  visitedSections: new Set(), // Set of section IDs the user has reached
  onSummaryScreen: false      // true when the summary screen is active
};


// ─────────────────────────────────────────────────────────────────────────────
// Tier Weights and Display Metadata
// ─────────────────────────────────────────────────────────────────────────────

var TIER_WEIGHTS = {
  "critical":     3,
  "important":    2,
  "nice-to-have": 1
};

var TIER_META = {
  "critical":     { label: "Critical",     color: "#E53E3E", icon: "🔴" },
  "important":    { label: "Important",    color: "#D69E2E", icon: "🟡" },
  "nice-to-have": { label: "Nice-to-have", color: "#38A169", icon: "🟢" }
};


// ─────────────────────────────────────────────────────────────────────────────
// HTML Utilities
// ─────────────────────────────────────────────────────────────────────────────

// Escape all HTML — used for safe text output where no markup is wanted.
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize inline content — escapes all HTML, then selectively restores
// a whitelist of safe inline tags: <em>, <strong>, and <a href="...">.
// Used for body copy paragraphs and checklist item labels.
function sanitizeInline(str) {
  var escaped = escapeHtml(str);

  // Restore <em> and </em>
  escaped = escaped
    .replace(/&lt;em&gt;/g, '<em>')
    .replace(/&lt;\/em&gt;/g, '</em>');

  // Restore <strong> and </strong>
  escaped = escaped
    .replace(/&lt;strong&gt;/g, '<strong>')
    .replace(/&lt;\/strong&gt;/g, '</strong>');

  // Restore <a href="https?://..."> — href only, no other attributes allowed.
  // After escaping: <a href="url"> becomes &lt;a href=&quot;url&quot;&gt;
  escaped = escaped.replace(
    /&lt;a href=&quot;((?:https?:\/\/)[^&]*?)&quot;&gt;/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">'
  );
  escaped = escaped.replace(/&lt;\/a&gt;/g, '</a>');

  return escaped;
}

// Strip all HTML tags — used when outputting to PDF (jsPDF can't render HTML).
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '');
}


// ─────────────────────────────────────────────────────────────────────────────
// Body Copy Renderer
// The body field in content.js now contains pre-structured HTML.
// Inject it directly as innerHTML — no parsing needed.
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// Section List Builder
// ─────────────────────────────────────────────────────────────────────────────

function buildSections() {
  var part1 = AUDIT_CONTENT.parts.part1;
  var part2Section = AUDIT_CONTENT.parts.part2[state.pageType];
  var part3 = AUDIT_CONTENT.parts.part3;
  // Gracefully skip part2 if there is no entry for this page type (e.g. "other")
  if (part2Section) {
    state.sections = part1.concat([part2Section, part3]);
  } else {
    state.sections = part1.concat([part3]);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Audit State Initialiser
// Creates checkbox and notes sub-objects for each section.
// ─────────────────────────────────────────────────────────────────────────────

function initAuditState() {
  state.checkboxState = {};
  state.notesState = {};
  state.sections.forEach(function(section) {
    state.checkboxState[section.id] = {};
    section.checklist.forEach(function(_, i) {
      state.checkboxState[section.id][i] = false;
    });
    state.notesState[section.id] = '';
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// Scoring Engine
// ─────────────────────────────────────────────────────────────────────────────

function calculateScores() {
  var totalEarned   = 0;
  var totalPossible = 0;
  var sectionScores = [];

  state.sections.forEach(function(section) {
    if (section.checklist.length === 0) return; // skip Part 3

    var earned   = 0;
    var possible = 0;

    section.checklist.forEach(function(item, i) {
      var weight = TIER_WEIGHTS[item.tier];
      possible += weight;
      if (state.checkboxState[section.id][i]) {
        earned += weight;
      }
    });

    totalEarned   += earned;
    totalPossible += possible;

    sectionScores.push({
      id:        section.id,
      title:     section.title,
      partLabel: section.partLabel,
      earned:    earned,
      possible:  possible,
      pct:       possible > 0 ? Math.round((earned / possible) * 100) : 100
    });
  });

  return {
    overall: {
      earned:   totalEarned,
      possible: totalPossible,
      pct:      totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 100
    },
    sections: sectionScores
  };
}


function getUncheckedItems() {
  var items     = [];
  var tierOrder = { "critical": 0, "important": 1, "nice-to-have": 2 };

  state.sections.forEach(function(section) {
    if (section.checklist.length === 0) return;

    section.checklist.forEach(function(item, i) {
      if (!state.checkboxState[section.id][i]) {
        items.push({
          text:         item.text,
          tier:         item.tier,
          sectionTitle: section.title,
          actionTitle:  item.actionTitle,
          actionBody:   item.actionBody
        });
      }
    });
  });

  items.sort(function(a, b) {
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  return items;
}


// ─────────────────────────────────────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────────────────────────────────────

function updateProgress() {
  var pct = ((state.currentSectionIndex + 1) / state.sections.length) * 100;
  var fill = document.getElementById('progress-bar-fill');
  var track = document.getElementById('progress-bar-track');
  fill.style.width = pct + '%';
  track.setAttribute('aria-valuenow', Math.round(pct));
}


// ─────────────────────────────────────────────────────────────────────────────
// Outline Renderer
// Builds the <ul> of section buttons in the left column.
// Part labels are not shown — title only.
// ─────────────────────────────────────────────────────────────────────────────

function renderOutline() {
  var nav = document.getElementById('audit-outline');
  var ul = document.createElement('ul');

  state.sections.forEach(function(section, index) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.className = 'outline-btn';
    btn.setAttribute('data-index', index);
    btn.setAttribute('aria-label', section.title);

    var checkSpan = document.createElement('span');
    checkSpan.className = 'outline-check';
    checkSpan.setAttribute('aria-hidden', 'true');
    checkSpan.textContent = '\u25cb';

    var titleSpan = document.createElement('span');
    titleSpan.className = 'outline-title';
    titleSpan.textContent = section.title;

    btn.appendChild(checkSpan);
    btn.appendChild(titleSpan);

    btn.addEventListener('click', function() {
      renderSection(index);
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  nav.innerHTML = '';
  nav.appendChild(ul);
}


// ─────────────────────────────────────────────────────────────────────────────
// Outline State Updater
// ─────────────────────────────────────────────────────────────────────────────

function updateOutline() {
  var btns = document.querySelectorAll('.outline-btn');
  btns.forEach(function(btn) {
    var idxAttr = btn.getAttribute('data-index');

    var index    = parseInt(idxAttr, 10);
    var section  = state.sections[index];
    var checkSpan = btn.querySelector('.outline-check');

    // Active only when on a section (not on summary screen)
    btn.classList.toggle('active', !state.onSummaryScreen && index === state.currentSectionIndex);

    if (state.visitedSections.has(section.id)) {
      checkSpan.textContent = '\u25cf';
      checkSpan.classList.add('visited');
    } else {
      checkSpan.textContent = '\u25cb';
      checkSpan.classList.remove('visited');
    }

    if (!state.onSummaryScreen && index === state.currentSectionIndex) {
      checkSpan.classList.add('current');
    } else {
      checkSpan.classList.remove('current');
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// Section Renderer
// Renders the center (content) and right (checklist + notes) columns.
// ─────────────────────────────────────────────────────────────────────────────

function renderSection(index) {
  state.currentSectionIndex = index;
  var section = state.sections[index];

  // Mark this section as visited
  state.visitedSections.add(section.id);

  // ── CENTER COLUMN ─────────────────────────────────────────────────────────

  var contentEl = document.getElementById('audit-content');
  contentEl.innerHTML = '';

  // Section heading — no part label
  var heading = document.createElement('h2');
  heading.className = 'section-heading';
  heading.setAttribute('tabindex', '-1');
  heading.textContent = section.title;

  var bodyDiv = document.createElement('div');
  bodyDiv.className = 'section-body';
  // Body field contains pre-structured HTML — inject directly
  bodyDiv.innerHTML = section.body;

  contentEl.appendChild(heading);
  contentEl.appendChild(bodyDiv);

  // ── RIGHT COLUMN ──────────────────────────────────────────────────────────

  var checklistEl = document.getElementById('audit-checklist');
  checklistEl.innerHTML = '';

  // Render checklist items (if any)
  if (section.checklist.length > 0) {
    var clHeading = document.createElement('h3');
    clHeading.className = 'checklist-heading';
    clHeading.textContent = 'Checklist';
    checklistEl.appendChild(clHeading);

    var ul = document.createElement('ul');
    ul.className = 'checklist-list';

    section.checklist.forEach(function(item, itemIndex) {
      var li = document.createElement('li');
      var wrapper = document.createElement('div');
      wrapper.className = 'checklist-item';

      var checkId = 'check-' + section.id + '-' + itemIndex;

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = checkId;
      input.checked = !!state.checkboxState[section.id][itemIndex];

      var label = document.createElement('label');
      label.setAttribute('for', checkId);
      // Use innerHTML to support <em>, <strong>, <a> in checklist text
      label.innerHTML = sanitizeInline(item.text);

      input.addEventListener('change', (function(sid, idx) {
        return function(e) {
          state.checkboxState[sid][idx] = e.target.checked;
        };
      }(section.id, itemIndex)));

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      li.appendChild(wrapper);
      ul.appendChild(li);
    });

    checklistEl.appendChild(ul);
  }

  // ── NOTES TEXTAREA — appears on every section including Part 3 ─────────────

  var notesWrapper = document.createElement('div');
  notesWrapper.className = 'notes-wrapper';

  var notesLabel = document.createElement('label');
  notesLabel.setAttribute('for', 'notes-' + section.id);
  notesLabel.className = 'notes-label';
  notesLabel.textContent = 'Notes';

  var notesTextarea = document.createElement('textarea');
  notesTextarea.id = 'notes-' + section.id;
  notesTextarea.className = 'notes-textarea';
  notesTextarea.placeholder = 'Add notes for this section\u2026';
  notesTextarea.value = state.notesState[section.id] || '';

  notesTextarea.addEventListener('input', (function(sid) {
    return function(e) {
      state.notesState[sid] = e.target.value;
    };
  }(section.id)));

  notesWrapper.appendChild(notesLabel);
  notesWrapper.appendChild(notesTextarea);
  checklistEl.appendChild(notesWrapper);

  // ── NAVIGATION BUTTONS ────────────────────────────────────────────────────

  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var exportArea = document.getElementById('export-area');
  var isFirst = (index === 0);
  btnPrev.innerHTML = '\u2190 Previous Section';
  var isLast  = (index === state.sections.length - 1);

  // Use visibility:hidden (not display:none) so the Previous button
  // holds its space and keeps the Next button right-aligned.
  btnPrev.style.visibility = isFirst ? 'hidden' : 'visible';
  btnPrev.style.pointerEvents = isFirst ? 'none' : '';

  // Export area is permanently hidden — summary screen replaces it
  exportArea.classList.add('hidden');

  // Next button is always visible from section view; text + style changes on last section
  btnNext.classList.remove('hidden');
  if (isLast) {
    btnNext.textContent = 'View Summary \u2192';
    btnNext.className = 'btn btn-primary';
  } else {
    btnNext.textContent = 'Next Section \u2192';
    btnNext.className = 'btn btn-ghost';
  }

  // ── OUTLINE + PROGRESS ────────────────────────────────────────────────────
  updateOutline();
  updateProgress();

  // ── SCROLL RESTORATION ────────────────────────────────────────────────────
  if (window.innerWidth >= 900) {
    contentEl.scrollTop = 0;
  } else {
    var headerEl = document.getElementById('audit-header');
    var headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom + window.scrollY : 0;
    window.scrollTo({ top: headerBottom, behavior: 'smooth' });
  }

  // ── FOCUS MANAGEMENT ─────────────────────────────────────────────────────
  heading.focus();
}


// ─────────────────────────────────────────────────────────────────────────────
// Summary Screen Renderer
// ─────────────────────────────────────────────────────────────────────────────

function renderSummary() {
  state.onSummaryScreen = true;

  // Hide the three-column audit content; keep .audit-nav for the Prev button
  document.querySelector('.audit-layout').classList.add('hidden');

  // Show summary screen
  var summaryScreen = document.getElementById('summary-screen');
  summaryScreen.classList.remove('hidden');

  // Compute scores fresh — reflects any checkbox changes made after a prior visit
  var scores     = calculateScores();
  var unchecked  = getUncheckedItems();

  // ── OVERALL SCORE HERO ───────────────────────────────────────────────────

  var heroEl = document.getElementById('summary-score-hero');
  heroEl.innerHTML = '';

  var pct        = scores.overall.pct;
  var scoreColor = pct >= 80 ? '#38A169' : (pct >= 50 ? '#D69E2E' : '#E53E3E');

  var circle = document.createElement('div');
  circle.className = 'score-circle';
  circle.style.borderColor = scoreColor;
  circle.style.color       = scoreColor;

  var pctEl = document.createElement('div');
  pctEl.className   = 'score-circle-pct';
  pctEl.textContent = pct + '%';
  circle.appendChild(pctEl);
  heroEl.appendChild(circle);

  var heroLabel = document.createElement('p');
  heroLabel.className   = 'score-hero-label';
  heroLabel.textContent = 'Overall GEO Audit Score';
  heroEl.appendChild(heroLabel);

  var heroPoints = document.createElement('p');
  heroPoints.className   = 'score-hero-points';
  heroPoints.textContent = scores.overall.earned + ' / ' + scores.overall.possible + ' points';
  heroEl.appendChild(heroPoints);

  // ── PER-SECTION SCORE BREAKDOWN ──────────────────────────────────────────

  var sectionsEl = document.getElementById('summary-sections');
  // Remove any rows from a previous visit (keep the static <h2>)
  var oldRows = sectionsEl.querySelectorAll('.score-section-row');
  oldRows.forEach(function(el) { el.parentNode.removeChild(el); });

  scores.sections.forEach(function(s) {
    var sPct   = s.pct;
    var sColor = sPct >= 80 ? '#38A169' : (sPct >= 50 ? '#D69E2E' : '#E53E3E');

    var row = document.createElement('div');
    row.className = 'score-section-row';

    var nameEl = document.createElement('span');
    nameEl.className   = 'score-section-name';
    nameEl.textContent = s.title;

    var barWrap = document.createElement('div');
    barWrap.className = 'score-bar-wrap';

    var barTrack = document.createElement('div');
    barTrack.className = 'score-bar-track';

    var barFill = document.createElement('div');
    barFill.className            = 'score-bar-fill';
    barFill.style.width          = sPct + '%';
    barFill.style.backgroundColor = sColor;

    var barPct = document.createElement('span');
    barPct.className   = 'score-bar-pct';
    barPct.textContent = sPct + '%';

    barTrack.appendChild(barFill);
    barWrap.appendChild(barTrack);
    barWrap.appendChild(barPct);
    row.appendChild(nameEl);
    row.appendChild(barWrap);
    sectionsEl.appendChild(row);
  });

  // ── SECTION NOTES ────────────────────────────────────────────────────────

  var notesEl = document.getElementById('summary-notes');
  notesEl.innerHTML = '';

  var notesSections = state.sections.filter(function(section) {
    return (state.notesState[section.id] || '').trim().length > 0;
  });

  if (notesSections.length === 0) {
    notesEl.classList.add('hidden');
  } else {
    notesEl.classList.remove('hidden');

    var notesHeading = document.createElement('h2');
    notesHeading.className   = 'summary-section-title';
    notesHeading.textContent = 'Notes';
    notesEl.appendChild(notesHeading);

    notesSections.forEach(function(section) {
      var item = document.createElement('div');
      item.className = 'summary-notes-item';

      var sectionLabel = document.createElement('p');
      sectionLabel.className   = 'summary-notes-section';
      sectionLabel.textContent = section.title;

      var noteText = document.createElement('p');
      noteText.className   = 'summary-notes-text';
      noteText.textContent = state.notesState[section.id].trim();

      item.appendChild(sectionLabel);
      item.appendChild(noteText);
      notesEl.appendChild(item);
    });
  }

  // ── PRIORITIZED FIX LIST ─────────────────────────────────────────────────

  var TIER_LABELS = {
    "critical":     "DO FIRST",
    "important":    "DO NEXT",
    "nice-to-have": "POLISH"
  };

  var fixesEl = document.getElementById('summary-fixes');
  fixesEl.innerHTML = '';

  if (unchecked.length === 0) {
    var congrats = document.createElement('p');
    congrats.className   = 'summary-congrats';
    congrats.textContent = 'All checklist items passed. Great work!';
    fixesEl.appendChild(congrats);
  } else {
    var fixHeading = document.createElement('h2');
    fixHeading.className   = 'summary-fixes-heading';
    fixHeading.textContent = 'Your Action Plan';
    fixesEl.appendChild(fixHeading);

    var uniqueSections = [];
    unchecked.forEach(function(item) {
      if (uniqueSections.indexOf(item.sectionTitle) === -1) {
        uniqueSections.push(item.sectionTitle);
      }
    });

    var countEl = document.createElement('p');
    countEl.className   = 'summary-fixes-count';
    countEl.textContent = unchecked.length + ' item' + (unchecked.length === 1 ? '' : 's') + ' to address across ' + uniqueSections.length + ' section' + (uniqueSections.length === 1 ? '' : 's');
    fixesEl.appendChild(countEl);

    var runningCounter = 1;

    // Render each tier group that has items
    ['critical', 'important', 'nice-to-have'].forEach(function(tier) {
      var tierItems = unchecked.filter(function(x) { return x.tier === tier; });
      if (tierItems.length === 0) return;

      var meta = TIER_META[tier];

      var tierHeading = document.createElement('h3');
      tierHeading.className   = 'summary-tier-heading';
      tierHeading.style.color = meta.color;
      tierHeading.textContent = meta.icon + ' ' + TIER_LABELS[tier] + ' (' + meta.label + ')';
      fixesEl.appendChild(tierHeading);

      var ul = document.createElement('ul');
      ul.className = 'action-list';

      tierItems.forEach(function(item) {
        var li = document.createElement('li');
        li.className = 'action-item';

        var header = document.createElement('div');
        header.className = 'action-item-header';

        var numberEl = document.createElement('span');
        numberEl.className   = 'action-item-number';
        numberEl.textContent = runningCounter + '.';

        var titleEl = document.createElement('span');
        titleEl.className   = 'action-item-title';
        titleEl.textContent = item.actionTitle;

        header.appendChild(numberEl);
        header.appendChild(titleEl);

        var bodyEl = document.createElement('p');
        bodyEl.className   = 'action-item-body';
        bodyEl.textContent = item.actionBody;

        var sectionEl = document.createElement('span');
        sectionEl.className   = 'action-item-section';
        sectionEl.textContent = 'Section: ' + item.sectionTitle;

        li.appendChild(header);
        li.appendChild(bodyEl);
        li.appendChild(sectionEl);
        ul.appendChild(li);

        runningCounter++;
      });

      fixesEl.appendChild(ul);
    });
  }

  // ── PROGRESS BAR → 100% ──────────────────────────────────────────────────

  var fill  = document.getElementById('progress-bar-fill');
  var track = document.getElementById('progress-bar-track');
  fill.style.width = '100%';
  track.setAttribute('aria-valuenow', '100');

  // ── OUTLINE + NAV BUTTONS ────────────────────────────────────────────────

  updateOutline();

  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  btnPrev.innerHTML = '\u2190 Back to audit';
  btnPrev.style.visibility  = 'visible';
  btnPrev.style.pointerEvents = '';
  btnNext.classList.remove('hidden');
  btnNext.textContent = 'Export Audit Report';
  btnNext.className = 'btn btn-primary';

  // Scroll to top of summary
  if (window.innerWidth >= 900) {
    window.scrollTo(0, 0);
  } else {
    var headerEl     = document.getElementById('audit-header');
    var headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom + window.scrollY : 0;
    window.scrollTo({ top: headerBottom, behavior: 'smooth' });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Welcome Screen Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateWelcome() {
  var nameVal  = document.getElementById('page-name').value.trim();
  var urlVal   = document.getElementById('page-url').value.trim();
  var radios   = document.querySelectorAll('input[name="page-type"]');
  var selectedType = '';
  radios.forEach(function(r) { if (r.checked) selectedType = r.value; });
  var typeSelected = selectedType !== '';

  // If the PLP parent card is selected, also require a sub-type answer
  var plpValid = true;
  if (selectedType === 'plp-parent') {
    var subtypeRadios = document.querySelectorAll('input[name="plp-subtype"]');
    var subtypeSelected = false;
    subtypeRadios.forEach(function(r) { if (r.checked) subtypeSelected = true; });
    plpValid = subtypeSelected;
  }

  var isValid = nameVal.length > 0 && urlVal.length > 0 && typeSelected && plpValid;
  document.getElementById('begin-audit-btn').disabled = !isValid;
}


// ─────────────────────────────────────────────────────────────────────────────
// Transition to Audit Flow
// ─────────────────────────────────────────────────────────────────────────────

function beginAudit() {
  state.pageName = document.getElementById('page-name').value.trim();
  state.pageUrl  = document.getElementById('page-url').value.trim();

  var radios = document.querySelectorAll('input[name="page-type"]');
  radios.forEach(function(r) { if (r.checked) state.pageType = r.value; });

  // If the PLP parent card was selected, resolve the actual page type from the sub-type question
  if (state.pageType === 'plp-parent') {
    var subtypeRadios = document.querySelectorAll('input[name="plp-subtype"]');
    subtypeRadios.forEach(function(r) { if (r.checked) state.pageType = r.value; });
  }

  buildSections();
  initAuditState();

  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('audit-flow').classList.remove('hidden');

  document.getElementById('header-page-name').textContent = state.pageName;
  var urlEl = document.getElementById('header-page-url');
  urlEl.textContent = state.pageUrl;
  urlEl.href = state.pageUrl;

  renderOutline();
  state.currentSectionIndex = 0;
  renderSection(0);
  window.scrollTo(0, 0);
}


// ─────────────────────────────────────────────────────────────────────────────
// PDF Export — builds #pdf-view then calls window.print()
// ─────────────────────────────────────────────────────────────────────────────

function buildPdfView() {
  var view = document.getElementById('pdf-view');
  view.innerHTML = '';

  var scores        = calculateScores();
  var unchecked     = getUncheckedItems();
  var pct           = scores.overall.pct;
  var scoreColor    = pct >= 80 ? '#38A169' : (pct >= 50 ? '#D69E2E' : '#E53E3E');
  var dateStr       = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  var pageTypeLabel = state.pageType;
  AUDIT_CONTENT.pageTypes.forEach(function(pt) {
    if (pt.id === state.pageType) pageTypeLabel = pt.label;
  });

  // ── COVER ─────────────────────────────────────────────────────────────────

  var cover = document.createElement('div');
  cover.className = 'pdf-cover';

  var topRow = document.createElement('div');
  topRow.className = 'pdf-top-row';
  var logo = document.createElement('img');
  logo.src = 'assets/logo.svg';
  logo.alt = 'IfThen';
  logo.className = 'pdf-logo';
  var dateEl = document.createElement('span');
  dateEl.className   = 'pdf-date';
  dateEl.textContent = dateStr;
  topRow.appendChild(logo);
  topRow.appendChild(dateEl);
  cover.appendChild(topRow);

  var titleEl = document.createElement('h1');
  titleEl.className   = 'pdf-report-title';
  titleEl.textContent = 'OneXP GEO Audit Report';
  cover.appendChild(titleEl);

  var metaEl = document.createElement('div');
  metaEl.className = 'pdf-meta';
  [['Page', state.pageName], ['URL', state.pageUrl], ['Type', pageTypeLabel]].forEach(function(pair) {
    var row = document.createElement('div');
    row.className = 'pdf-meta-row';
    var lbl = document.createElement('span');
    lbl.className   = 'pdf-meta-label';
    lbl.textContent = pair[0];
    var val = document.createElement('span');
    val.className   = 'pdf-meta-value';
    val.textContent = pair[1];
    row.appendChild(lbl);
    row.appendChild(val);
    metaEl.appendChild(row);
  });
  cover.appendChild(metaEl);
  view.appendChild(cover);

  // ── SCORE HERO ────────────────────────────────────────────────────────────

  var heroWrap = document.createElement('div');
  heroWrap.className = 'summary-score-hero pdf-score-hero';

  var circle = document.createElement('div');
  circle.className        = 'score-circle';
  circle.style.borderColor = scoreColor;
  circle.style.color       = scoreColor;
  var circlePct = document.createElement('div');
  circlePct.className   = 'score-circle-pct';
  circlePct.textContent = pct + '%';
  circle.appendChild(circlePct);
  heroWrap.appendChild(circle);

  var heroLabel = document.createElement('p');
  heroLabel.className   = 'score-hero-label';
  heroLabel.textContent = 'Overall GEO Audit Score';
  heroWrap.appendChild(heroLabel);

  var heroPoints = document.createElement('p');
  heroPoints.className   = 'score-hero-points';
  heroPoints.textContent = scores.overall.earned + ' / ' + scores.overall.possible + ' points';
  heroWrap.appendChild(heroPoints);

  view.appendChild(heroWrap);

  // ── SCORE BREAKDOWN ───────────────────────────────────────────────────────

  var breakdown = document.createElement('div');
  breakdown.className = 'summary-sections pdf-breakdown';

  var breakdownTitle = document.createElement('h2');
  breakdownTitle.className   = 'summary-section-title';
  breakdownTitle.textContent = 'Score Breakdown';
  breakdown.appendChild(breakdownTitle);

  scores.sections.forEach(function(s) {
    var sPct   = s.pct;
    var sColor = sPct >= 80 ? '#38A169' : (sPct >= 50 ? '#D69E2E' : '#E53E3E');

    var row = document.createElement('div');
    row.className = 'score-section-row';

    var nameEl = document.createElement('span');
    nameEl.className   = 'score-section-name';
    nameEl.textContent = s.title;

    var barWrap = document.createElement('div');
    barWrap.className = 'score-bar-wrap';

    var barTrack = document.createElement('div');
    barTrack.className = 'score-bar-track';

    var barFill = document.createElement('div');
    barFill.className             = 'score-bar-fill';
    barFill.style.width           = sPct + '%';
    barFill.style.backgroundColor = sColor;

    var barPctEl = document.createElement('span');
    barPctEl.className   = 'score-bar-pct';
    barPctEl.textContent = sPct + '%';

    barTrack.appendChild(barFill);
    barWrap.appendChild(barTrack);
    barWrap.appendChild(barPctEl);
    row.appendChild(nameEl);
    row.appendChild(barWrap);
    breakdown.appendChild(row);
  });

  view.appendChild(breakdown);

  // ── SECTION NOTES ─────────────────────────────────────────────────────────
  // Mirrors the summary screen's Notes block; omitted entirely when no notes.

  var pdfNotesSections = state.sections.filter(function(section) {
    return (state.notesState[section.id] || '').trim().length > 0;
  });

  if (pdfNotesSections.length > 0) {
    var notesGroup = document.createElement('div');
    notesGroup.className = 'summary-notes pdf-notes-group';

    var notesGroupHeading = document.createElement('h2');
    notesGroupHeading.className   = 'summary-section-title';
    notesGroupHeading.textContent = 'Notes';
    notesGroup.appendChild(notesGroupHeading);

    pdfNotesSections.forEach(function(section) {
      var item = document.createElement('div');
      item.className = 'summary-notes-item';

      var sectionLabel = document.createElement('p');
      sectionLabel.className   = 'summary-notes-section';
      sectionLabel.textContent = section.title;

      var noteText = document.createElement('p');
      noteText.className   = 'summary-notes-text';
      noteText.textContent = state.notesState[section.id].trim();

      item.appendChild(sectionLabel);
      item.appendChild(noteText);
      notesGroup.appendChild(item);
    });

    view.appendChild(notesGroup);
  }

  // ── ACTION PLAN ────────────────────────────────────────────────────────────

  var TIER_LABELS_PDF = {
    "critical":     "DO FIRST",
    "important":    "DO NEXT",
    "nice-to-have": "POLISH"
  };

  var fixesEl = document.createElement('div');
  fixesEl.className = 'pdf-fixes';

  if (unchecked.length === 0) {
    var congrats = document.createElement('p');
    congrats.className   = 'summary-congrats';
    congrats.textContent = 'All checklist items passed. Great work!';
    fixesEl.appendChild(congrats);
  } else {
    var fixHeading = document.createElement('h2');
    fixHeading.className   = 'summary-fixes-heading';
    fixHeading.textContent = 'Action Plan';
    fixesEl.appendChild(fixHeading);

    var pdfUniqueSections = [];
    unchecked.forEach(function(item) {
      if (pdfUniqueSections.indexOf(item.sectionTitle) === -1) {
        pdfUniqueSections.push(item.sectionTitle);
      }
    });

    var countEl = document.createElement('p');
    countEl.className   = 'summary-fixes-count';
    countEl.textContent = unchecked.length + ' item' + (unchecked.length === 1 ? '' : 's') + ' to address across ' + pdfUniqueSections.length + ' section' + (pdfUniqueSections.length === 1 ? '' : 's');
    fixesEl.appendChild(countEl);

    var pdfRunningCounter = 1;

    ['critical', 'important', 'nice-to-have'].forEach(function(tier) {
      var tierItems = unchecked.filter(function(x) { return x.tier === tier; });
      if (tierItems.length === 0) return;
      var meta = TIER_META[tier];

      var tierHeading = document.createElement('h3');
      tierHeading.className   = 'summary-tier-heading';
      tierHeading.style.color = meta.color;
      tierHeading.textContent = meta.icon + ' ' + TIER_LABELS_PDF[tier] + ' (' + meta.label + ')';
      fixesEl.appendChild(tierHeading);

      var ul = document.createElement('ul');
      ul.className = 'action-list';

      tierItems.forEach(function(item) {
        var li = document.createElement('li');
        li.className = 'action-item';

        var header = document.createElement('div');
        header.className = 'action-item-header';

        var numberEl = document.createElement('span');
        numberEl.className   = 'action-item-number';
        numberEl.textContent = pdfRunningCounter + '.';

        var titleEl = document.createElement('span');
        titleEl.className   = 'action-item-title';
        titleEl.textContent = stripHtml(item.actionTitle);

        header.appendChild(numberEl);
        header.appendChild(titleEl);

        var bodyEl = document.createElement('p');
        bodyEl.className   = 'action-item-body';
        bodyEl.textContent = stripHtml(item.actionBody);

        var sectionEl = document.createElement('span');
        sectionEl.className   = 'action-item-section';
        sectionEl.textContent = 'Section: ' + item.sectionTitle;

        li.appendChild(header);
        li.appendChild(bodyEl);
        li.appendChild(sectionEl);
        ul.appendChild(li);

        pdfRunningCounter++;
      });

      fixesEl.appendChild(ul);
    });
  }

  view.appendChild(fixesEl);

  // ── SECTION-BY-SECTION RESULTS ────────────────────────────────────────────

  var resultsHeading = document.createElement('h2');
  resultsHeading.className   = 'pdf-results-heading';
  resultsHeading.textContent = 'Full Audit Results';
  view.appendChild(resultsHeading);

  var sectionScoreMap = {};
  scores.sections.forEach(function(s) { sectionScoreMap[s.id] = s; });

  state.sections.forEach(function(section) {
    var block = document.createElement('div');
    block.className = 'pdf-section-block';

    // Section header: title + score percentage
    var sHeaderEl = document.createElement('div');
    sHeaderEl.className = 'pdf-section-header';

    var sTitleEl = document.createElement('h3');
    sTitleEl.className   = 'pdf-section-title';
    sTitleEl.textContent = section.title;
    sHeaderEl.appendChild(sTitleEl);

    var sScore = sectionScoreMap[section.id];
    if (sScore) {
      var sColor = sScore.pct >= 80 ? '#38A169' : (sScore.pct >= 50 ? '#D69E2E' : '#E53E3E');
      var sPctEl = document.createElement('span');
      sPctEl.className   = 'pdf-section-pct';
      sPctEl.style.color = sColor;
      sPctEl.textContent = sScore.pct + '%';
      sHeaderEl.appendChild(sPctEl);
    }
    block.appendChild(sHeaderEl);

    // Checklist items
    if (section.checklist.length > 0) {
      var ul = document.createElement('ul');
      ul.className = 'pdf-checklist';

      section.checklist.forEach(function(item, i) {
        var checked = state.checkboxState[section.id][i];
        var li = document.createElement('li');
        li.className = 'pdf-checklist-item' + (checked ? ' pdf-item-checked' : ' pdf-item-unchecked');

        var indicator = document.createElement('span');
        indicator.className   = 'pdf-item-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.textContent = checked ? '\u2713' : '\u25cb';
        indicator.style.color = checked ? '#38A169' : TIER_META[item.tier].color;

        var textEl = document.createElement('span');
        textEl.className   = 'pdf-item-text';
        textEl.textContent = stripHtml(item.text);

        var badge = document.createElement('span');
        badge.className        = 'pdf-tier-badge';
        badge.style.color       = TIER_META[item.tier].color;
        badge.style.borderColor = TIER_META[item.tier].color;
        badge.textContent       = TIER_META[item.tier].label;

        li.appendChild(indicator);
        li.appendChild(textEl);
        li.appendChild(badge);
        ul.appendChild(li);
      });

      block.appendChild(ul);
    } else {
      var infoEl = document.createElement('p');
      infoEl.className   = 'pdf-info-note';
      infoEl.textContent = 'Informational section \u2014 no checklist items.';
      block.appendChild(infoEl);
    }

    // Notes — only if the user entered something
    var notesText = (state.notesState[section.id] || '').trim();
    if (notesText) {
      var notesBlock = document.createElement('div');
      notesBlock.className = 'pdf-notes';

      var notesLabelEl = document.createElement('span');
      notesLabelEl.className   = 'pdf-notes-label';
      notesLabelEl.textContent = 'Notes';

      var notesTextEl = document.createElement('p');
      notesTextEl.className   = 'pdf-notes-text';
      notesTextEl.textContent = notesText;

      notesBlock.appendChild(notesLabelEl);
      notesBlock.appendChild(notesTextEl);
      block.appendChild(notesBlock);
    }

    view.appendChild(block);
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────

  var footer = document.createElement('div');
  footer.className   = 'pdf-footer';
  footer.textContent = 'Generated by the IfThen OneXP GEO Audit Tool';
  view.appendChild(footer);
}


function printReport() {
  buildPdfView();
  window.print();
}


// ─────────────────────────────────────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────────────────────────────────────

function init() {
  // Render page type option cards.
  // plp-categories and plp-skus are grouped behind a single "Product Landing Page"
  // parent card — selecting it reveals an animated follow-up sub-type question.
  var optionsContainer = document.getElementById('page-type-options');
  var plpFollowup     = document.getElementById('plp-subtype-question');
  var plpParentRendered = false;

  AUDIT_CONTENT.pageTypes.forEach(function(pageType) {

    // ── PLP grouping: render one parent card for both sub-types ──────────────
    if (pageType.id === 'plp-categories' || pageType.id === 'plp-skus') {
      if (!plpParentRendered) {
        plpParentRendered = true;

        var plpLabel = document.createElement('label');
        plpLabel.className = 'page-type-card';
        plpLabel.setAttribute('data-type-id', 'plp-parent');

        var plpInput = document.createElement('input');
        plpInput.type = 'radio';
        plpInput.name = 'page-type';
        plpInput.value = 'plp-parent';
        plpInput.className = 'sr-only';

        var plpSpan = document.createElement('span');
        plpSpan.className = 'page-type-label';
        plpSpan.textContent = 'Product Landing Page';

        plpLabel.appendChild(plpInput);
        plpLabel.appendChild(plpSpan);
        optionsContainer.appendChild(plpLabel);

        plpInput.addEventListener('change', function() {
          document.querySelectorAll('.page-type-card').forEach(function(card) {
            card.classList.remove('active');
          });
          plpLabel.classList.add('active');
          // Animate the sub-type question into view
          plpFollowup.classList.add('visible');
          plpFollowup.setAttribute('aria-hidden', 'false');
          validateWelcome();
        });
      }
      return; // Do not render individual plp-categories / plp-skus cards
    }

    // ── All other page types ──────────────────────────────────────────────────
    var label = document.createElement('label');
    label.className = 'page-type-card';
    label.setAttribute('data-type-id', pageType.id);

    var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'page-type';
    input.value = pageType.id;
    input.className = 'sr-only';

    var span = document.createElement('span');
    span.className = 'page-type-label';
    span.textContent = pageType.label;

    label.appendChild(input);
    label.appendChild(span);
    optionsContainer.appendChild(label);

    input.addEventListener('change', function() {
      document.querySelectorAll('.page-type-card').forEach(function(card) {
        card.classList.remove('active');
      });
      label.classList.add('active');
      // Hide the PLP sub-type question and clear its selection
      plpFollowup.classList.remove('visible');
      plpFollowup.setAttribute('aria-hidden', 'true');
      document.querySelectorAll('input[name="plp-subtype"]').forEach(function(r) {
        r.checked = false;
      });
      document.querySelectorAll('.plp-subtype-card').forEach(function(card) {
        card.classList.remove('active');
      });
      validateWelcome();
    });
  });

  // ── Render PLP sub-type option cards inside the follow-up question ─────────
  var subtypeContainer = document.getElementById('plp-subtype-options');
  var plpSubtypes = [
    {
      id: 'plp-categories',
      htmlLabel: 'My PLP shows a list of product categories displayed in teasers. (Example: <a href="https://www.coca-cola.com/us/en/brands/coca-cola/products" target="_blank" rel="noopener" class="plp-example-link" onclick="event.stopPropagation()">Coca-Cola</a>)'
    },
    {
      id: 'plp-skus',
      htmlLabel: 'My PLP shows a list of individual product SKUs displayed in product cards. (Example: <a href="https://www.coca-cola.com/us/en/brands/fanta/products" target="_blank" rel="noopener" class="plp-example-link" onclick="event.stopPropagation()">Fanta</a>)'
    }
  ];

  plpSubtypes.forEach(function(subtype) {
    var label = document.createElement('label');
    label.className = 'page-type-card plp-subtype-card';
    label.setAttribute('data-type-id', subtype.id);

    var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'plp-subtype';
    input.value = subtype.id;
    input.className = 'sr-only';

    var span = document.createElement('span');
    span.className = 'page-type-label';
    span.innerHTML = subtype.htmlLabel;

    label.appendChild(input);
    label.appendChild(span);
    subtypeContainer.appendChild(label);

    input.addEventListener('change', function() {
      document.querySelectorAll('.plp-subtype-card').forEach(function(card) {
        card.classList.remove('active');
      });
      label.classList.add('active');
      validateWelcome();
    });
  });

  document.getElementById('page-name').addEventListener('input', validateWelcome);
  document.getElementById('page-url').addEventListener('input', validateWelcome);

  document.getElementById('begin-audit-btn').addEventListener('click', function() {
    beginAudit();
  });

  document.getElementById('btn-next').addEventListener('click', function() {
    if (state.onSummaryScreen) { printReport(); return; }
    if (state.currentSectionIndex === state.sections.length - 1) {
      renderSummary();
    } else {
      renderSection(state.currentSectionIndex + 1);
    }
  });

  document.getElementById('btn-prev').addEventListener('click', function() {
    if (state.onSummaryScreen) {
      // Navigate back from summary to the last section
      state.onSummaryScreen = false;
      document.querySelector('.audit-layout').classList.remove('hidden');
      document.getElementById('summary-screen').classList.add('hidden');
      renderSection(state.sections.length - 1);
    } else if (state.currentSectionIndex > 0) {
      renderSection(state.currentSectionIndex - 1);
    }
  });

  document.getElementById('btn-export').addEventListener('click', function() {
    printReport();
  });

  document.getElementById('btn-summary-export').addEventListener('click', function() {
    printReport();
  });
}

document.addEventListener('DOMContentLoaded', init);
