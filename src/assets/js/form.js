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

    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form2.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (form2.dataset.sending === "true") return;

        form2.dataset.sending = "true";
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Odesílám…";
        [...form2.elements].forEach(el => el.disabled = true);

        const formData = new FormData(form2);

        try {
            // 1️⃣ Odeslání do Netlify Forms
            await fetch("/", {
                method: "POST",
                body: formData,
            });

            // 2️⃣ Převod formuláře na JSON pro Netlify Function
            const data = Object.fromEntries(formData.entries());

            // 3️⃣ Volání funkce submit.js, která vytvoří .md
            // await fetch("/.netlify/functions/submit", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(data),
            // });

            // 4️⃣ Úspěch – smažeme localStorage a přesměrujeme
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
