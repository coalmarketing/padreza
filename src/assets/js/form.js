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
        // pokud už jsme po serverless funkci → necháme submit proběhnout
        if (form2.dataset.sending === "done") {
            return;
        }

        e.preventDefault();

        if (form2.dataset.sending === "true") return;
        form2.dataset.sending = "true";

        const formData = new FormData(form2);
        const data = Object.fromEntries(formData.entries());

        try {
            // 1️⃣ serverless funkce (MD soubor)
            await fetch("/.netlify/functions/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            // 2️⃣ po úspěchu přesměruj RUČNĚ
            localStorage.removeItem("form1");
            window.location.href = "/poptavka-odeslana/";

            // 3️⃣ a mezitím FORM submit (na pozadí)
            form2.dataset.sending = "done";
            // form2.submit();

        } catch (err) {
            console.error("Chyba submit.js:", err);
            form2.dataset.sending = "false";
            alert("Odeslání se nezdařilo, zkuste to prosím znovu.");
        }
    });


}
