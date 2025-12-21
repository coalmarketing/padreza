import fs from "fs";
import path from "path";

// funkce přijme POST z formuláře
export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    // 1️⃣ Vytvoření názvu souboru podle časového razítka
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    const filename = `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}.md`;

    // 2️⃣ Frontmatter pro Decap CMS
    const frontmatter = `---
title: "${yyyy}-${mm}-${dd}_${hh}-${min}-${ss} - ${data.jmeno}"
status: "nová poptávka"
date: "${date.toISOString()}"
jmeno: "${data.jmeno}"
telefon: "${data.telefon}"
mail: "${data.mail}"
delka: "${data.delka}"
drevo: "${data.drevo}"
suchost: "${data.suchost}"
doprava: "${data.doprava}"
adresa: "${data.adresa || ""}"
mnozstvi: "${data.mnozstvi}"
poznamka: "${data.poznamka || ""}"
---
`;

    const content = frontmatter + "\n";

    // 3️⃣ Cesta do repozitáře, kde Decap CMS čte soubory
    const filePath = path.join(process.cwd(), "content", "poptavky", filename);

    try {
        fs.writeFileSync(filePath, content);
        console.log("Soubor vytvořen:", filename);
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: "Chyba při vytváření souboru" };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "OK", filename }),
    };
}
