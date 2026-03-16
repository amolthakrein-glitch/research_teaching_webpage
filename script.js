document.addEventListener('DOMContentLoaded', () => {
    // Standard year update
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Contact Obfuscation Protection (Enhanced)
    const data = {
        e_u: "amolthakre.in",
        e_d: "gmail.com",
        p_c: "+91",
        p_m: "9591233320"
    };

    // Multiple Check Validation (Surity Check)
    function verifyContact() {
        const emailValid = data.e_u.includes(".") && data.e_d.includes(".");
        const phoneValid = data.p_m.length === 10;
        return emailValid && phoneValid;
    }

    const emlLink = document.getElementById('eml-link');
    const phnText = document.getElementById('phn-text');

    if (emlLink && phnText && verifyContact()) {
        const fullE = `${data.e_u}@${data.e_d}`;
        const fullP = `${data.p_c}-${data.p_m}`;

        // Initial Masked State
        emlLink.textContent = `a...e@${data.e_d.split('.')[0]}...m`;
        phnText.textContent = `${data.p_c}-9...20`;

        // Click to Reveal & Activate
        emlLink.addEventListener('mouseenter', () => {
            emlLink.textContent = fullE;
            emlLink.href = `mailto:${fullE}`;
        });

        phnText.style.cursor = 'pointer';
        phnText.addEventListener('click', () => {
            phnText.textContent = fullP;
        });

        // Fail-safe check
        if (!verifyContact()) {
            console.error("Contact data integrity check failed.");
            emlLink.textContent = "Contact Admin (Security Check Required)";
        }
    }

    // Visit Logging Tracking
    async function logVisit() {
        try {
            await fetch('/api/log_visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: window.location.pathname,
                    referrer: document.referrer
                })
            });
        } catch (e) {
            // Silently fail if server is not reachable
        }
    }
    logVisit();
});
