// -------------------------------
// FORM 1 – první krok
// -------------------------------
const form1 = document.getElementById("form-1");
const form2 = document.getElementById("form-2");

// -------------------------------
// KROK 1 – odeslání + redirect
// -------------------------------
if (form1) {
    form1.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form1.checkValidity()) {
            form1.reportValidity();
            return;
        }

        const data = Object.fromEntries(new FormData(form1));
        console.log(data);
        localStorage.setItem("form1", JSON.stringify(data));

        // okamžitý přechod na krok 2
        window.location.href = "/poptavka/";
    });
}


// -------------------------------
// KROK 2 – načtení a odeslání
// -------------------------------
if (form2) {
    const submitBtn = form2.querySelectorAll('[type="submit"]');
    const waitForData = async (timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const data = JSON.parse(localStorage.getItem("form1"));
            if (data) return data;
            await new Promise(r => setTimeout(r, 100));
        }
        return null;
    };

    (async () => {
        const data1 = await waitForData();

        if (!data1) {
            alert("Nepodařilo se načíst data formuláře.");
            window.location.href = "/";
            return;
        }

        // Pokud ještě nemáme ID, odeslat data
        if (!data1.id) {
            try {
                const res = await fetch("/.netlify/functions/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data1),
                });

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt);
                }

                const json = await res.json();
                data1.id = json.id;

                // uložit id zpět do localStorage
                localStorage.setItem("form1", JSON.stringify(data1));
            } catch (err) {
                console.error("Chyba při submitu Form 1:", err);
                alert("Odeslání se nezdařilo, zkuste to prosím znovu.");
            } finally {
                submitBtn.value = "Odeslat poptávku";
            }
        }

        // naplnění inputů daty (ať už po submitu, nebo po refreshi)
        Object.entries(data1).forEach(([key, value]) => {
            const input = form2.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
        });
    })();

    // přepínání dopravy
    const dopravaRadios = form2.querySelectorAll('input[name="doprava"]');
    const adresa = form2.querySelector('input[name="adresa"]');

    function updateAdresa() {
        const selected = form2.querySelector('input[name="doprava"]:checked');
        if (!selected) return;

        if (selected.value === "vlastní") {
            adresa.style.display = "none";
            adresa.required = false;
            adresa.value = "";
        } else {
            adresa.style.display = "";
            adresa.required = true;
        }
    }

    dopravaRadios.forEach(r => r.addEventListener("change", updateAdresa));
    updateAdresa();

    // -------------------------------
    // ODESLÁNÍ KONEČNÉHO FORMULÁŘE
    // -------------------------------
    form2.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (form2.dataset.sending === "true") return;
        form2.dataset.sending = "true";

        const data = Object.fromEntries(new FormData(form2));

        form2.querySelectorAll("input, select, textarea, button")
            .forEach(el => el.disabled = true);

        submitBtn.value = "Odesílám...";

        try {
            const res = await fetch("/.netlify/functions/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt);
            }

            localStorage.removeItem("form1");
            window.location.href = "/poptavka-odeslana/";

        } catch (err) {
            console.error("Chyba odeslání:", err);
            alert("Odeslání se nezdařilo. Zkuste to prosím znovu.");

            form2.dataset.sending = "false";
            form2.querySelectorAll("input, select, textarea, button")
                .forEach(el => el.disabled = false);

            submitBtn.value = "Odeslat poptávku";
        }
    });
}