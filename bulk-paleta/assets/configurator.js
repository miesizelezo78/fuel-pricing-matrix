(function () {
  const root = document.querySelector("[data-vulcanus-bulk]");
  if (!root) return;

  const duplicate = root.previousElementSibling;
  if (duplicate && duplicate.tagName === "H1") {
    duplicate.setAttribute("hidden", "");
    duplicate.setAttribute("aria-hidden", "true");
  }

  const catalog = JSON.parse(root.getAttribute("data-catalog"));
  const money = new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" });
  const num = new Intl.NumberFormat("sk-SK");
  const fuelIds = Object.keys(catalog.fuels);
  const startFuel = root.getAttribute("data-fuel") || "uhlie";
  const startKg = Number(root.getAttribute("data-initial-kg") || 100);

  const state = {
    kgByFuel: {},
    fulfillment: "pallet",
    buyerType: "person",
  };
  fuelIds.forEach(function (id) {
    state.kgByFuel[id] = 0;
  });
  if (catalog.fuels[startFuel]) {
    state.kgByFuel[startFuel] = startKg;
  }

  function fuelOf(id) {
    return catalog.fuels[id];
  }

  function clampKg(id, next, allowZero) {
    const f = fuelOf(id);
    const bag = f.bagKg;
    let kg = Math.round(Number(next) || 0);
    if (allowZero && kg <= 0) return 0;
    kg = Math.max(100, Math.min(10000, kg));
    kg = Math.round(kg / bag) * bag;
    if (kg < 100) kg = Math.ceil(100 / bag) * bag;
    if (kg > 10000) kg = Math.floor(10000 / bag) * bag;
    return kg;
  }

  function tierFor(id, kg) {
    let current = fuelOf(id).tiers[0];
    fuelOf(id).tiers.forEach(function (tier) {
      if (kg >= tier.minKg) current = tier;
    });
    return current;
  }

  function nextMin(id, minKg) {
    const next = fuelOf(id).tiers.find(function (tier) {
      return tier.minKg > minKg;
    });
    return next ? next.minKg : Infinity;
  }

  function quoteLine(id, kg) {
    kg = clampKg(id, kg, false);
    const f = fuelOf(id);
    const tier = tierFor(id, kg);
    const goods = Math.round(kg * tier.pricePerKg * 100) / 100;
    const first = f.tiers[0];
    const savings = Math.round((first.pricePerKg - tier.pricePerKg) * kg * 100) / 100;
    return {
      fuelId: id,
      fuelName: f.name,
      shortName: f.shortName,
      kg: kg,
      bags: kg / f.bagKg,
      bagKg: f.bagKg,
      palletBags: f.palletBags,
      pricePerKg: tier.pricePerKg,
      tierLabel: tier.label,
      goods: goods,
      savings: savings,
      packing: packingFor(id, kg),
    };
  }

  function freight(kg) {
    if (state.fulfillment === "pickup" || kg <= 0) return 0;
    const pallets = Math.max(1, Math.ceil(kg / 1000));
    let rate = 89;
    for (let i = 0; i < catalog.freightPerPalletEur.length; i += 1) {
      const row = catalog.freightPerPalletEur[i];
      if (row.belowKg === null || kg < row.belowKg) {
        rate = row.eur;
        break;
      }
    }
    return Math.round(rate * pallets * 100) / 100;
  }

  function quoteOrder() {
    const lines = [];
    fuelIds.forEach(function (id) {
      const kg = state.kgByFuel[id];
      if (kg >= 100) lines.push(quoteLine(id, kg));
    });
    const goods = Math.round(lines.reduce(function (sum, line) {
      return sum + line.goods;
    }, 0) * 100) / 100;
    const kg = lines.reduce(function (sum, line) {
      return sum + line.kg;
    }, 0);
    const ship = freight(kg);
    return {
      lines: lines,
      goods: goods,
      kg: kg,
      freight: ship,
      total: Math.round((goods + ship) * 100) / 100,
      shipment: shipmentPacking(lines),
    };
  }

  function packingFor(id, kg) {
    const f = fuelOf(id);
    const euro = catalog.euroPallet || { widthCm: 80, depthCm: 120, maxKg: 200 };
    const big = catalog.industrialPallet || { widthCm: 110, depthCm: 120, altWidthCm: 110, altDepthCm: 110 };
    const bags = kg > 0 ? kg / f.bagKg : 0;
    const disposable = "Paleta je jednorazová, nevratná a v cene tovaru.";
    if (kg <= euro.maxKg) {
      const cap = euro.maxKg / f.bagKg;
      const size = euro.widthCm + " × " + euro.depthCm + " cm";
      return {
        kind: "euro",
        title: "Paleta " + size,
        fraction: bags + " / " + cap,
        fill: cap > 0 ? Math.min(1, bags / cap) : 0,
        note: disposable,
        ladderLabel: size,
      };
    }
    const cap = f.palletBags;
    const extra = bags > 0 && cap > 0 ? Math.max(0, Math.ceil(bags / cap) - 1) : 0;
    const size = big.widthCm + " × " + big.depthCm + " cm";
    const alt = big.altWidthCm + " × " + big.altDepthCm + " cm";
    if (extra > 0) {
      return {
        kind: "industrial",
        title: 1 + extra + " palety " + size,
        fraction: bags + " / " + cap,
        fill: 1,
        note: "Palety sú jednorazové, nevratné a v cene tovaru.",
        ladderLabel: size,
      };
    }
    return {
      kind: "industrial",
      title: "Paleta " + size,
      fraction: bags > 0 ? bags + " / " + cap : "0 / " + cap,
      fill: cap > 0 ? Math.min(1, bags / cap) : 0,
      note: disposable + " Niekedy aj " + alt + ".",
      ladderLabel: size,
    };
  }

  function shipmentPacking(lines) {
    const kg = lines.reduce(function (sum, line) {
      return sum + line.kg;
    }, 0);
    if (kg <= 0) return { title: "", note: "" };
    if (kg <= 200) {
      const size = "80 × 120 cm";
      const names = lines.map(function (line) {
        return line.shortName;
      });
      return {
        title: "1 paleta " + size,
        note:
          lines.length > 1 && names.length > 1
            ? names.join(" a ") +
              " idú spolu. Paleta je jednorazová, nevratná a v cene tovaru."
            : "Paleta je jednorazová, nevratná a v cene tovaru.",
      };
    }
    const count = Math.max(1, Math.ceil(kg / 1000));
    const size = "110 × 120 cm";
    const word = count === 1 ? "paleta" : count <= 4 ? "palety" : "paliet";
    const disposable =
      count === 1
        ? "Paleta je jednorazová, nevratná a v cene tovaru."
        : "Palety sú jednorazové, nevratné a v cene tovaru.";
    return {
      title: count + " " + word + " " + size,
      note: disposable + " Niekedy aj 110 × 110 cm.",
    };
  }
  function renderLadder(card, id, selectedKg) {
    const body = card.querySelector("[data-ladder]");
    if (!body) return;
    const f = fuelOf(id);
    const first = f.tiers[0];
    body.innerHTML = f.tiers
      .map(function (tier) {
        const kg = tier.minKg;
        const bags = kg / f.bagKg;
        const goods = Math.round(kg * tier.pricePerKg * 100) / 100;
        const packing = packingFor(id, kg);
        const on =
          selectedKg >= 100 && selectedKg >= tier.minKg && selectedKg < nextMin(id, tier.minKg)
            ? " is-on"
            : "";
        const perKgSave = first.pricePerKg - tier.pricePerKg;
        const save =
          perKgSave > 0
            ? '<span class="save">−' + money.format(perKgSave) + "/kg</span>"
            : "";
        return (
          "<tr class='" +
          on +
          "'><td>" +
          tier.label +
          '<span class="muted" style="display:block">' +
          packing.ladderLabel +
          "</span></td><td>" +
          bags +
          " × " +
          f.bagKg +
          " kg</td><td>" +
          money.format(tier.pricePerKg) +
          "/kg" +
          save +
          '</td><td class="right">' +
          money.format(goods) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function renderCard(id) {
    const card = root.querySelector('[data-fuel-card="' + id + '"]');
    if (!card) return;
    const f = fuelOf(id);
    const kg = state.kgByFuel[id];
    const included = kg >= 100;
    const q = included ? quoteLine(id, kg) : null;
    card.classList.toggle("is-off", !included);
    const toggle = card.querySelector("[data-fuel-toggle]");
    if (toggle) {
      toggle.textContent = included ? "Odstrániť" : "Pridať od 100 kg";
      toggle.classList.toggle("btn-primary", !included);
      toggle.classList.toggle("btn-outline", included);
    }
    const presets = card.querySelector("[data-presets]");
    if (presets) {
      presets.innerHTML = f.presetsKg
        .map(function (preset) {
          const on = included && q.kg === preset ? " is-on" : "";
          const label = preset >= 1000 ? num.format(preset) + " kg" : preset + " kg";
          return (
            '<button type="button" class="' +
            on +
            '" data-kg="' +
            preset +
            '">' +
            label +
            "</button>"
          );
        })
        .join("");
    }
    const kgLabel = card.querySelector("[data-kg-label]");
    if (kgLabel) kgLabel.textContent = included ? num.format(q.kg) + " kg" : "0 kg";
    const minus = card.querySelector("[data-kg-minus]");
    if (minus) minus.disabled = !included;
    const empty = card.querySelector("[data-fuel-empty]");
    if (empty) empty.hidden = included;
    renderLadder(card, id, included ? q.kg : 0);
    const bagsEl = card.querySelector("[data-fact-bags]");
    if (bagsEl) bagsEl.textContent = included ? q.bags + " × " + q.bagKg + " kg" : "—";
    const goodsEl = card.querySelector("[data-fact-goods]");
    if (goodsEl) {
      if (!included) {
        goodsEl.textContent = "—";
      } else {
        goodsEl.innerHTML =
          money.format(q.pricePerKg) +
          "/kg · " +
          money.format(q.goods) +
          (q.savings > 0
            ? '<span class="save">Ušetríte ' +
              money.format(q.savings) +
              " oproti cene za 100 kg</span>"
            : "");
      }
    }
    const packing = included ? packingFor(id, q.kg) : packingFor(id, 0);
    const meterFill = card.querySelector("[data-meter-fill]");
    if (meterFill) meterFill.style.width = Math.min(100, packing.fill * 100) + "%";
    const meterLabel = card.querySelector("[data-meter-label]");
    if (meterLabel) meterLabel.textContent = packing.title;
    const meterPct = card.querySelector("[data-meter-pct]");
    if (meterPct) meterPct.textContent = packing.fraction;
    const meterNote = card.querySelector("[data-meter-note]");
    if (meterNote) {
      if (!included) {
        meterNote.textContent =
          "Od 100 kg. Paleta je jednorazová, nevratná a v cene tovaru.";
      } else {
        meterNote.textContent = packing.note;
      }
    }
  }

  function vatSplit(gross) {
    const pct = Number(catalog.vatPercent) || 23;
    const net = Math.round((gross / (1 + pct / 100)) * 100) / 100;
    return {
      net: net,
      vat: Math.round((gross - net) * 100) / 100,
      percent: pct,
    };
  }

  function icDphValue() {
    const input = root.querySelector("[name=icDph]");
    return input ? String(input.value || "").replace(/\s+/g, "") : "";
  }

  function isVatPayer() {
    return state.buyerType === "company" && icDphValue().length >= 5;
  }

  function renderLive(order) {
    const empty = root.querySelector("[data-live-empty]");
    const list = root.querySelector("[data-live-lines]");
    if (empty) empty.hidden = order.lines.length > 0;
    if (list) {
      list.innerHTML = order.lines
        .map(function (line) {
          return (
            '<li class="live-line"><div class="live-line-top"><span>' +
            line.fuelName +
            "</span><span>" +
            money.format(line.goods) +
            '</span></div><p class="muted" style="margin:.2rem 0 0">' +
            num.format(line.kg) +
            " kg · " +
            line.bags +
            " × " +
            line.bagKg +
            " kg · " +
            money.format(line.pricePerKg) +
            "/kg</p>" +
            (line.savings > 0
              ? '<p class="save">Ušetríte ' +
                money.format(line.savings) +
                " oproti cene za 100 kg</p>"
              : "") +
            "</li>"
          );
        })
        .join("");
      if (order.shipment && order.shipment.note) {
        list.innerHTML +=
          '<li class="live-line packing"><p class="muted" style="margin:0"><strong>' +
          order.shipment.title +
          "</strong> · " +
          order.shipment.note +
          "</p></li>";
      }
    }
    root.querySelector("[data-live-goods]").textContent = money.format(order.goods);
    root.querySelector("[data-live-freight]").textContent =
      state.fulfillment === "pickup"
        ? "0,00 € (osobný odber)"
        : money.format(order.freight) + " (odhad)";
    root.querySelector("[data-live-total]").textContent = money.format(order.total);
    const split = vatSplit(order.goods);
    const netEl = root.querySelector("[data-live-net]");
    const vatEl = root.querySelector("[data-live-vat]");
    if (netEl) netEl.textContent = money.format(split.net);
    if (vatEl) vatEl.textContent = money.format(split.vat);
    const vatLabel = root.querySelector("[data-live-vat-label]");
    if (vatLabel) vatLabel.textContent = "DPH " + split.percent + " %";
    const payer = isVatPayer();
    root.querySelectorAll("[data-vat-breakdown]").forEach(function (row) {
      row.hidden = !payer;
    });
    const goodsLabel = root.querySelector("[data-live-goods-label]");
    if (goodsLabel) goodsLabel.textContent = payer ? "Tovar s DPH" : "Tovar";
    const vatNote = root.querySelector("[data-live-vat-note]");
    if (vatNote) {
      vatNote.textContent = payer
        ? "Rozpis dane ide na predfaktúru. Dopravu naceníme zvlášť a doplníme do dokladu."
        : "Ceny sú konečné, vrátane DPH. Zľava za množstvo sa na palivá nesčítava. Do predfaktúry ide najprv tovar.";
    }
  }

  function render() {
    fuelIds.forEach(renderCard);
    const order = quoteOrder();
    renderLive(order);
    const linesInput = root.querySelector("[name=lines]");
    if (linesInput) {
      linesInput.value = JSON.stringify(
        order.lines.map(function (line) {
          return { fuelId: line.fuelId, kg: line.kg };
        })
      );
    }
    const fulfillmentInput = root.querySelector("[name=fulfillment]");
    if (fulfillmentInput) fulfillmentInput.value = state.fulfillment;
    const isCompany = state.buyerType === "company";
    const personFields = root.querySelector("[data-person-fields]");
    if (personFields) personFields.classList.toggle("hidden", isCompany);
    const companyName = root.querySelector("[data-company-name]");
    if (companyName) {
      companyName.classList.toggle("hidden", !isCompany);
      if ("hidden" in companyName) companyName.hidden = !isCompany;
    }
    const company = root.querySelector("[data-company-fields]");
    if (company) {
      company.classList.toggle("hidden", !isCompany);
      if ("hidden" in company) company.hidden = !isCompany;
    }
    const contact = root.querySelector("[data-contact-fields]");
    if (contact) {
      contact.classList.toggle("hidden", !isCompany);
      if ("hidden" in contact) contact.hidden = !isCompany;
    }
    const firstName = root.querySelector("[name=firstName]");
    const lastName = root.querySelector("[name=lastName]");
    const nameInput = root.querySelector("[name=name]");
    const contactFirst = root.querySelector("[name=contactFirstName]");
    const contactLast = root.querySelector("[name=contactLastName]");
    if (firstName) firstName.required = !isCompany;
    if (lastName) lastName.required = !isCompany;
    if (nameInput) nameInput.required = isCompany;
    if (contactFirst) contactFirst.required = isCompany;
    if (contactLast) contactLast.required = isCompany;
    const hint = root.querySelector("[data-buyer-hint]");
    if (hint) {
      hint.textContent = isCompany
        ? "Firma alebo živnosť: názov firmy, IČO a kontaktná osoba (meno + priezvisko). DIČ voliteľné. IČ DPH len ak ste platca DPH."
        : "Fyzická osoba: meno a priezvisko zvlášť — priezvisko na oslovenie v maili. Ceny v súhrne sú konečné, vrátane DPH.";
    }
    root.dispatchEvent(new Event("vulcanus-render"));
  }

  root.addEventListener("click", function (event) {
    const toggle = event.target.closest("[data-fuel-toggle]");
    if (toggle) {
      event.preventDefault();
      const card = toggle.closest("[data-fuel-card]");
      const id = card.getAttribute("data-fuel-card");
      state.kgByFuel[id] = state.kgByFuel[id] >= 100 ? 0 : 100;
      render();
      return;
    }
    const minus = event.target.closest("[data-kg-minus]");
    if (minus) {
      event.preventDefault();
      const card = minus.closest("[data-fuel-card]");
      const id = card.getAttribute("data-fuel-card");
      const bag = fuelOf(id).bagKg;
      const current = state.kgByFuel[id];
      state.kgByFuel[id] = current <= 100 ? 0 : clampKg(id, current - bag, true);
      render();
      return;
    }
    const plus = event.target.closest("[data-kg-plus]");
    if (plus) {
      event.preventDefault();
      const card = plus.closest("[data-fuel-card]");
      const id = card.getAttribute("data-fuel-card");
      const bag = fuelOf(id).bagKg;
      const current = state.kgByFuel[id];
      state.kgByFuel[id] = current < 100 ? 100 : clampKg(id, current + bag, false);
      render();
      return;
    }
    const kgBtn = event.target.closest("button[data-kg]");
    if (kgBtn) {
      event.preventDefault();
      const card = kgBtn.closest("[data-fuel-card]");
      const id = card.getAttribute("data-fuel-card");
      state.kgByFuel[id] = Number(kgBtn.getAttribute("data-kg"));
      render();
    }
  });

  root.querySelectorAll("[name=fulfillmentChoice]").forEach(function (input) {
    input.addEventListener("change", function () {
      state.fulfillment = input.value;
      render();
    });
  });
  root.querySelectorAll("[name=buyerType]").forEach(function (input) {
    input.addEventListener("change", function () {
      state.buyerType = input.value;
      render();
    });
  });
  const icDphInput = root.querySelector("[name=icDph]");
  if (icDphInput) {
    icDphInput.addEventListener("input", render);
  }

  const form = root.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const err = root.querySelector("[data-form-error]");
    err.classList.add("hidden");
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      body.lines = JSON.parse(body.lines || "[]");
    } catch (error) {
      body.lines = [];
    }
    body.binding = root.querySelector("[name=binding]").checked;
    if (state.buyerType === "company") {
      body.firstName = "";
      body.lastName = "";
      body.name = String(body.name || "").trim();
    } else {
      body.ico = "";
      body.dic = "";
      body.icDph = "";
      body.contactFirstName = "";
      body.contactLastName = "";
      body.name = [body.firstName, body.lastName]
        .map(function (part) {
          return String(part || "").trim();
        })
        .filter(Boolean)
        .join(" ");
    }
    try {
      const response = await fetch(root.getAttribute("data-order-url"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!result.ok) {
        err.textContent = result.error || "Objednávku sa nepodarilo odoslať.";
        err.classList.remove("hidden");
        return;
      }
      window.location.href = root.getAttribute("data-done-url") + "?order=" + encodeURIComponent(result.orderId);
    } catch (error) {
      err.textContent = "Spojenie zlyhalo.";
      err.classList.remove("hidden");
    }
  });

  render();
  bindLiveCompanion(root);
})();

function bindLiveCompanion(root) {
  const live = root.querySelector("[data-live-panel]") || root.querySelector(".live-body");
  const track = live && live.closest(".live-track");
  if (!live || !track) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TAU_MOVE = 0.82;
  const TAU_FOLLOW = 0.18;
  const MOVE_START = 56;

  let lastWindow = null;
  let currentY = 0;
  let targetY = 0;
  let lastTs = 0;
  let raf = 0;
  let cruising = true;
  let ticking = false;
  let snapped = false;

  function splitLayout() {
    const grid = root.querySelector(".grid-2");
    if (!grid) return false;
    const cols = window.getComputedStyle(grid).gridTemplateColumns;
    return cols.split(" ").filter(Boolean).length >= 2;
  }

  function observerTop() {
    let bottom = 12;
    document.querySelectorAll("header, .vd-shared-shell, .vd-shell, .vd-site-shell, .vulcanus-header").forEach(function (el) {
      const style = window.getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "sticky") return;
      const rect = el.getBoundingClientRect();
      if (rect.height < 8 || rect.top > 120) return;
      if (rect.bottom > bottom) bottom = rect.bottom;
    });
    return bottom + 16;
  }

  function workWindows() {
    return Array.prototype.slice.call(root.querySelectorAll("[data-work-window]"));
  }

  function syncTrackHeight() {
    const stack = root.querySelector("[data-work-stack]");
    if (!splitLayout() || !stack) {
      track.style.minHeight = "";
      return;
    }
    track.style.minHeight = stack.offsetHeight + "px";
  }

  function visibleOverlap(win) {
    const rect = win.getBoundingClientRect();
    const top = observerTop();
    const bottom = window.innerHeight - 16;
    return Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
  }

  function pickWindow() {
    const wins = workWindows();
    if (!wins.length) return null;
    const active = document.activeElement;
    if (active && root.contains(active) && active !== document.body) {
      const focused = active.closest("[data-work-window]");
      if (focused && visibleOverlap(focused) > 48) return focused;
    }
    const viewMid = (observerTop() + window.innerHeight) / 2;
    let best = null;
    let bestDist = Infinity;
    wins.forEach(function (win) {
      const overlap = visibleOverlap(win);
      if (overlap < 48) return;
      const rect = win.getBoundingClientRect();
      const mid = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(mid - viewMid);
      if (dist < bestDist) {
        bestDist = dist;
        best = win;
      }
    });
    if (!best) best = wins[0];
    if (lastWindow && lastWindow !== best && lastWindow.isConnected) {
      const lastOverlap = visibleOverlap(lastWindow);
      const lastRect = lastWindow.getBoundingClientRect();
      const lastMid = (lastRect.top + lastRect.bottom) / 2;
      const lastDist = Math.abs(lastMid - viewMid);
      const lastGone = lastOverlap < lastRect.height * 0.18;
      if (!lastGone && lastDist <= bestDist + 140) return lastWindow;
    }
    return best;
  }

  function alignY(win, liveH, trackRect) {
    const wins = workWindows();
    const index = wins.indexOf(win);
    const rect = win.getBoundingClientRect();
    const top = rect.top - trackRect.top;
    if (index <= 0) return top;
    if (index === wins.length - 1) return top + rect.height - liveH;
    return top + (rect.height - liveH) / 2;
  }

  function applyY() {
    live.style.marginTop = "0px";
    live.style.transform = "translate3d(0," + currentY + "px,0)";
  }

  function stopLoop() {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    lastTs = 0;
  }

  function loop(ts) {
    raf = 0;
    if (!splitLayout()) return;
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    const dist = targetY - currentY;
    const abs = Math.abs(dist);
    if (reduceMotion.matches || abs < 0.35) {
      currentY = targetY;
      applyY();
      cruising = true;
      lastTs = 0;
      return;
    }
    if (abs > MOVE_START) cruising = false;
    const tau = cruising ? TAU_FOLLOW : TAU_MOVE;
    currentY += dist * (1 - Math.exp(-dt / tau));
    applyY();
    raf = window.requestAnimationFrame(loop);
  }

  function kick() {
    if (!raf) {
      lastTs = 0;
      raf = window.requestAnimationFrame(loop);
    }
  }

  function resetFlow() {
    stopLoop();
    live.style.marginTop = "";
    live.style.transform = "";
    track.style.minHeight = "";
    lastWindow = null;
    currentY = 0;
    targetY = 0;
    cruising = true;
    snapped = false;
  }

  function place() {
    if (!splitLayout()) {
      resetFlow();
      return;
    }
    syncTrackHeight();
    const target = pickWindow();
    if (!target) return;
    const liveH = live.offsetHeight;
    const trackRect = track.getBoundingClientRect();
    const maxY = Math.max(0, track.clientHeight - liveH);
    const viewTop = observerTop();
    const viewBottom = window.innerHeight - 16;
    let y = alignY(target, liveH, trackRect);
    if (trackRect.top + y < viewTop) y = viewTop - trackRect.top;
    if (trackRect.top + y + liveH > viewBottom) {
      y = viewBottom - liveH - trackRect.top;
    }
    y = Math.max(0, Math.min(maxY, y));
    lastWindow = target;
    if (!snapped || reduceMotion.matches) {
      currentY = y;
      targetY = y;
      snapped = true;
      cruising = true;
      applyY();
      return;
    }
    if (Math.abs(y - targetY) < 0.4 && Math.abs(currentY - y) < 0.4) return;
    targetY = y;
    kick();
  }

  function requestPlace() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      place();
    });
  }

  window.addEventListener("scroll", requestPlace, { passive: true, capture: true });
  window.addEventListener("resize", requestPlace);
  root.addEventListener("vulcanus-render", requestPlace);
  root.addEventListener("focusin", requestPlace);
  root.addEventListener("click", requestPlace);
  if (typeof IntersectionObserver === "function") {
    const io = new IntersectionObserver(requestPlace, {
      root: null,
      threshold: [0, 0.15, 0.35, 0.5, 0.7, 1],
    });
    workWindows().forEach(function (win) {
      io.observe(win);
    });
  }
  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(requestPlace);
    const stack = root.querySelector("[data-work-stack]");
    if (stack) ro.observe(stack);
    ro.observe(live);
    ro.observe(track);
    workWindows().forEach(function (win) {
      ro.observe(win);
    });
  }
  place();
}
