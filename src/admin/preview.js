CMS.registerPreviewTemplate("poptavky", ({ entry }) => {
    const data = entry.get("data").toJS();

    return `
    <div style="font-family: sans-serif; padding: 1rem">
      <h2>Poptávka</h2>

      <p><strong>Stav:</strong> ${data.status}</p>

      <p><strong>Datum:</strong> ${data.date}</p>
      <p><strong>Jméno:</strong> ${data.jmeno}</p>
      <p><strong>Telefon:</strong> ${data.telefon}</p>
      <p><strong>E-mail:</strong> ${data.mail}</p>

      <hr />

      <p><strong>Délka:</strong> ${data.delka}</p>
      <p><strong>Dřevo:</strong> ${data.drevo}</p>
      <p><strong>Suchost:</strong> ${data.suchost}</p>
      <p><strong>Doprava:</strong> ${data.doprava}</p>
      <p><strong>Adresa:</strong> ${data.adresa || "—"}</p>
      <p><strong>Množství:</strong> ${data.mnozstvi}</p>

      <hr />

      <p><strong>Poznámka:</strong></p>
      <p>${data.poznamka || "—"}</p>

      <hr />

      <p><strong>Interní komentář:</strong></p>
      <p>${data.komentar || "—"}</p>
    </div>
  `;
});
