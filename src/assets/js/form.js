const form1 = document.getElementById("form-1");
const form2 = document.getElementById("form-2");

if (form1) {
    form1.addEventListener("submit", (e) => {
        e.preventDefault();

        // HTML5 validace
        // if (!form1.checkValidity()) {
        //     form1.reportValidity();
        //     return;
        // }

        // sesbírá data z formuláře
        const data = Object.fromEntries(new FormData(form1));
        // uloží do localStorage
        localStorage.setItem("form1", JSON.stringify(data));
        // přechod na krok 2
        window.location.href = "/poptavka/";
    });
}
else if (form2) {
    const data1 = JSON.parse(localStorage.getItem("form1"));
    if (!data1) window.location.href = "/#objednavka"; // přesměrování pokud chybí krok 1

    // vyplnění hidden inputů z kroku 1
    Object.entries(data1).forEach(([key, value]) => {
        const input = form2.querySelector(`input[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });

    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form2.addEventListener("submit", async (e) => {
        e.preventDefault();

        // HTML5 validace
        // if (!form1.checkValidity()) {
        //     form1.reportValidity();
        //     return;
        // }

        if (form2.dataset.sending === "true") return;
        form2.dataset.sending = "true";

        // UI stav – deaktivace a text
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Odesílám…";
        [...form2.elements].forEach(el => (el.disabled = true));

        // data z formuláře (včetně hidden inputů)
        const formData = new FormData(form2);

        try {
            // Odeslání do Netlify Forms
            await fetch("/", {
                method: "POST",
                body: formData,
            });

            // Převod dat do JSON pro Netlify Function
            const data = Object.fromEntries(formData.entries());

            // Volání Netlify Function pro generování .md souboru
            await fetch("/.netlify/functions/submit", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            // 4️⃣ Úspěšné odeslání – odstraníme localStorage a přesměrujeme
            localStorage.removeItem("form1");
            window.location.href = "/poptavka-odeslana/";
        } catch (err) {
            console.error(err);
            form2.dataset.sending = "false";
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            [...form2.elements].forEach(el => (el.disabled = false));
            alert("Odeslání se nezdařilo, zkuste to prosím znovu.");
        }
    });
}
