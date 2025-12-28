const form1 = document.getElementById("form-1");
const form2 = document.getElementById("form-2");

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
}
else if (form2) {
    const data1 = JSON.parse(localStorage.getItem("form1"));
    if (!data1) window.location.href = "/#objednavka";

    // naplnění hidden inputů z kroku 1
    Object.entries(data1).forEach(([key, value]) => {
        const input = form2.querySelector(`input[name="${key}"]`);
        if (input) input.value = value;
    });

    const dopravaRadios = form2.querySelectorAll('input[name="doprava"]');
    const adresa = form2.querySelector('input[name="adresa"]');
    const submitBtn = form2.querySelector('button[type="submit"], input[type="submit"]');

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

    dopravaRadios.forEach(radio => {
        radio.addEventListener("change", updateAdresa);
    });
    updateAdresa();

    form2.addEventListener("submit", async (e) => {
        form2.querySelectorAll("input, select, textarea, button").forEach(el => el.disabled = true);
        submitBtn.value = "Odesílám poptávku...";

        // pokud už jsme po serverless funkci → necháme submit proběhnout
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
                body: JSON.stringify(data),
            });

            // kontrola HTTP status
            if (!res.ok) {
                const text = await res.text(); // nebo res.json()
                throw new Error(`Chyba serveru: ${res.status} ${text}`);
            }

            // 2️⃣ po úspěchu přesměruj
            localStorage.removeItem("form1");
            window.location.href = "/poptavka-odeslana/";

            form2.dataset.sending = "done";

        } catch (err) {
            console.error("Chyba submit:", err);
            form2.dataset.sending = "false";
            alert("Odeslání se nezdařilo, zkuste to prosím znovu.");
            form2.querySelectorAll("input, select, textarea, button").forEach(el => el.disabled = false;
            submitBtn.value = "Nezávazně poptat";
        }
    });


}
