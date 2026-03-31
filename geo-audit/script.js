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
  visitedSections: new Set()  // Set of section IDs the user has reached
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
  state.sections = part1.concat([part2Section, part3]);
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
    var index = parseInt(btn.getAttribute('data-index'), 10);
    var section = state.sections[index];
    var checkSpan = btn.querySelector('.outline-check');

    btn.classList.toggle('active', index === state.currentSectionIndex);

    if (state.visitedSections.has(section.id)) {
      checkSpan.textContent = '\u25cf';
      checkSpan.classList.add('visited');
    } else {
      checkSpan.textContent = '\u25cb';
      checkSpan.classList.remove('visited');
    }

    if (index === state.currentSectionIndex) {
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

    section.checklist.forEach(function(itemText, itemIndex) {
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
      label.innerHTML = sanitizeInline(itemText);

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
  var isLast  = (index === state.sections.length - 1);

  // Use visibility:hidden (not display:none) so the Previous button
  // holds its space and keeps the Next button right-aligned.
  btnPrev.style.visibility = isFirst ? 'hidden' : 'visible';
  btnPrev.style.pointerEvents = isFirst ? 'none' : '';

  if (isLast) {
    btnNext.classList.add('hidden');
    exportArea.classList.remove('hidden');
  } else {
    btnNext.classList.remove('hidden');
    exportArea.classList.add('hidden');
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
// Welcome Screen Validation
// ─────────────────────────────────────────────────────────────────────────────

function validateWelcome() {
  var nameVal  = document.getElementById('page-name').value.trim();
  var urlVal   = document.getElementById('page-url').value.trim();
  var radios   = document.querySelectorAll('input[name="page-type"]');
  var typeSelected = false;
  radios.forEach(function(r) { if (r.checked) typeSelected = true; });
  var isValid = nameVal.length > 0 && urlVal.length > 0 && typeSelected;
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
// PDF Export
// ─────────────────────────────────────────────────────────────────────────────

function exportPDF() {
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  var margin     = 20;
  var pageW      = 210;
  var printW     = pageW - margin * 2;   // 170mm
  var bottomEdge = 297 - 20;
  var x          = margin;
  var y          = margin;
  var lineH5     = 5;
  var lineH6     = 6;

  function checkPageBreak(needed) {
    if (y + needed > bottomEdge) { doc.addPage(); y = margin; }
  }

  function drawHRule() {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + printW, y);
    y += 1;
  }

  // ── HEADER ────────────────────────────────────────────────────────────────

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('OneXP GEO Audit Report', pageW / 2, y, { align: 'center' });
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text('IfThen', pageW / 2, y, { align: 'center' });
  y += 5;
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageW / 2, y, { align: 'center' });
  y += 10;

  drawHRule();
  y += 8;

  // ── PAGE DETAILS ──────────────────────────────────────────────────────────

  doc.setFontSize(10);
  doc.setTextColor(0);

  doc.setFont('helvetica', 'bold');
  doc.text('Page Name:', x, y);
  doc.setFont('helvetica', 'normal');
  var pageNameLines = doc.splitTextToSize(state.pageName, printW - 32);
  doc.text(pageNameLines, x + 32, y);
  y += (pageNameLines.length * lineH5) + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('Page URL:', x, y);
  doc.setFont('helvetica', 'normal');
  var pageUrlLines = doc.splitTextToSize(state.pageUrl, printW - 26);
  doc.text(pageUrlLines, x + 26, y);
  y += (pageUrlLines.length * lineH5) + 3;

  var pageTypeLabel = state.pageType;
  AUDIT_CONTENT.pageTypes.forEach(function(pt) {
    if (pt.id === state.pageType) pageTypeLabel = pt.label;
  });
  doc.setFont('helvetica', 'bold');
  doc.text('Page Type:', x, y);
  doc.setFont('helvetica', 'normal');
  doc.text(pageTypeLabel, x + 28, y);
  y += lineH5 + 8;

  drawHRule();
  y += 8;

  // ── AUDIT RESULTS — LOOP THROUGH SECTIONS ────────────────────────────────

  state.sections.forEach(function(section) {

    checkPageBreak(16);

    // Section heading — title only, no part label prefix
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0);
    var titleLines = doc.splitTextToSize(section.title, printW);
    checkPageBreak(titleLines.length * lineH6 + 4);
    doc.text(titleLines, x, y);
    y += (titleLines.length * lineH6) + 4;

    doc.setFontSize(10);

    if (section.checklist.length > 0) {
      section.checklist.forEach(function(itemText, i) {
        var checked = state.checkboxState[section.id][i];
        var prefix  = checked ? '\u2713 ' : '\u2717 ';
        // Strip HTML tags from checklist item text for plain-text PDF output
        var plainText = stripHtml(itemText);

        checkPageBreak(lineH5 * 2 + 2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(checked ? 0 : 120);
        doc.text(prefix, x, y);

        doc.setFont('helvetica', 'normal');
        var itemLines = doc.splitTextToSize(plainText, printW - 10);
        checkPageBreak(itemLines.length * lineH5 + 2);
        doc.text(itemLines, x + 7, y);
        y += (itemLines.length * lineH5) + 2;
      });
    } else {
      // Part 3 — no checklist, print a brief note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100);
      var infoText = 'Informational section \u2014 no checklist items.';
      var infoLines = doc.splitTextToSize(infoText, printW);
      checkPageBreak(infoLines.length * lineH5 + 2);
      doc.text(infoLines, x, y);
      y += (infoLines.length * lineH5) + 2;
    }

    // Notes — print only if the user entered something
    var notesText = (state.notesState[section.id] || '').trim();
    if (notesText) {
      y += 2;
      checkPageBreak(lineH5 * 2 + 4);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text('Notes:', x, y);
      y += lineH5;

      doc.setFont('helvetica', 'normal');
      var notesLines = doc.splitTextToSize(notesText, printW);
      checkPageBreak(notesLines.length * lineH5 + 2);
      doc.text(notesLines, x, y);
      y += (notesLines.length * lineH5) + 2;
    }

    y += 8; // gap between sections
  });

  // ── FOOTERS ───────────────────────────────────────────────────────────────

  var pageCount = doc.internal.getNumberOfPages();
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by the IfThen OneXP GEO Audit Tool', 105, 290, { align: 'center' });
  }

  var safeName = state.pageName.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '-').slice(0, 50);
  doc.save('OneXP-GEO-Audit-' + (safeName || 'Report') + '.pdf');
}


// ─────────────────────────────────────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────────────────────────────────────

function init() {
  // Render page type option cards
  var optionsContainer = document.getElementById('page-type-options');
  AUDIT_CONTENT.pageTypes.forEach(function(pageType) {
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
      validateWelcome();
    });
  });

  document.getElementById('page-name').addEventListener('input', validateWelcome);
  document.getElementById('page-url').addEventListener('input', validateWelcome);

  document.getElementById('begin-audit-btn').addEventListener('click', function() {
    beginAudit();
  });

  document.getElementById('btn-next').addEventListener('click', function() {
    if (state.currentSectionIndex < state.sections.length - 1) {
      renderSection(state.currentSectionIndex + 1);
    }
  });

  document.getElementById('btn-prev').addEventListener('click', function() {
    if (state.currentSectionIndex > 0) {
      renderSection(state.currentSectionIndex - 1);
    }
  });

  document.getElementById('btn-export').addEventListener('click', function() {
    exportPDF();
  });
}

document.addEventListener('DOMContentLoaded', init);
