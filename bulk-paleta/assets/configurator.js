(function () {
  const root = document.querySelector("[data-vulcanus-bulk]");
  if (!root) return;

  const catalog = JSON.parse(root.getAttribute("data-catalog"));
  const money = new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" });
  const num = new Intl.NumberFormat("sk-SK");

  const state = {
    fuelId: root.getAttribute("data-fuel") || "uhlie",
    kg: Number(root.getAttribute("data-kg") || 100),
    fulfillment: "pallet",
    buyerType: "person",
  };

  function fuel() {
    return catalog.fuels[state.fuelId];
  }

  function clampKg(next) {
    const f = fuel();
    const bag = f.bagKg;
    let kg = Math.round(Number(next) || f.presetsKg[0]);
    kg = Math.max(100, Math.min(10000, kg));
    if (f.id === "koks" && kg === 250) kg = 200;
    kg = Math.round(kg / bag) * bag;
    if (f.id === "koks" && (kg === 250 || kg === 240 || kg === 260)) kg = 200;
    if (kg < 100) kg = Math.ceil(100 / bag) * bag;
    return kg;
  }

  function tierFor(kg) {
    let current = fuel().tiers[0];
    fuel().tiers.forEach(function (tier) {
      if (kg >= tier.minKg) current = tier;
    });
    return current;
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

  function quote() {
    const kg = clampKg(state.kg);
    state.kg = kg;
    const tier = tierFor(kg);
    const goods = Math.round(kg * tier.pricePerKg * 100) / 100;
    const ship = freight(kg);
    return {
      kg: kg,
      bags: kg / fuel().bagKg,
      pricePerKg: tier.pricePerKg,
      tierLabel: tier.label,
      goods: goods,
      freight: ship,
      total: Math.round((goods + ship) * 100) / 100,
      fuelName: fuel().name,
      bagKg: fuel().bagKg,
      palletBags: fuel().palletBags,
    };
  }

  function kgSteps() {
    const values = {};
    fuel().presetsKg.forEach(function (kg) {
      values[kg] = true;
    });
    return Object.keys(values)
      .map(Number)
      .sort(function (a, b) {
        return a - b;
      });
  }

  function nextMin(minKg) {
    const next = fuel().tiers.find(function (tier) {
      return tier.minKg > minKg;
    });
    return next ? next.minKg : Infinity;
  }

  function renderLadder(q) {
    const body = root.querySelector("[data-ladder]");
    if (!body) return;
    const first = fuel().tiers[0];
    body.innerHTML = fuel()
      .tiers.map(function (tier) {
        const kg = tier.minKg;
        const bags = kg / fuel().bagKg;
        const goods = Math.round(kg * tier.pricePerKg * 100) / 100;
        const fill = kg / (fuel().bagKg * fuel().palletBags);
        const on = q.kg >= tier.minKg && q.kg < nextMin(tier.minKg) ? " is-on" : "";
        const save =
          tier.pricePerKg < first.pricePerKg
            ? '<span class="muted" style="display:block;font-size:.75rem">−' +
              money.format(first.pricePerKg - tier.pricePerKg) +
              "/kg</span>"
            : "";
        const fillLabel = fill >= 1 ? "Plná paleta" : "Paleta " + Math.round(fill * 100) + " %";
        return (
          "<tr class='" +
          on +
          "'><td>" +
          tier.label +
          '<span class="muted" style="display:block;font-size:.75rem">' +
          fillLabel +
          "</span></td><td>" +
          bags +
          " × " +
          fuel().bagKg +
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

  function render() {
    const q = quote();
    root.querySelectorAll("[data-fuel-btn]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-fuel-btn") === state.fuelId);
    });
    const presets = root.querySelector("[data-presets]");
    if (presets) {
      presets.innerHTML = kgSteps()
        .map(function (kg) {
          const on = q.kg === kg ? " is-on" : "";
          const label = kg >= 1000 ? num.format(kg) + " kg" : kg + " kg";
          return '<button type="button" class="' + on + '" data-kg="' + kg + '">' + label + "</button>";
        })
        .join("");
    }
    const kgLabel = root.querySelector("[data-kg-label]");
    if (kgLabel) kgLabel.textContent = num.format(q.kg) + " kg";
    const koksHint = root.querySelector("[data-koks-hint]");
    if (koksHint) koksHint.hidden = fuel().id !== "koks";
    root.querySelector("[data-live-fuel]").textContent =
      q.fuelName + " · " + q.bags + " × " + q.bagKg + " kg · " + q.tierLabel;
    root.querySelector("[data-live-perkg]").textContent = money.format(q.pricePerKg) + "/kg";
    root.querySelector("[data-live-goods]").textContent = money.format(q.goods);
    root.querySelector("[data-live-freight]").textContent =
      state.fulfillment === "pickup" ? "0,00 € (osobný odber)" : money.format(q.freight) + " (odhad)";
    root.querySelector("[data-live-total]").textContent = money.format(q.total);
    const bagsEl = root.querySelector("[data-fact-bags]");
    if (bagsEl) bagsEl.textContent = q.bags + " × " + q.bagKg + " kg";
    const goodsEl = root.querySelector("[data-fact-goods]");
    if (goodsEl) goodsEl.textContent = money.format(q.pricePerKg) + "/kg · " + money.format(q.goods);
    const frEl = root.querySelector("[data-fact-freight]");
    if (frEl) {
      frEl.textContent =
        state.fulfillment === "pickup"
          ? "Osobný odber, doprava 0 €."
          : money.format(q.freight) + " odhad. Do SuperFaktúry ide zatiaľ tovar.";
    }
    const fill = Math.min(1, q.kg / (q.bagKg * q.palletBags));
    const extra = Math.max(0, q.bags / q.palletBags - 1);
    const meterFill = root.querySelector("[data-meter-fill]");
    if (meterFill) meterFill.style.width = Math.min(100, fill * 100) + "%";
    const meterLabel = root.querySelector("[data-meter-label]");
    if (meterLabel) meterLabel.textContent = "Paleta " + q.palletBags + " vriec · 110 × 120 cm";
    const meterPct = root.querySelector("[data-meter-pct]");
    if (meterPct) meterPct.textContent = Math.round((q.kg / (q.bagKg * q.palletBags)) * 100) + " %";
    const meterNote = root.querySelector("[data-meter-note]");
    if (meterNote) {
      meterNote.textContent =
        extra > 0
          ? "Nad jednu tonu ide ďalšia paleta (+" + Math.ceil(extra) + ")."
          : q.bags + " z " + q.palletBags + " vriec na paletu. Jedna tona = " + q.palletBags + " × " + q.bagKg + " kg.";
    }
    renderLadder(q);
    root.querySelector("[name=fuelId]").value = state.fuelId;
    root.querySelector("[name=kg]").value = String(q.kg);
    root.querySelector("[name=fulfillment]").value = state.fulfillment;
    const company = root.querySelector("[data-company-fields]");
    if (company) company.classList.toggle("hidden", state.buyerType !== "company");
  }

  root.addEventListener("click", function (event) {
    const fuelBtn = event.target.closest("[data-fuel-btn]");
    if (fuelBtn) {
      state.fuelId = fuelBtn.getAttribute("data-fuel-btn");
      state.kg = fuel().presetsKg[0];
      render();
      return;
    }
    const kgBtn = event.target.closest("[data-kg]");
    if (kgBtn) {
      state.kg = Number(kgBtn.getAttribute("data-kg"));
      render();
      return;
    }
    if (event.target.closest("[data-kg-minus]")) {
      state.kg = clampKg(state.kg - 100);
      render();
    }
    if (event.target.closest("[data-kg-plus]")) {
      state.kg = clampKg(state.kg + 100);
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

  const form = root.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const err = root.querySelector("[data-form-error]");
    err.classList.add("hidden");
    const body = Object.fromEntries(new FormData(form).entries());
    body.kg = Number(body.kg);
    body.binding = root.querySelector("[name=binding]").checked;
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
})();
