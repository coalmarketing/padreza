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

        // odeslat asynchronně (neblokovat přesměrování)
        fetch("/.netlify/functions/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(res => {
                if (res?.id) {
                    localStorage.setItem("form1", JSON.stringify({
                        ...data,
                        id: res.id
                    }));
                }
            })
            .catch(() => {
                // tichá chyba – fallback se řeší na druhé stránce
            });

        // okamžitý přechod na krok 2
        window.location.href = "/poptavka/";
    });
}


// -------------------------------
// KROK 2 – načtení a odeslání
// -------------------------------
if (form2) {

    const waitForData = async (timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const data = JSON.parse(localStorage.getItem("form1"));
            if (data?.id) return data;
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

        // naplnění skrytých polí
        Object.entries(data1).forEach(([key, value]) => {
            const input = form2.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
        });
    })();

    // přepínání dopravy
    const dopravaRadios = form2.querySelectorAll('input[name="doprava"]');
    const adresa = form2.querySelector('input[name="adresa"]');
    const submitBtn = form2.querySelector('[type="submit"]');

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