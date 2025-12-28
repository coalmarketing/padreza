import fetch from "node-fetch";
import nodemailer from "nodemailer";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const now = new Date();

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const m = String(now.getMonth() + 1);
        const d = String(now.getDate());
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const domain = process.env.SITE_URL || "https://www.padreza.cz";
        const filename = `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}.md`;
        const path = `src/content/i18n/cs/poptavky/${filename}`;

        const content = `---
title: "${yyyy}-${mm}-${dd} v ${hh}:${min} - ${data.jmeno || ""}"
lang: "cs"
date: "${now.toISOString()}"
status: "nová poptávka"
datum: "${d}.${m}.${yyyy}"
cas: "${hh}:${min}:${ss}"
jmeno: "${data.jmeno || ""}"
telefon: "${data.telefon || ""}"
mail: "${data.mail || ""}"
delka: "${data.delka || ""}"
drevo: "${data.drevo || ""}"
suchost: "${data.suchost || ""}"
doprava: "${data.doprava || ""}"
adresa: "${data.adresa || ""}"
mnozstvi: "${data.mnozstvi || ""} prms"
poznamka: "${data.poznamka || ""}"
---
`;

        // 1️⃣ Uložení do GitHubu
        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `Nová poptávka ${filename}`,
                    content: Buffer.from(content).toString("base64"),
                }),
            }
        );

        if (!res.ok) throw new Error(await res.text());

        // 2️⃣ Odeslání emailu
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Poptávky Padřeza" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_TO,
            cc: data.mail ? data.mail : undefined,
            replyTo: data.mail || process.env.MAIL_USER,
            subject: `📩 Nová nezávazná poptávka – ${data.jmeno || "anonymní"}`,
            html: `
                <h2>Nezávazná poptávka palivového dřeva Padřeza</h2>
                <h3>Zákazník</h3>
                <ul>
                    <li><b>Jméno:</b> ${data.jmeno || "---"}</li>
                    <li><b>Telefon:</b> ${data.telefon || "---"}</li>
                    <li><b>Email:</b> ${data.mail || "---"}</li>
                </ul>
                <h3>Požadavek</h3>
                <ul>
                    <li><b>Množství:</b> ${data.mnozstvi || "---"}</li>
                    <li><b>Dřevo:</b> ${data.drevo || "---"}</li>
                    <li><b>Suchost:</b> ${data.suchost || "---"}</li>
                    <li><b>Délka:</b> ${data.delka || "---"}</li>
                    <li><b>Doprava:</b> ${data.adresa ? `${data.doprava} &gt; ${data.adresa}` : data.doprava || "---"}</li>
                </ul>
                <p><b>Poznámka:</b><br /> ${data.poznamka || "---"}</p>
                <hr />
                <p>Nezávazná poptávka z webu <a href="${domain}">${domain}</a> ze dne ${d}.${m}.${yyyy} v ${hh}:${min}:${ss} hodin.</p>
            `,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, filename }),
        };
    } catch (err) {
        console.error("Chyba při zpracování poptávky", err);
        console.error(JSON.stringify({ error: err.message }));
        return {
            statusCode: 500,
            body: "Poptávku se nepodařilo zpracovat",
        };
    }
}