const form1 = document.getElementById("form-1");
const form2 = document.getElementById("form-2");

if (form1) {
    form1.addEventListener("submit", (e) => {
        e.preventDefault(); // ❗ nezobrazuje se submit

        // HTML5 validace
        if (!form1.checkValidity()) {
            form1.reportValidity();
            return;
        }
        // sesbírá data z formuláře
        const data = Object.fromEntries(new FormData(form1));
        // uloží do prohlížeče
        localStorage.setItem("form1", JSON.stringify(data));
        // přechod na krok 2
        window.location.href = "/poptavka/";
    });
}
else if (form2) {
    const data1 = JSON.parse(localStorage.getItem("form1"));
    if (!data1) window.location.href = "/#objednavka"; // když někdo přeskočí krok 1 tak ho přesměruj

    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form2.addEventListener("submit", (e) => {
        e.preventDefault();

        // zabrání opakovanému submitu
        if (form2.dataset.sending === "true") return;

        // HTML5 validace
        if (!form2.checkValidity()) {
            form2.reportValidity();
            return;
        }

        form2.dataset.sending = "true";

        // UI stav – odesílání
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Odesílám…";

        // deaktivuj všechny inputy
        [...form2.elements].forEach(el => el.disabled = true);

        // data z kroku 2
        const data2 = Object.fromEntries(new FormData(form2));

        // sloučení s krokem 1
        const data = { ...data1, ...data2 };

        const formData = new FormData();
        formData.append("form-name", "objednavka");

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        fetch("/", {
            method: "POST",
            body: formData,
        })
            .then(() => {
                localStorage.removeItem("form1");
                window.location.href = "/poptavka-odeslana/";
            })
            .catch((error) => {
                console.error("Chyba při odesílání:", error);

                // UI zpět při chybě
                form2.dataset.sending = "false";
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                [...form2.elements].forEach(el => el.disabled = false);

                alert("Odeslání se nezdařilo, zkuste to prosím znovu.");
            });
    });


}


