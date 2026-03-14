document.addEventListener('DOMContentLoaded', () => {
    // Standard year update
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Contact Obfuscation Protection
    // Genuine users will see the info rendered via JS, basic scrapers will see placeholders
    const e_user = "amolthakre.in";
    const e_domain = "gmail.com";
    const p_country = "+91";
    const p_main = "9591233320";

    const emlLink = document.getElementById('eml-link');
    const phnText = document.getElementById('phn-text');

    if (emlLink) {
        const fullEmail = `${e_user}@${e_domain}`;
        emlLink.href = `mailto:${fullEmail}`;
        emlLink.textContent = fullEmail;
    }

    if (phnText) {
        phnText.textContent = `${p_country}-${p_main}`;
    }
});
