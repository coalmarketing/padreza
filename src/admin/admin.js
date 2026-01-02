// admin.js nebo vlastní custom JS
const observer = new MutationObserver(() => {
    const headerNav = document.querySelector('header nav');
    if (headerNav) {
        headerNav.remove();      // odstraní celé menu
        observer.disconnect();   // přestane pozorovat DOM
    }
});
observer.observe(document.body, { childList: true, subtree: true });

if (window.CMS) {
    window.CMS.registerEventListener({
        name: "postSave",
        handler: () => {
            setTimeout(() => {
                const hash = window.location.hash;
                const match = hash.match(
                    /#\/collections\/([^/]+)\/entries\/([^/]+)/
                );

                if (!match) return;

                const collection = match[1];
                const base = window.location.pathname.split("#")[0];

                // 1️⃣ Přesměruj na seznam kolekce
                window.location.href = `${base}#/collections/${collection}`;

                // 2️⃣ Po malém delay udělej full reload → načte nová data
                setTimeout(() => {
                    window.location.reload();
                }, 100); // 300ms delay je většinou dostatečné
            }, 200); // 200ms delay po postSave, aby se CMS stihlo uložit
        },
    });
}