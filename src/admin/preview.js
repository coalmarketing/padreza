const h = window.h;

CMS.registerPreviewTemplate("poptavky", ({ entry }) => {
    const data = entry.get("data").toJS();

    return h(
        "div",
        { style: { fontFamily: "sans-serif", padding: "1rem" } },

        h("h2", null, "Poptávka"),

        h("p", null, h("strong", null, "Stav: "), data.status),
        h("p", null, h("strong", null, "Datum: "), data.date),
        h("p", null, h("strong", null, "Jméno: "), data.jmeno),
        h("p", null, h("strong", null, "Telefon: "), data.telefon),
        h("p", null, h("strong", null, "E-mail: "), data.mail),

        h("hr"),

        h("p", null, h("strong", null, "Délka: "), data.delka),
        h("p", null, h("strong", null, "Dřevo: "), data.drevo),
        h("p", null, h("strong", null, "Suchost: "), data.suchost),
        h("p", null, h("strong", null, "Doprava: "), data.doprava),
        h("p", null, h("strong", null, "Adresa: "), data.adresa || "—"),
        h("p", null, h("strong", null, "Množství: "), data.mnozstvi),

        h("hr"),

        h("p", null, h("strong", null, "Poznámka:")),
        h("p", null, data.poznamka || "—"),

        h("hr"),

        h("p", null, h("strong", null, "Interní komentář:")),
        h("p", null, data.komentar || "—")
    );
});
