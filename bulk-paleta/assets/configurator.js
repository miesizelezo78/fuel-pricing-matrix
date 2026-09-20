(function () {
  const root = document.querySelector("[data-vulcanus-bulk]");
  if (!root) return;

  const catalog = JSON.parse(root.getAttribute("data-catalog"));
  const money = new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
  });

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
    };
  }

  function render() {
    const q = quote();
    root.querySelectorAll("[data-fuel-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-fuel-btn") === state.fuelId ? "true" : "false");
      btn.classList.toggle("is-on", btn.getAttribute("data-fuel-btn") === state.fuelId);
    });
    const presets = root.querySelector("[data-presets]");
    presets.innerHTML = fuel()
      .presetsKg.map(function (kg) {
        const on = q.kg === kg ? " is-on" : "";
        const label = kg === 1000 ? "1 000 kg" : kg + " kg";
        return '<button type="button" class="' + on + '" data-kg="' + kg + '">' + label + "</button>";
      })
      .join("");
    root.querySelector("[data-kg-label]").textContent = new Intl.NumberFormat("sk-SK").format(q.kg) + " kg";
    root.querySelector("[data-live-fuel]").textContent = q.fuelName + " · " + q.bags + " × " + q.bagKg + " kg · " + q.tierLabel;
    root.querySelector("[data-live-perkg]").textContent = money.format(q.pricePerKg) + "/kg";
    root.querySelector("[data-live-goods]").textContent = money.format(q.goods);
    root.querySelector("[data-live-freight]").textContent =
      state.fulfillment === "pickup" ? "0,00 € (osobný odber)" : money.format(q.freight) + " (odhad)";
    root.querySelector("[data-live-total]").textContent = money.format(q.total);
    root.querySelector("[name=fuelId]").value = state.fuelId;
    root.querySelector("[name=kg]").value = String(q.kg);
    root.querySelector("[name=fulfillment]").value = state.fulfillment;
    const company = root.querySelector("[data-company-fields]");
    if (company) company.hidden = state.buyerType !== "company";
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
    err.hidden = true;
    const body = Object.fromEntries(new FormData(form).entries());
    body.kg = Number(body.kg);
    body.binding = root.querySelector("[name=binding]").checked;
    const endpoint = root.getAttribute("data-order-url");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!result.ok) {
        err.textContent = result.error || "Objednávku sa nepodarilo odoslať.";
        err.hidden = false;
        return;
      }
      window.location.href = root.getAttribute("data-done-url") + "?order=" + encodeURIComponent(result.orderId);
    } catch (error) {
      err.textContent = "Spojenie zlyhalo.";
      err.hidden = false;
    }
  });

  render();
})();
