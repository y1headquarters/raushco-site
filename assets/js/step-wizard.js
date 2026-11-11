/* Shared step-wizard mechanics: step state/navigation, step-indicator
   rendering, and the skeleton-to-real-text live-preview fill helper.
   Used by website/rent-receipt/index.html and website/invoice/index.html.
   No build step on this site, so this is a small plain global: window.SW. */
(function (global) {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Returns a skeleton placeholder span when value is empty, or a filled-in
  // span with the real text otherwise. widthPx controls the skeleton width.
  function skelOr(value, widthPx) {
    if (value === null || value === undefined || String(value).trim() === '') {
      return '<span class="sw-skel" style="width:' + (widthPx || 70) + 'px;">&nbsp;</span>';
    }
    return '<span class="sw-fill">' + escapeHtml(String(value)) + '</span>';
  }

  // Builds a numbered-dot step indicator into `el` for the given step list
  // (each {title}) and the current zero-based index.
  function renderIndicator(el, steps, currentIndex) {
    var html = '';
    steps.forEach(function (step, i) {
      var state = i < currentIndex ? 'done' : (i === currentIndex ? 'current' : '');
      html += '<div class="sw-step ' + state + '">' +
        '<span class="sw-dot"><span class="sw-num">' + (i + 1) + '</span>' +
        '<svg class="sw-check" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span>' +
        '<span class="sw-label">' + escapeHtml(step.title) + '</span>' +
        '</div>';
      if (i < steps.length - 1) html += '<div class="sw-track"></div>';
    });
    el.innerHTML = html;
  }

  // Creates a wizard controller.
  // opts.panels: array of step panel elements, in order.
  // opts.steps: array of { title, validate: fn()->boolean (optional) }.
  // opts.indicatorEl, opts.backBtn, opts.nextBtn: elements.
  // opts.onChange: fn(stepIndex) called after every render (e.g. to refresh a live preview).
  // opts.onSubmit: fn() called instead of "next" on the last step's next button, if provided.
  function createWizard(opts) {
    var steps = opts.steps;
    var panels = opts.panels;
    var current = 0;

    function isValid(i) {
      var step = steps[i];
      return !step.validate || !!step.validate();
    }

    function render() {
      panels.forEach(function (p, i) { p.classList.toggle('active', i === current); });
      renderIndicator(opts.indicatorEl, steps, current);
      opts.backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
      var onLast = current === steps.length - 1;
      opts.nextBtn.textContent = onLast ? (opts.submitLabel || 'Download PDF') : (opts.nextLabel || 'Next');
      opts.nextBtn.disabled = !isValid(current);
      if (opts.onChange) opts.onChange(current);
    }

    opts.backBtn.addEventListener('click', function () {
      if (current > 0) { current--; render(); }
    });
    opts.nextBtn.addEventListener('click', function () {
      if (!isValid(current)) return;
      if (current === steps.length - 1) {
        if (opts.onSubmit) opts.onSubmit();
        return;
      }
      current++;
      render();
    });

    return {
      render: render,
      refreshGating: function () { opts.nextBtn.disabled = !isValid(current); },
      goTo: function (i) { current = Math.max(0, Math.min(steps.length - 1, i)); render(); },
      current: function () { return current; }
    };
  }

  global.SW = {
    escapeHtml: escapeHtml,
    skelOr: skelOr,
    renderIndicator: renderIndicator,
    createWizard: createWizard
  };
})(window);
