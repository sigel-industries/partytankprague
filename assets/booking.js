/* Party Tank booking frontend v2.0
 * Booking creation uses a cross-origin POST followed by JSONP result polling.
 * This avoids Google Apps Script iframe/postMessage sandbox failures.
 */
(() => {
  "use strict";

  const modal = document.getElementById("booking");
  const form = document.getElementById("bookingForm");
  if (!modal || !form) return;

  const config = window.PARTY_TANK_BOOKING_CONFIG || {};
  const dialog = modal.querySelector(".booking-dialog-v7");
  const steps = [...modal.querySelectorAll("[data-booking-step]")];
  const progress = modal.querySelector(".booking-progress-v7");
  const progressItems = [...modal.querySelectorAll("[data-booking-progress]")];
  const backButton = modal.querySelector("[data-booking-prev]");
  const nextButton = modal.querySelector("[data-booking-next]");
  const submitButton = modal.querySelector(".booking-submit-v7");
  const summary = document.getElementById("bookingSummary");
  const note = document.getElementById("formNote");
  const dateInput = form.elements.date;
  const dateField = document.getElementById("bookingDateField");
  const dateTrigger = document.getElementById("bookingDateTrigger");
  const dateValue = document.getElementById("bookingDateValue");
  const calendar = document.getElementById("bookingCalendar");
  const calendarLabel = document.getElementById("bookingCalendarLabel");
  const calendarWeekdays = document.getElementById("bookingCalendarWeekdays");
  const calendarGrid = document.getElementById("bookingCalendarGrid");
  const calendarPrev = document.getElementById("bookingCalendarPrev");
  const calendarNext = document.getElementById("bookingCalendarNext");
  const phoneInput = form.elements.phone;
  const contactWay = form.elements.contact_way;
  const slotsFieldset = document.getElementById("bookingSlotsFieldset");
  const slotsGrid = document.getElementById("bookingSlots");
  const slotsStatus = document.getElementById("bookingSlotStatus");
  const startTimeInput = form.elements.start_time;
  const title = document.getElementById("bookingTitle");

  let currentStep = 1;
  let lastFocus = null;
  let availabilityRequest = 0;
  let successPanel = null;
  let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const originalTitle = title?.textContent || "Check the date.";

  const FALLBACK = {
    en: {
      book_title_step_1: "Check the date.",
      book_title_step_2: "Shape the ride.",
      book_title_step_3: "Review your booking.",
      book_date_choose: "Choose a date",
      book_date_required: "Choose the ride date from the calendar.",
      book_calendar_previous: "Previous month",
      book_calendar_next: "Next month",
      book_slots_hint: "Choose a date and duration first.",
      book_slots_loading: "Checking the calendar…",
      book_slots_none: "No suitable start time is currently available. Try another date or duration.",
      book_slots_error: "Availability could not be loaded. Please try again.",
      book_slots_select: "Choose one of the available start times.",
      book_summary_title: "Your request",
      book_summary_occasion: "Occasion",
      book_summary_when: "Starts",
      book_summary_end: "Ride ends",
      book_summary_guests: "Guests",
      book_summary_duration: "Duration",
      book_summary_price: "Estimated price",
      book_price_from: "from",
      book_summary_pickup: "Pickup",
      book_summary_route: "Route",
      book_summary_interests: "Interests",
      book_summary_wishes: "Notes",
      book_summary_contact: "Contact",
      book_summary_reply: "Preferred reply",
      book_summary_none: "None selected",
      book_summary_unspecified: "To be agreed",
      book_phone_required: "Add a phone number for phone or WhatsApp replies.",
      book_submitting: "Sending request…",
      book_submit: "Request reservation",
      book_success_eyebrow: "Request received",
      book_success_title: "Your time is temporarily held.",
      book_success_text: "The driver will now check the ride. The reservation is confirmed only after direct confirmation.",
      book_success_id: "Booking ID",
      book_success_close: "Close",
      book_success_again: "New request",
      book_error_generic: "The request could not be saved. Nothing was booked. Please try again.",
      book_error_conflict: "That time has just become unavailable. Choose another start time."
    },
    cs: {
      book_title_step_1: "Vyberte datum.",
      book_title_step_2: "Navrhněte jízdu.",
      book_title_step_3: "Zkontrolujte rezervaci.",
      book_date_choose: "Vyberte datum",
      book_date_required: "Vyberte datum jízdy v kalendáři.",
      book_calendar_previous: "Předchozí měsíc",
      book_calendar_next: "Další měsíc",
      book_slots_hint: "Nejdřív vyberte datum a délku jízdy.",
      book_slots_loading: "Kontrolujeme kalendář…",
      book_slots_none: "Pro tuto délku jízdy teď není vhodný čas. Zkuste jiné datum nebo délku.",
      book_slots_error: "Dostupnost se nepodařilo načíst. Zkuste to znovu.",
      book_slots_select: "Vyberte jeden z dostupných časů.",
      book_summary_title: "Vaše žádost",
      book_summary_occasion: "Příležitost",
      book_summary_when: "Začátek",
      book_summary_end: "Konec jízdy",
      book_summary_guests: "Hosté",
      book_summary_duration: "Délka",
      book_summary_price: "Orientační cena",
      book_price_from: "od",
      book_summary_pickup: "Vyzvednutí",
      book_summary_route: "Trasa",
      book_summary_interests: "Doplňky",
      book_summary_wishes: "Poznámka",
      book_summary_contact: "Kontakt",
      book_summary_reply: "Preferovaná odpověď",
      book_summary_none: "Nic nevybráno",
      book_summary_unspecified: "Podle dohody",
      book_phone_required: "Pro odpověď telefonem nebo přes WhatsApp doplňte telefonní číslo.",
      book_submitting: "Odesíláme žádost…",
      book_submit: "Odeslat žádost o rezervaci",
      book_success_eyebrow: "Žádost přijata",
      book_success_title: "Váš čas je dočasně podržený.",
      book_success_text: "Řidič teď jízdu zkontroluje. Rezervace platí až po přímém potvrzení.",
      book_success_id: "Číslo rezervace",
      book_success_close: "Zavřít",
      book_success_again: "Nová žádost",
      book_error_generic: "Žádost se nepodařilo uložit. Nic nebylo rezervováno. Zkuste to znovu.",
      book_error_conflict: "Tento čas už mezitím není dostupný. Vyberte jiný začátek."
    }
  };

  function language() {
    return document.documentElement.lang === "cs" ? "cs" : "en";
  }

  function dictionary() {
    const lang = language();
    const external = typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[lang] ? TRANSLATIONS[lang] : {};
    return { ...FALLBACK[lang], ...external };
  }

  function todayIso() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function isoToLocalDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function localDateToIso(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function dateOnly(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function calendarLocale() {
    return language() === "cs" ? "cs-CZ" : "en-GB";
  }

  function selectedDateLabel() {
    const selected = isoToLocalDate(value("date"));
    if (!selected) return dictionary().book_date_choose;
    return new Intl.DateTimeFormat(calendarLocale(), {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(selected);
  }

  function updateDateDisplay() {
    if (!dateValue || !dateTrigger) return;
    const hasDate = Boolean(value("date"));
    dateValue.textContent = selectedDateLabel();
    dateTrigger.classList.toggle("is-placeholder", !hasDate);
    dateField?.classList.remove("is-error");
  }

  function closeCalendar({ restoreFocus = false } = {}) {
    if (!calendar || calendar.hidden) return;
    calendar.hidden = true;
    dateTrigger?.setAttribute("aria-expanded", "false");
    if (restoreFocus) dateTrigger?.focus();
  }

  function renderCalendar() {
    if (!calendar || !calendarGrid || !calendarLabel || !calendarWeekdays) return;
    const locale = calendarLocale();
    const today = dateOnly();
    const selected = isoToLocalDate(value("date"));
    const maxAdvanceDays = Math.max(30, Number(config.maxAdvanceDays) || 730);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const last = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    calendarLabel.textContent = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);
    calendarPrev?.setAttribute("aria-label", dictionary().book_calendar_previous);
    calendarNext?.setAttribute("aria-label", dictionary().book_calendar_next);
    if (calendarPrev) calendarPrev.disabled = first <= currentMonth;
    if (calendarNext) calendarNext.disabled = first >= maxMonth;

    calendarWeekdays.replaceChildren();
    const weekdayBase = new Date(2024, 0, 1); // Monday
    for (let index = 0; index < 7; index += 1) {
      const day = new Date(weekdayBase);
      day.setDate(weekdayBase.getDate() + index);
      const label = document.createElement("span");
      label.textContent = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day).replace(".", "");
      label.setAttribute("aria-hidden", "true");
      calendarWeekdays.append(label);
    }

    calendarGrid.replaceChildren();
    const offset = (first.getDay() + 6) % 7;
    for (let index = 0; index < offset; index += 1) {
      const blank = document.createElement("span");
      blank.className = "booking-calendar-blank-v2";
      blank.setAttribute("aria-hidden", "true");
      calendarGrid.append(blank);
    }

    for (let dayNumber = 1; dayNumber <= last.getDate(); dayNumber += 1) {
      const date = new Date(first.getFullYear(), first.getMonth(), dayNumber);
      const iso = localDateToIso(date);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "booking-calendar-day-v2";
      button.textContent = String(dayNumber);
      button.disabled = date < today || date > maxDate;
      button.setAttribute("aria-label", new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date));
      if (date.getTime() === today.getTime()) button.classList.add("is-today");
      if (selected && localDateToIso(selected) === iso) {
        button.classList.add("is-selected");
        button.setAttribute("aria-current", "date");
      }
      button.addEventListener("click", async () => {
        if (dateInput) dateInput.value = iso;
        updateDateDisplay();
        closeCalendar();
        await loadAvailability();
        dateTrigger?.focus();
      });
      calendarGrid.append(button);
    }
  }

  function openCalendar() {
    if (!calendar) return;
    const selected = isoToLocalDate(value("date"));
    const base = selected || new Date();
    calendarMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    renderCalendar();
    calendar.hidden = false;
    dateTrigger?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      const selectedButton = calendarGrid?.querySelector(".is-selected:not(:disabled)");
      const firstButton = calendarGrid?.querySelector("button:not(:disabled)");
      (selectedButton || firstButton)?.focus();
    });
  }

  function durationMinutes() {
    const checked = form.querySelector('input[name="duration_minutes"]:checked');
    return checked ? Number(checked.value) : 0;
  }

  function pricingForDuration(duration = durationMinutes()) {
    const pricing = config.pricing || {};
    if (!pricing.enabled || !duration) return null;
    const raw = pricing.byDurationMinutes?.[duration] ?? pricing.byDurationMinutes?.[String(duration)];
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return {
      amount,
      currency: String(pricing.currency || "CZK").toUpperCase(),
      displayMode: pricing.displayMode === "exact" ? "exact" : "from"
    };
  }

  function formatMoney(amount, currency) {
    try {
      return new Intl.NumberFormat(language() === "cs" ? "cs-CZ" : "en-CZ", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (_) {
      return `${Math.round(amount).toLocaleString(language() === "cs" ? "cs-CZ" : "en-US")} ${currency}`;
    }
  }

  function priceDisplay(price = pricingForDuration()) {
    if (!price) return "";
    const formatted = formatMoney(price.amount, price.currency);
    return price.displayMode === "from" ? `${dictionary().book_price_from} ${formatted}` : formatted;
  }

  function decorateDurationPrices() {
    form.querySelectorAll('input[name="duration_minutes"]').forEach((input) => {
      const span = input.closest("label")?.querySelector("span");
      if (!span) return;
      const price = pricingForDuration(Number(input.value));
      const display = priceDisplay(price);
      if (display) {
        span.dataset.priceDisplay = display;
        span.classList.add("has-booking-price-v1");
      } else {
        delete span.dataset.priceDisplay;
        span.classList.remove("has-booking-price-v1");
      }
    });
  }

  function value(name) {
    const field = form.elements[name];
    return field && "value" in field ? String(field.value).trim() : "";
  }

  function selectedLabel(name) {
    const field = form.querySelector(`[name="${CSS.escape(name)}"]:checked`);
    return field?.closest("label")?.querySelector("span")?.textContent?.trim() || field?.value || "";
  }

  function checkedLabels(name) {
    return [...form.querySelectorAll(`[name="${CSS.escape(name)}"]:checked`)]
      .map((field) => field.closest("label")?.querySelector("span")?.textContent?.trim() || field.value)
      .filter(Boolean);
  }

  function checkedValues(name) {
    return [...form.querySelectorAll(`[name="${CSS.escape(name)}"]:checked`)].map((field) => field.value);
  }

  function minutesToTime(totalMinutes) {
    const normalized = ((totalMinutes % 1440) + 1440) % 1440;
    return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
  }

  function timeToMinutes(time) {
    const [hours, minutes] = String(time || "").split(":").map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes) ? hours * 60 + minutes : 0;
  }

  function endTime() {
    const start = value("start_time");
    const duration = durationMinutes();
    if (!start || !duration) return "";
    return minutesToTime(timeToMinutes(start) + duration);
  }

  function setStatus(message, type = "") {
    if (!slotsStatus) return;
    slotsStatus.textContent = message;
    slotsStatus.classList.toggle("is-error", type === "error");
  }

  function setFormNote(message, type = "") {
    if (!note) return;
    note.textContent = message;
    note.classList.toggle("is-error", type === "error");
    note.classList.toggle("is-success", type === "success");
  }

  function resetSlotSelection() {
    if (startTimeInput) startTimeInput.value = "";
    slotsGrid?.querySelectorAll('input[name="slot_choice"]').forEach((input) => {
      input.checked = false;
    });
  }

  function createTimeoutSignal(timeoutMs) {
    if (!("AbortController" in window)) return { signal: undefined, cancel: () => {} };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return { signal: controller.signal, cancel: () => clearTimeout(timer) };
  }


  function requestJsonp(url, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const callbackName = `__ptp_jsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timer = window.setTimeout(() => {
        cleanup();
        reject(new Error("Availability request timed out."));
      }, timeoutMs);

      function cleanup() {
        window.clearTimeout(timer);
        script.remove();
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      }

      window[callbackName] = (result) => {
        cleanup();
        resolve(result);
      };

      url.searchParams.set("callback", callbackName);
      url.searchParams.set("_", String(Date.now()));
      script.src = url.toString();
      script.async = true;
      script.onerror = () => {
        cleanup();
        reject(new Error("Availability request failed."));
      };

      document.head.appendChild(script);
    });
  }

  function submitBookingBridge(payload, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const requestId = `ptp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const frameName = `ptp_booking_frame_${requestId}`;
      const iframe = document.createElement("iframe");
      const bridgeForm = document.createElement("form");
      const startedAt = Date.now();
      let settled = false;
      let pollTimer = 0;
      let lastPollError = null;

      iframe.name = frameName;
      iframe.hidden = true;
      iframe.setAttribute("aria-hidden", "true");

      bridgeForm.method = "POST";
      bridgeForm.action = config.endpoint;
      bridgeForm.target = frameName;
      bridgeForm.hidden = true;
      bridgeForm.acceptCharset = "UTF-8";

      const fields = {
        action: "createBookingBridge",
        request_id: requestId,
        payload_json: JSON.stringify(payload)
      };

      Object.entries(fields).forEach(([name, fieldValue]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = fieldValue;
        bridgeForm.appendChild(input);
      });

      const cleanup = () => {
        window.clearTimeout(pollTimer);
        iframe.remove();
        bridgeForm.remove();
      };

      const finish = (handler, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      };

      const pollResult = async () => {
        if (settled) return;

        const elapsed = Date.now() - startedAt;
        const remaining = timeoutMs - elapsed;
        if (remaining <= 0) {
          const suffix = lastPollError ? ` Last polling error: ${lastPollError.message}` : "";
          finish(reject, new Error(`Booking result timed out.${suffix}`));
          return;
        }

        try {
          const resultUrl = new URL(config.endpoint);
          resultUrl.searchParams.set("action", "bookingResult");
          resultUrl.searchParams.set("request_id", requestId);

          const envelope = await requestJsonp(
            resultUrl,
            Math.min(5000, Math.max(1500, remaining))
          );

          if (!envelope?.ok) {
            throw new Error(envelope?.message || envelope?.code || "Booking result lookup failed.");
          }

          if (envelope.ready) {
            finish(
              resolve,
              envelope.result || { ok: false, code: "empty_result" }
            );
            return;
          }

          lastPollError = null;
        } catch (error) {
          // A single failed poll must not create a fake booking failure.
          // Continue until the overall request timeout expires.
          lastPollError = error instanceof Error ? error : new Error(String(error));
        }

        pollTimer = window.setTimeout(pollResult, 550);
      };

      document.body.append(iframe, bridgeForm);

      try {
        bridgeForm.submit();
      } catch (error) {
        finish(reject, error instanceof Error ? error : new Error(String(error)));
        return;
      }

      // Give the POST a short head start, then read the durable result by JSONP.
      pollTimer = window.setTimeout(pollResult, 450);
    });
  }

  const provider = {
    async availability({ date, durationMinutes: duration }) {
      if (config.mode === "apps-script") {
        if (!config.endpoint) throw new Error("Missing Apps Script endpoint.");
        const url = new URL(config.endpoint);
        url.searchParams.set("action", "availability");
        url.searchParams.set("date", date);
        url.searchParams.set("duration_minutes", String(duration));
        url.searchParams.set("vehicle_id", config.vehicleId || "hummer-h2-01");
        const result = await requestJsonp(
          url,
          config.requestTimeoutMs || 15000
        );
        if (!result?.ok) {
          throw new Error(result?.message || result?.code || "Availability failed.");
        }
        return result.slots || [];
      }

      await new Promise((resolve) => setTimeout(resolve, 280));
      const start = timeToMinutes(config.operatingHours?.start || "10:00");
      const end = timeToMinutes(config.operatingHours?.end || "23:00");
      const step = Number(config.slotStepMinutes) || 60;
      const buffer = Number(config.turnaroundMinutes) || 0;
      const slots = [];
      for (let minute = start; minute + duration + buffer <= end; minute += step) {
        slots.push(minutesToTime(minute));
      }
      return slots;
    },

    async createBooking(payload) {
      if (config.mode === "apps-script") {
        if (!config.endpoint) throw new Error("Missing Apps Script endpoint.");
        return await submitBookingBridge(
          payload,
          config.requestTimeoutMs || 20000
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
      const sequence = String(Math.floor(Math.random() * 90000) + 10000);
      return { ok: true, booking_id: `PTP-${day}-${sequence}`, status: "pending_driver" };
    }
  };

  function renderSlots(slots) {
    if (!slotsGrid) return;
    slotsGrid.replaceChildren();
    resetSlotSelection();
    const dict = dictionary();

    if (!slots.length) {
      setStatus(dict.book_slots_none);
      return;
    }

    const fragment = document.createDocumentFragment();
    slots.forEach((time) => {
      const label = document.createElement("label");
      label.className = "booking-slot-v1";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "slot_choice";
      input.value = time;
      input.setAttribute("aria-label", time);
      const span = document.createElement("span");
      span.textContent = time;
      input.addEventListener("change", () => {
        if (startTimeInput) startTimeInput.value = time;
        setStatus("");
        if (currentStep === 3) renderSummary();
      });
      label.append(input, span);
      fragment.append(label);
    });
    slotsGrid.append(fragment);
    setStatus("");
  }

  async function loadAvailability() {
    const date = value("date");
    const duration = durationMinutes();
    const dict = dictionary();
    availabilityRequest += 1;
    const requestId = availabilityRequest;
    resetSlotSelection();
    slotsGrid?.replaceChildren();

    if (!date || !duration) {
      setStatus(dict.book_slots_hint);
      return;
    }

    slotsFieldset?.classList.add("is-loading");
    setStatus(dict.book_slots_loading);
    try {
      const slots = await provider.availability({ date, durationMinutes: duration });
      if (requestId !== availabilityRequest) return;
      renderSlots(slots);
    } catch (error) {
      console.error("Party Tank availability error", error);
      if (requestId !== availabilityRequest) return;
      setStatus(dict.book_slots_error, "error");
    } finally {
      if (requestId === availabilityRequest) slotsFieldset?.classList.remove("is-loading");
    }
  }

  function updatePhoneRequirement() {
    const needsPhone = contactWay && ["phone", "whatsapp"].includes(contactWay.value);
    if (!phoneInput) return;
    phoneInput.required = Boolean(needsPhone);
    phoneInput.setAttribute("aria-required", String(Boolean(needsPhone)));
  }

  function validateStep(step) {
    const panel = modal.querySelector(`[data-booking-step="${step}"]`);
    if (!panel) return true;
    const dict = dictionary();

    updatePhoneRequirement();

    if (step === 1 && !value("date")) {
      dateField?.classList.add("is-error");
      setStatus(dict.book_date_required, "error");
      openCalendar();
      return false;
    }

    const fields = [...panel.querySelectorAll("input, select, textarea")].filter((field) => field.type !== "hidden");
    for (const field of fields) {
      if (field.type === "radio" && field.required) {
        const checked = panel.querySelector(`input[name="${CSS.escape(field.name)}"]:checked`);
        if (!checked) {
          field.focus();
          field.reportValidity();
          return false;
        }
      } else if (!field.checkValidity()) {
        if (field === phoneInput && field.required && !field.value.trim()) setFormNote(dict.book_phone_required, "error");
        field.reportValidity();
        field.focus();
        return false;
      }
    }

    if (step === 1 && !value("start_time")) {
      setStatus(dict.book_slots_select, "error");
      const firstSlot = slotsGrid?.querySelector("input");
      firstSlot?.focus();
      return false;
    }

    return true;
  }

  function appendSummaryRow(list, label, content) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = content || "—";
    row.append(dt, dd);
    list.append(row);
  }

  function renderSummary() {
    if (!summary) return;
    const dict = dictionary();
    const interests = checkedLabels("interests").join(", ") || dict.book_summary_none;
    const duration = durationMinutes();
    const contact = [value("name"), value("email"), value("phone")].filter(Boolean).join(" · ");
    const replyLabel = contactWay?.selectedOptions?.[0]?.textContent?.trim() || "";

    summary.replaceChildren();
    const heading = document.createElement("p");
    heading.textContent = dict.book_summary_title;
    const list = document.createElement("dl");
    appendSummaryRow(list, dict.book_summary_occasion, selectedLabel("occasion"));
    appendSummaryRow(list, dict.book_summary_when, [selectedDateLabel(), value("start_time")].filter(Boolean).join(" · "));
    appendSummaryRow(list, dict.book_summary_end, endTime());
    appendSummaryRow(list, dict.book_summary_guests, value("guests"));
    appendSummaryRow(list, dict.book_summary_duration, duration ? `${duration / 60} h` : "");
    const selectedPrice = pricingForDuration(duration);
    if (selectedPrice) appendSummaryRow(list, dict.book_summary_price, priceDisplay(selectedPrice));
    appendSummaryRow(list, dict.book_summary_pickup, value("pickup"));
    appendSummaryRow(list, dict.book_summary_route, value("destination") || dict.book_summary_unspecified);
    appendSummaryRow(list, dict.book_summary_interests, interests);
    appendSummaryRow(list, dict.book_summary_wishes, value("wishes") || dict.book_summary_unspecified);
    appendSummaryRow(list, dict.book_summary_contact, contact);
    appendSummaryRow(list, dict.book_summary_reply, replyLabel);
    summary.append(heading, list);
  }

  function setStep(step) {
    currentStep = Math.max(1, Math.min(3, step));
    steps.forEach((panel, index) => panel.classList.toggle("is-active", index + 1 === currentStep));
    progressItems.forEach((item, index) => {
      item.classList.toggle("is-active", index + 1 === currentStep);
      item.classList.toggle("is-done", index + 1 < currentStep);
    });
    if (backButton) backButton.hidden = currentStep === 1;
    if (nextButton) nextButton.hidden = currentStep === 3;
    if (submitButton) submitButton.hidden = currentStep !== 3;
    const dict = dictionary();
    if (title) title.textContent = dict[`book_title_step_${currentStep}`] || originalTitle;
    if (currentStep === 3) renderSummary();
    if (form) form.scrollTop = 0;
  }

  function buildPayload() {
    const duration = durationMinutes();
    return {
      schema_version: "1.0",
      vehicle_id: config.vehicleId || "hummer-h2-01",
      customer_language: language(),
      occasion: value("occasion"),
      guests: Number(value("guests")),
      ride_date: value("date"),
      duration_minutes: duration,
      price_amount: pricingForDuration(duration)?.amount ?? null,
      price_currency: pricingForDuration(duration)?.currency ?? null,
      price_display_mode: pricingForDuration(duration)?.displayMode ?? null,
      start_time: value("start_time"),
      end_time: endTime(),
      pickup_address: value("pickup"),
      destination_type: value("destination") ? "different_or_route" : "route_to_confirm",
      destination_address: value("destination"),
      interests: checkedValues("interests"),
      wishes: value("wishes"),
      customer_name: value("name"),
      customer_email: value("email"),
      customer_phone: value("phone"),
      contact_way: value("contact_way") || "email",
      source: "website",
      source_url: window.location.href,
      client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    };
  }

  function ensureSuccessPanel() {
    if (successPanel) return successPanel;
    successPanel = document.createElement("section");
    successPanel.className = "booking-success-v1";
    successPanel.id = "bookingSuccess";
    successPanel.hidden = true;
    successPanel.setAttribute("aria-live", "polite");
    form.insertAdjacentElement("afterend", successPanel);
    return successPanel;
  }

  function showSuccess(result) {
    const dict = dictionary();
    const panel = ensureSuccessPanel();
    panel.replaceChildren();

    const mark = document.createElement("div");
    mark.className = "booking-success-mark-v1";
    mark.textContent = "✓";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = dict.book_success_eyebrow;
    const heading = document.createElement("h3");
    heading.textContent = dict.book_success_title;
    const text = document.createElement("p");
    text.textContent = dict.book_success_text;
    const idBox = document.createElement("div");
    idBox.className = "booking-success-id-v1";
    const idLabel = document.createElement("span");
    idLabel.textContent = dict.book_success_id;
    const idValue = document.createElement("strong");
    idValue.textContent = result.booking_id || "—";
    idBox.append(idLabel, idValue);

    const actions = document.createElement("div");
    actions.className = "booking-success-actions-v1";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn btn-primary";
    close.textContent = dict.book_success_close;
    close.addEventListener("click", closeModal);
    const again = document.createElement("button");
    again.type = "button";
    again.className = "btn booking-secondary-v1";
    again.textContent = dict.book_success_again;
    again.addEventListener("click", resetFlow);
    actions.append(close, again);

    panel.append(mark, eyebrow, heading, text, idBox, actions);
    form.hidden = true;
    if (progress) progress.hidden = true;
    panel.hidden = false;
    if (title) title.textContent = dict.book_success_eyebrow;
    dialog?.scrollTo({ top: 0, behavior: "smooth" });
    close.focus();
  }

  function resetFlow() {
    form.reset();
    form.hidden = false;
    if (progress) progress.hidden = false;
    if (successPanel) successPanel.hidden = true;
    if (title) title.textContent = originalTitle;
    calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    closeCalendar();
    updateDateDisplay();
    updatePhoneRequirement();
    slotsGrid?.replaceChildren();
    resetSlotSelection();
    setStatus(dictionary().book_slots_hint);
    setFormNote(dictionary().book_mail_note || "");
    setStep(1);
  }

  function openModal(event) {
    event?.preventDefault();
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("booking-modal-open-v7");
    document.getElementById("mobileMenu")?.classList.remove("open");
    if (!form.hidden) setStep(currentStep || 1);
    setTimeout(() => modal.querySelector("[data-booking-close]")?.focus(), 30);
  }

  function closeModal() {
    closeCalendar();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("booking-modal-open-v7");
    if (location.hash === "#booking") history.replaceState(null, "", location.pathname + location.search);
    lastFocus?.focus?.();
  }

  document.querySelectorAll('a[href="#booking"], [data-booking-open]').forEach((trigger) => trigger.addEventListener("click", openModal));
  modal.querySelectorAll("[data-booking-close]").forEach((button) => button.addEventListener("click", closeModal));
  nextButton?.addEventListener("click", () => {
    if (validateStep(currentStep)) setStep(currentStep + 1);
  });
  backButton?.addEventListener("click", () => setStep(currentStep - 1));

  dateTrigger?.addEventListener("click", () => {
    if (calendar?.hidden) openCalendar();
    else closeCalendar({ restoreFocus: true });
  });
  calendarPrev?.addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  calendarNext?.addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  dateInput?.addEventListener("change", () => {
    updateDateDisplay();
    loadAvailability();
  });
  form.querySelectorAll('input[name="duration_minutes"]').forEach((input) => input.addEventListener("change", () => {
    decorateDurationPrices();
    loadAvailability();
  }));
  contactWay?.addEventListener("change", () => {
    updatePhoneRequirement();
    if (currentStep === 3) renderSummary();
  });
  form.addEventListener("input", () => {
    if (currentStep === 3) renderSummary();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      if (calendar && !calendar.hidden) {
        event.preventDefault();
        closeCalendar({ restoreFocus: true });
        return;
      }
      closeModal();
    }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll('button:not([hidden]):not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')]
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;
    const dict = dictionary();
    const payload = buildPayload();
    submitButton.disabled = true;
    const originalSubmitText = submitButton.textContent;
    submitButton.textContent = dict.book_submitting;
    setFormNote("");

    try {
      const result = await provider.createBooking(payload);
      if (!result?.ok) {
        if (result?.code === "slot_conflict") {
          setFormNote(dict.book_error_conflict, "error");
          setStep(1);
          await loadAvailability();
          return;
        }
        throw new Error(result?.message || result?.code || "Booking failed.");
      }
      showSuccess(result);
    } catch (error) {
      console.error("Party Tank booking error", error);
      setFormNote(dict.book_error_generic, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalSubmitText || dict.book_submit;
    }
  });

  const langObserver = new MutationObserver(() => {
    updateDateDisplay();
    requestAnimationFrame(decorateDurationPrices);
    if (calendar && !calendar.hidden) renderCalendar();
    if (title && !form.hidden) {
      const dict = dictionary();
      title.textContent = dict[`book_title_step_${currentStep}`] || originalTitle;
    }
    if (currentStep === 3) renderSummary();
    if (!value("date") || !durationMinutes()) setStatus(dictionary().book_slots_hint);
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  updateDateDisplay();
  decorateDurationPrices();
  updatePhoneRequirement();
  setStatus(dictionary().book_slots_hint);
  if (location.hash === "#booking") openModal();
})();
