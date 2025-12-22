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
    const data1 = JSON.parse(localStorage.getItem("form1"));
    if (!data1) window.location.href = "/#objednavka";
    Object.entries(data1).forEach(([key, value]) => {
      const input = form2.querySelector(`input[name="${key}"]`);
      if (input) input.value = value;
    });
    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    form2.addEventListener("submit", async (e) => {
      if (form2.dataset.sending === "done") {
        return;
      }
      e.preventDefault();
      if (form2.dataset.sending === "true") return;
      form2.dataset.sending = "true";
      const formData = new FormData(form2);
      const data = Object.fromEntries(formData.entries());
      try {
        await fetch("/.netlify/functions/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        localStorage.removeItem("form1");
        window.location.href = "/poptavka-odeslana/";
        form2.dataset.sending = "done";
        form2.submit();
      } catch (err) {
        console.error("Chyba submit.js:", err);
        form2.dataset.sending = "false";
        alert("Odesl\xE1n\xED se nezda\u0159ilo, zkuste to pros\xEDm znovu.");
      }
    });
  }
})();
//# sourceMappingURL=form.js.map
