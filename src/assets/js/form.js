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

    Object.entries(data1).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form2.appendChild(input);
    });

    const submitBtn = form2.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    form2.addEventListener("submit", (e) => {
        // zabrání opakovanému submitu
        if (form2.dataset.sending === "true") return;
        // UI stav – odesílání
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Odesílám…";
        // deaktivuj všechny inputy
        [...form2.elements].forEach(el => el.disabled = true);
        // zabránit duplicitnímu submitu
    });


}


