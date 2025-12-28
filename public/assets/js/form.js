(() => {
  // src/assets/js/form.js
  var form1 = document.getElementById("form-1");
  var form2 = document.getElementById("form-2");
  if (form1) {
    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form1.checkValidity()) {
        form1.reportValidity();
        return;
      }
      const data = Object.fromEntries(new FormData(form1));
      localStorage.setItem("form1", JSON.stringify(data));
      window.location.href = "/poptavka/";
    });
  } else if (form2) {
    let updateAdresa = function() {
      const selected = form2.querySelector('input[name="doprava"]:checked');
      if (!selected) return;
      if (selected.value === "vlastn\xED") {
        adresa.style.display = "none";
        adresa.required = false;
        adresa.value = "";
      } else {
        adresa.style.display = "";
        adresa.required = true;
      }
    };
    updateAdresa2 = updateAdresa;
    const data1 = JSON.parse(localStorage.getItem("form1"));
    if (!data1) window.location.href = "/#objednavka";
    Object.entries(data1).forEach(([key, value]) => {
      const input = form2.querySelector(`input[name="${key}"]`);
      if (input) input.value = value;
    });
    const dopravaRadios = form2.querySelectorAll('input[name="doprava"]');
    const adresa = form2.querySelector('input[name="adresa"]');
    const submitBtn = form2.querySelector('button[type="submit"], input[type="submit"]');
    dopravaRadios.forEach((radio) => {
      radio.addEventListener("change", updateAdresa);
    });
    updateAdresa();
    form2.addEventListener("submit", async (e) => {
      form2.querySelectorAll("input, select, textarea, button").forEach((el) => el.disabled = true);
      submitBtn.value = "Odes\xEDl\xE1m popt\xE1vku...";
      if (form2.dataset.sending === "done") return;
      e.preventDefault();
      if (form2.dataset.sending === "true") return;
      form2.dataset.sending = "true";
      const formData = new FormData(form2);
      const data = Object.fromEntries(formData.entries());
      try {
        const res = await fetch("/.netlify/functions/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Chyba serveru: ${res.status} ${text}`);
        }
        localStorage.removeItem("form1");
        window.location.href = "/poptavka-odeslana/";
        form2.dataset.sending = "done";
      } catch (err) {
        console.error("Chyba submit:", err);
        form2.dataset.sending = "false";
        alert("Odesl\xE1n\xED se nezda\u0159ilo, zkuste to pros\xEDm znovu.");
        form2.querySelectorAll("input, select, textarea, button").forEach((el) => el.disabled = false);
        submitBtn.value = "Nez\xE1vazn\u011B poptat";
      }
    });
  }
  var updateAdresa2;
})();
//# sourceMappingURL=form.js.map
