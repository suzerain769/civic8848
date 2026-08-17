/* =============================================================================
   CivicConnect — vanilla JS
   Student project prototype. No backend, no frameworks, no alert()/confirm().
   ============================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "civicconnect_complaints";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- helpers */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
      ", " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  function scrollToId(id, focusEl) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (focusEl) {
      window.setTimeout(function () { focusEl.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
    }
  }

  /* ------------------------------------------------------------------ toast */
  var TOAST_ICON = {
    success: "fa-circle-check",
    error: "fa-circle-exclamation",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };
  function toast(message, type, timeout) {
    type = type || "info";
    var stack = document.getElementById(type === "error" || type === "warning" ? "toast-assertive" : "toast-polite");
    if (!stack) return;
    var el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.innerHTML =
      '<i class="fa-solid ' + TOAST_ICON[type] + ' toast-icon" aria-hidden="true"></i>' +
      '<span class="toast-msg">' + esc(message) + "</span>" +
      '<button class="toast-close" type="button" aria-label="Dismiss notification"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
    $(".toast-close", el).addEventListener("click", function () { remove(); });
    stack.appendChild(el);
    var timer = window.setTimeout(remove, timeout || 5000);
    function remove() {
      window.clearTimeout(timer);
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  }

  /* ------------------------------------------------------------------ store */
  function storageAvailable() {
    try {
      var k = "__cc_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }
  var HAS_STORAGE = storageAvailable();

  function readComplaints() {
    if (!HAS_STORAGE) return [];
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      try { window.localStorage.setItem(STORAGE_KEY, "[]"); } catch (e) { /* ignore */ }
      return [];
    }
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("bad shape");
      return parsed;
    } catch (e) {
      try { window.localStorage.setItem(STORAGE_KEY, "[]"); } catch (e2) { /* ignore */ }
      toast("Saved demo data could not be read, so it has been reset.", "warning");
      return [];
    }
  }
  function writeComplaints(list) {
    if (!HAS_STORAGE) return false;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  var DEMO_COMPLAINTS = [
    {
      id: "CC-2026-10001", category: "Road & Transportation", location: "Main Road",
      status: "In Progress", date: "2026-07-28T10:15:00",
      description: "Large potholes near the main road junction are making it unsafe for two-wheelers during rain.",
      demo: true
    },
    {
      id: "CC-2026-10002", category: "Water Supply", location: "Ward 5",
      status: "Pending", date: "2026-08-04T08:40:00",
      description: "Irregular water supply for the past week; taps run dry after 7 AM in most households.",
      demo: true
    },
    {
      id: "CC-2026-10003", category: "Streetlight", location: "Community Park",
      status: "Resolved", date: "2026-06-19T18:05:00",
      description: "Streetlights around the community park were not switching on after sunset.",
      demo: true
    }
  ];

  function allComplaints() { return DEMO_COMPLAINTS.concat(readComplaints()); }

  function generateId() {
    var existing = {};
    allComplaints().forEach(function (c) { existing[c.id] = true; });
    var id;
    do {
      id = "CC-2026-" + String(Math.floor(10000 + Math.random() * 90000));
    } while (existing[id]);
    return id;
  }

  /* ------------------------------------------------------------------ modal */
  var modalRoot = $("#modal-root");
  var modalTitle = $("#modal-title");
  var modalBody = $("#modal-body");
  var modalFoot = $("#modal-foot");
  var lastTrigger = null;
  var inertTargets = [];

  function openModal(opts) {
    lastTrigger = opts.trigger || document.activeElement;
    modalTitle.textContent = opts.title;
    modalBody.innerHTML = opts.bodyHTML;
    modalFoot.innerHTML = "";
    (opts.buttons || []).forEach(function (b) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (b.variant || "btn-ghost");
      btn.innerHTML = b.html || esc(b.label);
      btn.addEventListener("click", function () { b.onClick && b.onClick(); });
      modalFoot.appendChild(btn);
    });
    modalRoot.hidden = false;
    document.body.classList.add("modal-open");
    inertTargets = [$("header.navbar"), $("#main"), $("footer.footer")].filter(Boolean);
    inertTargets.forEach(function (el) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); });
    var focusable = getFocusable();
    (focusable[0] || $("#modal")).focus({ preventScroll: true });
  }

  function getFocusable() {
    return $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', $("#modal"))
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function closeModal() {
    if (modalRoot.hidden) return;
    modalRoot.hidden = true;
    document.body.classList.remove("modal-open");
    inertTargets.forEach(function (el) { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); });
    inertTargets = [];
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
  }

  $("#modal").setAttribute("tabindex", "-1");
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (modalRoot.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key === "Tab") {
      var f = getFocusable();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $("#modal"))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* --------------------------------------------------------------- nav menu */
  var navbar = $("#navbar");
  var hamburger = $("#hamburger");
  var mobileMenu = $("#mobile-menu");

  function setMenu(open) {
    mobileMenu.hidden = !open;
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    hamburger.innerHTML = '<i class="fa-solid ' + (open ? "fa-xmark" : "fa-bars") + '" aria-hidden="true"></i>';
  }
  hamburger.addEventListener("click", function () {
    setMenu(hamburger.getAttribute("aria-expanded") !== "true");
  });
  $$(".nav-link, .btn", mobileMenu).forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("click", function (e) {
    if (mobileMenu.hidden) return;
    if (!navbar.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !mobileMenu.hidden) {
      setMenu(false);
      hamburger.focus();
    }
  });
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  /* Active nav link */
  var navLinks = $$('.nav-link[href^="#"]');
  var sections = ["home", "services", "complaints", "track-status", "announcements", "about", "contact"]
    .map(function (id) { return document.getElementById(id); }).filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, .25, .5, 1] });
    sections.forEach(function (s) { navObserver.observe(s); });
  }
  setActive("home");

  /* ------------------------------------------------------------- services */
  var SERVICES = [
    { key: "road", icon: "fa-road", tone: "qi-blue", name: "Road Maintenance", category: "Road & Transportation",
      desc: "Potholes, damaged footpaths, broken road signs and unsafe crossings.",
      info: "Road maintenance covers surface repairs, pothole filling, footpath restoration and road signage. When reporting, include the nearest landmark and whether the damage blocks traffic — urgency ratings in real municipal systems usually depend on safety risk." },
    { key: "water", icon: "fa-droplet", tone: "qi-cyan", name: "Water Supply", category: "Water Supply",
      desc: "Irregular supply, leaking pipelines, low pressure or water quality issues.",
      info: "Water supply issues include pipeline leakage, contamination, and interrupted distribution. Note the time of day supply fails and whether neighbours are affected — that helps distinguish a household plumbing fault from a mains-level problem." },
    { key: "waste", icon: "fa-trash-can", tone: "qi-green", name: "Waste Management", category: "Waste Management",
      desc: "Missed garbage collection, overflowing bins and illegal dumping.",
      info: "Waste management covers household collection schedules, public bin servicing and illegal dumping. Reports that mention how long waste has been uncollected and whether it is organic help authorities prioritise health risks." },
    { key: "electricity", icon: "fa-lightbulb", tone: "qi-orange", name: "Electricity & Streetlights", category: "Electricity",
      desc: "Power outages, exposed wiring and streetlights that stay dark.",
      info: "This category covers outages, unsafe hanging or exposed wiring, and non-functional streetlights. Exposed wiring is always treated as a safety emergency; mention pole numbers where visible so crews can find the fault quickly." },
    { key: "safety", icon: "fa-shield-halved", tone: "qi-blue", name: "Public Safety", category: "Public Safety",
      desc: "Unsafe structures, missing barriers and poorly lit public spaces.",
      info: "Public safety reports cover hazards in shared spaces: unstable structures, open manholes, missing guardrails and unlit areas. This prototype does not replace emergency services — real emergencies should always go to official emergency numbers." },
    { key: "sanitation", icon: "fa-broom", tone: "qi-green", name: "Sanitation", category: "Sanitation",
      desc: "Public toilet upkeep, street cleaning and hygiene concerns.",
      info: "Sanitation covers street sweeping, public toilet maintenance and hygiene in markets and transport hubs. Photos and precise locations make these reports considerably easier for cleaning crews to act on." },
    { key: "drainage", icon: "fa-water", tone: "qi-cyan", name: "Drainage & Flooding", category: "Drainage",
      desc: "Blocked drains, waterlogging and monsoon flooding hotspots.",
      info: "Drainage reports cover blocked or broken drains, waterlogging and recurring flood points. Mentioning whether the problem repeats every monsoon helps authorities separate one-off blockages from design-level drainage failures." },
    { key: "infrastructure", icon: "fa-building-columns", tone: "qi-orange", name: "Public Infrastructure", category: "Other",
      desc: "Parks, community buildings, bus stops and other shared facilities.",
      info: "Public infrastructure includes parks, bus stops, community halls and other shared facilities. Since these span several departments, this prototype files them under the general \u201cOther\u201d category for routing." }
  ];

  var servicesGrid = $("#services-grid");
  SERVICES.forEach(function (s) {
    var card = document.createElement("article");
    card.className = "card service-card reveal";
    card.id = "service-" + s.key;
    card.innerHTML =
      '<span class="qi ' + s.tone + '" aria-hidden="true"><i class="fa-solid ' + s.icon + '"></i></span>' +
      "<h3>" + esc(s.name) + "</h3>" +
      "<p>" + esc(s.desc) + "</p>" +
      '<div class="service-actions">' +
        '<button class="btn btn-primary btn-sm" type="button" data-report="' + esc(s.category) + '">' +
          '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Report Issue' +
          '<span class="sr-only"> about ' + esc(s.name) + "</span></button>" +
        '<button class="btn btn-ghost btn-sm" type="button" data-learn="' + esc(s.key) + '">' +
          'Learn More<span class="sr-only"> about ' + esc(s.name) + "</span></button>" +
      "</div>";
    servicesGrid.appendChild(card);
  });

  var categorySelect = $("#c-category");
  var categoryHint = $("#c-category-hint");
  var categoryField = categorySelect.closest(".field");

  function clearCategoryPrefill() {
    categoryField.classList.remove("prefilled");
    categoryHint.textContent = "";
  }

  function reportIssue(category) {
    categorySelect.value = category;
    categoryField.classList.add("prefilled");
    categoryHint.textContent = "Category pre-selected: " + category + ". You can change it if needed.";
    clearFieldError(categorySelect);
    scrollToId("complaints", $("#c-location"));
  }

  servicesGrid.addEventListener("click", function (e) {
    var report = e.target.closest("[data-report]");
    if (report) { reportIssue(report.getAttribute("data-report")); return; }
    var learn = e.target.closest("[data-learn]");
    if (learn) {
      var svc = SERVICES.filter(function (s) { return s.key === learn.getAttribute("data-learn"); })[0];
      openModal({
        trigger: learn,
        title: svc.name,
        bodyHTML: "<p>" + esc(svc.info) + "</p><p class=\"muted small\">Mapped complaint category: <strong>" + esc(svc.category) + "</strong>.</p>",
        buttons: [
          { label: "Report this issue", variant: "btn-primary", html: '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Report this issue',
            onClick: function () { closeModal(); reportIssue(svc.category); } },
          { label: "Close", onClick: closeModal }
        ]
      });
    }
  });

  /* Footer service links highlight the matching card */
  $$("#footer-services a[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var card = document.getElementById("service-" + link.getAttribute("data-service"));
      if (!card) return;
      $$(".service-card").forEach(function (c) { c.classList.remove("is-highlighted"); });
      card.classList.add("is-highlighted");
      window.setTimeout(function () { card.classList.remove("is-highlighted"); }, 2600);
    });
  });

  /* Reaching #complaints directly clears any stale category pre-selection */
  $$('a[href="#complaints"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (!complaintTouched.category) {
        categorySelect.value = "";
        clearCategoryPrefill();
      }
    });
  });

  /* ------------------------------------------------------- complaint form */
  var complaintForm = $("#complaint-form");
  var complaintTouched = {};
  var selectedImage = null;

  var COMPLAINT_RULES = {
    "c-name": { key: "name", msg: "Please enter your name.", test: function (v) { return v.trim().length > 0; } },
    "c-contact": { key: "contact", msg: "Please enter a valid email address or phone number.", test: function (v) {
      var s = v.trim();
      var email = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(s);
      var phone = /^[+]?[\d][\d\s\-()]{6,17}$/.test(s) && (s.replace(/\D/g, "").length >= 7);
      return email || phone;
    } },
    "c-category": { key: "category", msg: "Please select a complaint category.", test: function (v) { return v !== ""; } },
    "c-location": { key: "location", msg: "Please enter the issue location.", test: function (v) { return v.trim().length > 0; } },
    "c-description": { key: "description", msg: "Please provide a meaningful description.", test: function (v) { return v.trim().length >= 10; } }
  };

  function showFieldError(input, message) {
    var field = input.closest(".field");
    field.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    var err = $(".error", field);
    if (err) { err.textContent = message; err.classList.add("show"); }
  }
  function clearFieldError(input) {
    var field = input.closest(".field");
    field.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    var err = $(".error", field);
    if (err) { err.textContent = ""; err.classList.remove("show"); }
  }
  function validateField(id) {
    var rule = COMPLAINT_RULES[id];
    var input = document.getElementById(id);
    if (rule.test(input.value)) { clearFieldError(input); return true; }
    showFieldError(input, rule.msg);
    return false;
  }

  Object.keys(COMPLAINT_RULES).forEach(function (id) {
    var input = document.getElementById(id);
    var rule = COMPLAINT_RULES[id];
    input.addEventListener("blur", function () {
      complaintTouched[rule.key] = true;
      validateField(id);
    });
    input.addEventListener("input", function () {
      if (complaintTouched[rule.key]) validateField(id);
    });
    if (input.tagName === "SELECT") {
      input.addEventListener("change", function () {
        complaintTouched[rule.key] = true;
        clearCategoryPrefill();
        validateField(id);
      });
    }
  });

  /* image upload */
  var imageInput = $("#c-image");
  var preview = $("#image-preview");
  var previewImg = $("#preview-img");
  var previewName = $("#preview-name");
  var MAX_BYTES = 5 * 1024 * 1024;
  var ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  function resetImage() {
    selectedImage = null;
    imageInput.value = "";
    preview.hidden = true;
    previewImg.removeAttribute("src");
    previewName.textContent = "";
    clearFieldError(imageInput);
  }

  imageInput.addEventListener("change", function () {
    var file = imageInput.files && imageInput.files[0];
    clearFieldError(imageInput);
    if (!file) { resetImage(); return; }
    if (ALLOWED.indexOf(file.type) === -1) {
      resetImage();
      showFieldError(imageInput, "Please upload a JPG, PNG, WEBP, or GIF image.");
      toast("Please upload a JPG, PNG, WEBP, or GIF image.", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      resetImage();
      showFieldError(imageInput, "Image is too large. Please choose a file under 5 MB.");
      toast("Image is too large. Please choose a file under 5 MB.", "error");
      return;
    }
    selectedImage = { name: file.name };
    previewName.textContent = file.name;
    previewImg.src = URL.createObjectURL(file);
    preview.hidden = false;
  });
  $("#remove-image").addEventListener("click", function () {
    resetImage();
    imageInput.focus();
    toast("Image removed.", "info", 3000);
  });

  function resetComplaintForm() {
    complaintForm.reset();
    complaintTouched = {};
    Object.keys(COMPLAINT_RULES).forEach(function (id) { clearFieldError(document.getElementById(id)); });
    clearCategoryPrefill();
    resetImage();
    var summary = $("#complaint-summary");
    summary.textContent = ""; summary.classList.remove("show");
  }
  $("#complaint-reset").addEventListener("click", function () {
    resetComplaintForm();
    $("#c-name").focus();
    toast("The complaint form has been cleared.", "info", 3000);
  });

  complaintForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var summary = $("#complaint-summary");
    var ids = Object.keys(COMPLAINT_RULES);
    var firstInvalid = null;
    ids.forEach(function (id) {
      complaintTouched[COMPLAINT_RULES[id].key] = true;
      if (!validateField(id) && !firstInvalid) firstInvalid = document.getElementById(id);
    });

    if (firstInvalid) {
      summary.textContent = "Please complete all required fields.";
      summary.classList.add("show");
      firstInvalid.focus();
      toast("Please complete all required fields.", "error");
      return;
    }
    summary.textContent = ""; summary.classList.remove("show");

    if (!HAS_STORAGE) {
      toast("Demo storage is currently unavailable. Your information could not be saved.", "error", 7000);
      return;
    }

    var btn = $("#complaint-submit");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Submitting…';

    window.setTimeout(function () {
      var record = {
        id: generateId(),
        name: $("#c-name").value.trim(),
        contact: $("#c-contact").value.trim(),
        category: categorySelect.value,
        location: $("#c-location").value.trim(),
        description: $("#c-description").value.trim(),
        imageName: selectedImage ? selectedImage.name : null,
        status: "Pending",
        date: new Date().toISOString()
      };

      var list = readComplaints();
      list.push(record);
      var saved = writeComplaints(list);

      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Submit Complaint';

      if (!saved) {
        toast("Demo storage is currently unavailable. Your information could not be saved.", "error", 7000);
        return;
      }

      openModal({
        trigger: btn,
        title: "Complaint Submitted Successfully!",
        bodyHTML:
          "<p>Your complaint has been registered successfully.</p>" +
          '<ul class="detail-list">' +
            "<li><span>Complaint ID</span><strong>" + esc(record.id) + "</strong></li>" +
            "<li><span>Category</span><strong>" + esc(record.category) + "</strong></li>" +
            "<li><span>Location</span><strong>" + esc(record.location) + "</strong></li>" +
            "<li><span>Submitted</span><strong>" + esc(formatDate(record.date)) + "</strong></li>" +
            "<li><span>Status</span>" + statusBadge(record.status) + "</li>" +
          "</ul>" +
          "<p><strong>Please save this ID to track the progress of your complaint.</strong></p>" +
          '<p class="muted small">Stored only in this browser. Nothing is sent to any server.</p>',
        buttons: [
          { label: "Track This Complaint", variant: "btn-primary",
            html: '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Track This Complaint',
            onClick: function () {
              closeModal();
              var input = $("#track-input");
              input.value = record.id;
              scrollToId("track-status", input);
              runSearch(record.id);
            } },
          { label: "Submit Another Complaint",
            html: '<i class="fa-solid fa-plus" aria-hidden="true"></i> Submit Another Complaint',
            onClick: function () {
              closeModal();
              resetComplaintForm();
              $("#c-name").focus();
            } }
        ]
      });

      toast("Complaint " + record.id + " submitted successfully.", "success");
      resetComplaintForm();
    }, reduceMotion ? 0 : 600);
  });

  /* ----------------------------------------------------------- tracking */
  var STATUS_META = {
    "Pending": { icon: "fa-hourglass-half", cls: "badge-pending", note: "Complaint received and waiting for review." },
    "In Progress": { icon: "fa-gears", cls: "badge-progress", note: "The responsible department is currently working on the issue." },
    "Resolved": { icon: "fa-circle-check", cls: "badge-resolved", note: "The reported issue has been addressed." }
  };
  var STAGES = ["Submitted", "Under Review", "In Progress", "Resolved"];
  var STAGE_INDEX = { "Pending": 1, "In Progress": 2, "Resolved": 3 };

  function statusBadge(status) {
    var m = STATUS_META[status] || STATUS_META.Pending;
    return '<span class="badge ' + m.cls + '"><i class="fa-solid ' + m.icon + '" aria-hidden="true"></i> ' + esc(status) + "</span>";
  }

  var trackInput = $("#track-input");
  var trackError = $("#track-error");
  var trackResult = $("#track-result");

  var INITIAL_STATE = trackResult.innerHTML;

  function bindDemoButtons() {
    $$("[data-demo-id]", trackResult).forEach(function (b) {
      b.addEventListener("click", function () {
        trackInput.value = b.getAttribute("data-demo-id");
        runSearch(trackInput.value);
      });
    });
  }
  bindDemoButtons();

  function setTrackError(msg) {
    trackError.textContent = msg;
    trackError.classList.add("show");
    trackInput.setAttribute("aria-invalid", "true");
    trackInput.closest(".field").classList.add("invalid");
  }
  function clearTrackError() {
    trackError.textContent = "";
    trackError.classList.remove("show");
    trackInput.removeAttribute("aria-invalid");
    trackInput.closest(".field").classList.remove("invalid");
  }

  function renderTimeline(status) {
    var current = STAGE_INDEX[status] != null ? STAGE_INDEX[status] : 0;
    return '<ol class="timeline">' + STAGES.map(function (stage, i) {
      var state = i < current ? "done" : (i === current ? "current" : "");
      var icon = i < current ? "fa-check" : (i === current ? "fa-location-arrow" : "fa-circle");
      var label = i < current ? "Completed" : (i === current ? "Current stage" : "Not started");
      return '<li class="' + state + '">' +
        '<span class="tl-dot" aria-hidden="true"><i class="fa-solid ' + icon + '"></i></span>' +
        "<span><span class=\"tl-title\">" + esc(stage) + '</span><br><span class="tl-note">' + label + "</span></span>" +
        "</li>";
    }).join("") + "</ol>";
  }

  function renderResult(c) {
    var m = STATUS_META[c.status] || STATUS_META.Pending;
    trackResult.innerHTML =
      '<article class="card result-card">' +
        '<div class="result-head">' +
          '<span class="result-id">' + esc(c.id) + "</span>" +
          (c.demo ? '<span class="badge badge-demo"><i class="fa-solid fa-flask" aria-hidden="true"></i> DEMO DATA</span>' : "") +
          statusBadge(c.status) +
        "</div>" +
        '<p class="muted" style="margin:0">' + esc(m.note) + "</p>" +
        '<div class="result-meta">' +
          "<div><div class=\"meta-label\">Category</div><div>" + esc(c.category) + "</div></div>" +
          "<div><div class=\"meta-label\">Location</div><div>" + esc(c.location) + "</div></div>" +
          "<div><div class=\"meta-label\">Date submitted</div><div>" + esc(formatDate(c.date)) + "</div></div>" +
          "<div><div class=\"meta-label\">Current status</div><div>" + esc(c.status) + "</div></div>" +
        "</div>" +
        "<div><div class=\"meta-label\">Description</div><p style=\"margin:4px 0 0\">" + esc(c.description || "No description provided.") + "</p></div>" +
        (c.imageName ? '<p class="muted small" style="margin:0"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> Attached file: ' + esc(c.imageName) + " (filename only)</p>" : "") +
        "<div><div class=\"meta-label\">Progress</div>" + renderTimeline(c.status) + "</div>" +
      "</article>";
  }

  function runSearch(rawValue) {
    var value = (rawValue != null ? rawValue : trackInput.value).trim();
    if (!value) {
      clearTrackError();
      setTrackError("Please enter a complaint ID.");
      trackResult.innerHTML = INITIAL_STATE;
      bindDemoButtons();
      trackInput.focus();
      toast("Please enter a complaint ID.", "warning");
      return;
    }
    clearTrackError();

    var btn = $("#track-search");
    btn.disabled = true;
    trackResult.innerHTML = '<div class="card loading"><span class="spinner" aria-hidden="true"></span><span>Searching complaints…</span></div>';

    window.setTimeout(function () {
      btn.disabled = false;
      var match = allComplaints().filter(function (c) {
        return c.id.toLowerCase() === value.toLowerCase();
      })[0];

      if (!match) {
        trackResult.innerHTML =
          '<div class="empty-state"><i class="fa-solid fa-circle-exclamation" style="color:var(--error)" aria-hidden="true"></i>' +
          "<p><strong>Complaint ID not found. Please check the ID and try again.</strong></p>" +
          '<p class="muted">IDs look like CC-2026-48291.</p></div>';
        setTrackError("Complaint ID not found. Please check the ID and try again.");
        trackInput.focus();
        toast("Complaint ID not found. Please check the ID and try again.", "error");
        return;
      }
      renderResult(match);
    }, reduceMotion ? 0 : 450);
  }

  $("#track-form").addEventListener("submit", function (e) { e.preventDefault(); runSearch(); });
  $("#track-clear").addEventListener("click", function () {
    trackInput.value = "";
    clearTrackError();
    trackResult.innerHTML = INITIAL_STATE;
    bindDemoButtons();
    trackInput.focus();
    toast("Tracking cleared.", "info", 3000);
  });

  /* ------------------------------------------------------ announcements */
  var ANNOUNCEMENTS = [
    { id: "a1", title: "Water Supply Maintenance", category: "Utilities", date: "2026-08-10",
      summary: "Scheduled maintenance may temporarily affect water supply in selected areas.",
      full: "Scheduled maintenance may temporarily affect water supply in selected areas. In this demo scenario, maintenance crews would work on the main distribution line between 9 AM and 4 PM, and households in the affected wards would be advised to store water in advance. Supply is expected to normalise the same evening." },
    { id: "a2", title: "Road Improvement Project", category: "Infrastructure", date: "2026-08-02",
      summary: "Road improvement work has started in several local areas.",
      full: "Road improvement work has started in several local areas. The demo project covers resurfacing of damaged stretches, footpath repair and repainting of pedestrian crossings. Traffic may be diverted during working hours, and residents are encouraged to report any newly formed potholes through this platform." },
    { id: "a3", title: "Community Clean-Up Campaign", category: "Community", date: "2026-07-25",
      summary: "Join the upcoming community cleanliness campaign and help keep our neighborhoods clean.",
      full: "Join the upcoming community cleanliness campaign and help keep our neighborhoods clean. In this demo announcement, volunteers gather at the community park in the morning, gloves and bags are provided, and collected waste is segregated into recyclable and non-recyclable streams before disposal." }
  ];

  var annGrid = $("#ann-grid");

  function renderAnnouncements(filter) {
    var list = filter === "All" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(function (a) { return a.category === filter; });
    if (!list.length) {
      annGrid.innerHTML = '<div class="empty-state no-results"><i class="fa-solid fa-inbox" aria-hidden="true"></i>' +
        "<p><strong>No announcements in this category.</strong></p>" +
        '<p class="muted">Try selecting a different filter.</p></div>';
      return;
    }
    annGrid.innerHTML = list.map(function (a) {
      return '<article class="card ann-card">' +
        '<div class="ann-top"><span class="badge badge-info"><i class="fa-solid fa-tag" aria-hidden="true"></i> ' + esc(a.category) + "</span>" +
        '<span class="ann-date"><i class="fa-solid fa-calendar-day" aria-hidden="true"></i> ' + esc(formatDate(a.date).split(",")[0]) + "</span></div>" +
        "<h3>" + esc(a.title) + "</h3>" +
        "<p>" + esc(a.summary) + "</p>" +
        '<div><button class="btn btn-outline btn-sm" type="button" data-ann="' + a.id + '">Read More<span class="sr-only"> about ' + esc(a.title) + "</span> <i class=\"fa-solid fa-arrow-right\" aria-hidden=\"true\"></i></button></div>" +
        "</article>";
    }).join("");
  }
  renderAnnouncements("All");

  annGrid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-ann]");
    if (!btn) return;
    var a = ANNOUNCEMENTS.filter(function (x) { return x.id === btn.getAttribute("data-ann"); })[0];
    openModal({
      trigger: btn,
      title: a.title,
      bodyHTML:
        '<p class="badge badge-info"><i class="fa-solid fa-tag" aria-hidden="true"></i> ' + esc(a.category) +
        '</p> <p class="muted small">Published ' + esc(formatDate(a.date).split(",")[0]) + " · demo announcement</p>" +
        "<p>" + esc(a.full) + "</p>",
      buttons: [{ label: "Close", variant: "btn-primary", onClick: closeModal }]
    });
  });

  $$("#ann-filters .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$("#ann-filters .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      var filter = chip.getAttribute("data-filter");
      renderAnnouncements(filter);
      toast("Showing " + (filter === "All" ? "all announcements" : filter + " announcements") + ".", "info", 2500);
    });
  });

  /* ------------------------------------------------------------- counters */
  var counters = $$(".stat-num");
  function animateCounters() {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) { el.textContent = target.toLocaleString() + suffix; return; }
      var start = performance.now(), dur = 1400;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounters(); obs.disconnect(); }
      });
    }, { threshold: .35 });
    counterObserver.observe($("#counters"));
  } else { animateCounters(); }

  /* ------------------------------------------------------------------ FAQ */
  var FAQS = [
    { q: "What is CivicConnect?", a: "CivicConnect is a Class 12 student project prototype: a concept platform where citizens could report civic issues, track their complaints and read local announcements in one place. It is not an official government service." },
    { q: "How do I submit a complaint?", a: "Open the \u201cReport a Civic Issue\u201d section, choose a category, add your location and a short description of at least 10 characters, then submit. You will receive a complaint ID such as CC-2026-48291." },
    { q: "How can I track my complaint?", a: "Go to \u201cTrack Your Complaint\u201d, type the complaint ID you received and press Search. The result shows the category, location, date, current status and a progress timeline." },
    { q: "What types of issues can I report?", a: "Roads and transportation, water supply, waste management, electricity, streetlights, public safety, sanitation, drainage, and anything else under the \u201cOther\u201d category." },
    { q: "Is my complaint information stored?", a: "Only in your own browser, using LocalStorage. Nothing is transmitted to any server or third party, and uploaded images are never saved — only the filename is kept with the record." },
    { q: "Can I submit a complaint anonymously?", a: "Not in this prototype: a name and a contact detail are required so the demo record looks realistic. A real deployment could add an anonymous mode with limited follow-up." }
  ];

  var accordion = $("#accordion");
  accordion.innerHTML = FAQS.map(function (f, i) {
    return '<div class="acc-item">' +
      '<h3 style="margin:0"><button class="acc-trigger" type="button" id="acc-btn-' + i + '" aria-expanded="false" aria-controls="acc-panel-' + i + '">' +
      "<span>" + esc(f.q) + '</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></h3>' +
      '<div class="acc-panel" id="acc-panel-' + i + '" role="region" aria-labelledby="acc-btn-' + i + '" data-open="false"><p>' + esc(f.a) + "</p></div>" +
      "</div>";
  }).join("");

  accordion.addEventListener("click", function (e) {
    var btn = e.target.closest(".acc-trigger");
    if (!btn) return;
    var open = btn.getAttribute("aria-expanded") === "true";
    $$(".acc-trigger", accordion).forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      document.getElementById(b.getAttribute("aria-controls")).setAttribute("data-open", "false");
    });
    if (!open) {
      btn.setAttribute("aria-expanded", "true");
      document.getElementById(btn.getAttribute("aria-controls")).setAttribute("data-open", "true");
    }
  });

  /* -------------------------------------------------------- contact form */
  var contactForm = $("#contact-form");
  var contactTouched = {};
  var CONTACT_RULES = {
    "k-name": { key: "name", msg: "Please enter your name.", test: function (v) { return v.trim().length > 0; } },
    "k-email": { key: "email", msg: "Please enter a valid email address.", test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v.trim()); } },
    "k-subject": { key: "subject", msg: "Please enter a subject.", test: function (v) { return v.trim().length > 0; } },
    "k-message": { key: "message", msg: "Please write a message of at least 10 characters.", test: function (v) { return v.trim().length >= 10; } }
  };

  Object.keys(CONTACT_RULES).forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener("blur", function () { contactTouched[id] = true; validateContact(id); });
    input.addEventListener("input", function () { if (contactTouched[id]) validateContact(id); });
  });
  function validateContact(id) {
    var input = document.getElementById(id);
    if (CONTACT_RULES[id].test(input.value)) { clearFieldError(input); return true; }
    showFieldError(input, CONTACT_RULES[id].msg);
    return false;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var success = $("#contact-success");
    success.textContent = "";
    var firstInvalid = null;
    Object.keys(CONTACT_RULES).forEach(function (id) {
      contactTouched[id] = true;
      if (!validateContact(id) && !firstInvalid) firstInvalid = document.getElementById(id);
    });
    if (firstInvalid) {
      firstInvalid.focus();
      toast("Please complete all required fields.", "error");
      return;
    }
    var btn = $("#contact-submit");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';
    window.setTimeout(function () {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Message';
      contactForm.reset();
      contactTouched = {};
      success.textContent = "Your message has been sent successfully.";
      toast("Your message has been sent successfully.", "success");
    }, reduceMotion ? 0 : 600);
  });

  /* ------------------------------------------------- map + social buttons */
  $("#map-btn").addEventListener("click", function () {
    scrollToId("contact", $("#k-name"));
    toast("This prototype has no live map. Use the demo contact details for location enquiries.", "info");
  });

  $$(".social").forEach(function (btn) {
    btn.addEventListener("click", function () {
      toast("Social integration is a demo placeholder for this prototype (" + btn.getAttribute("data-social") + ").", "info", 4000);
    });
  });

  /* ---------------------------------------------------------- reveal anim */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* --------------------------------------------------------- storage warn */
  if (!HAS_STORAGE) {
    window.setTimeout(function () {
      toast("Demo storage is currently unavailable in this browser, so complaints cannot be saved.", "warning", 8000);
    }, 900);
  } else {
    readComplaints();
  }
})();
