// netlify/functions/submit.js
import fetch from "node-fetch"; // pokud potřebuješ

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const now = new Date();

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        const filename = `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}.md`;
        const path = `src/content/i18n/cs/poptavky/${filename}`;

        const content = `---
title: "${yyyy}-${mm}-${dd}_${hh}-${min}-${ss} - ${data.jmeno || ""}"
status: "nová poptávka"
lang: "cs"
date: "${now.toISOString()}"
jmeno: "${data.jmeno || ""}"
telefon: "${data.telefon || ""}"
mail: "${data.mail || ""}"
delka: "${data.delka || ""}"
drevo: "${data.drevo || ""}"
suchost: "${data.suchost || ""}"
doprava: "${data.doprava || ""}"
adresa: "${data.adresa || ""}"
mnozstvi: "${data.mnozstvi || ""}"
poznamka: "${data.poznamka || ""}"
---
`;

        const encoded = Buffer.from(content).toString("base64");

        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/vnd.github+json",
                },
                body: JSON.stringify({
                    message: `Nová poptávka ${filename}`,
                    content: encoded,
                }),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, filename }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Chyba při ukládání souboru" }),
        };
    }
};
