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
      console.log(data);
      fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then((res) => res.json()).then((res) => {
        if (res?.id) {
          localStorage.setItem("form1", JSON.stringify({
            ...data,
            id: res.id
          }));
        }
      }).catch(() => {
      });
      window.location.href = "/poptavka/";
    });
  }
  if (form2) {
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
    const waitForData = async (timeout = 5e3) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const data = JSON.parse(localStorage.getItem("form1"));
        if (data?.id) return data;
        await new Promise((r) => setTimeout(r, 100));
      }
      return null;
    };
    (async () => {
      const data1 = await waitForData();
      if (!data1) {
        alert("Nepoda\u0159ilo se na\u010D\xEDst data formul\xE1\u0159e.");
        window.location.href = "/";
        return;
      }
      Object.entries(data1).forEach(([key, value]) => {
        const input = form2.querySelector(`[name="${key}"]`);
        if (input) input.value = value;
      });
    })();
    const dopravaRadios = form2.querySelectorAll('input[name="doprava"]');
    const adresa = form2.querySelector('input[name="adresa"]');
    const submitBtn = form2.querySelector('[type="submit"]');
    dopravaRadios.forEach((r) => r.addEventListener("change", updateAdresa));
    updateAdresa();
    form2.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form2.dataset.sending === "true") return;
      form2.dataset.sending = "true";
      const data = Object.fromEntries(new FormData(form2));
      form2.querySelectorAll("input, select, textarea, button").forEach((el) => el.disabled = true);
      submitBtn.value = "Odes\xEDl\xE1m...";
      try {
        const res = await fetch("/.netlify/functions/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
        localStorage.removeItem("form1");
        window.location.href = "/poptavka-odeslana/";
      } catch (err) {
        console.error("Chyba odesl\xE1n\xED:", err);
        alert("Odesl\xE1n\xED se nezda\u0159ilo. Zkuste to pros\xEDm znovu.");
        form2.dataset.sending = "false";
        form2.querySelectorAll("input, select, textarea, button").forEach((el) => el.disabled = false);
        submitBtn.value = "Odeslat popt\xE1vku";
      }
    });
  }
  var updateAdresa2;
})();
//# sourceMappingURL=form.js.map
