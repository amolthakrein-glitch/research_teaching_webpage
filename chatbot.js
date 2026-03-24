(function() {
    /**
     * PROMPT: ADMISSIONS AND MENTORING ASSISTANT
     * Role: Answer clearly about programs, batches, fees, mentorship, and contact.
     * Logic:
     * 1. Detect fresh intent before continuing any lead capture stage.
     * 2. Give direct fee answers before requesting details.
     * 3. Log each user request so admissions interest is captured even without form completion.
     */

    const c_e_u = "amolthakre.in";
    const c_e_d = "gmail.com";
    const c_p_f = "919591233320";
    const c_p_d = "+91-9591233320";

    const knowledgeBase = {
        mentor: {
            name: "Dr. Amol Kumar Thakre",
            title: "Ex-GE Senior Research Scientist & Elite JEE/NEET Mentor",
            credentials: "Ph.D. from University of Twente (Netherlands), Masters from IISc Bangalore (Chemical Engineering).",
            experience: "Industry R&D background at GE/BHGE and Equinor (Norway). Teaching since 2020.",
            philosophy: "Concept-to-Competition pipeline: focus on concept intuition, rigorous problem sets, and timed execution."
        },
        programs: {
            tracks: [
                "JEE Main & Advanced",
                "NEET Physics & Chemistry",
                "Class 11-12 Boards (PCM/PCB)",
                "Class 8-10 Foundation"
            ],
            batches: {
                spring: "JEE/NEET/Mentoring registration: Mid-March / April enrollment open.",
                summer: "Academic Session Batch: June.",
                rolling: "Mid-session admission is possible only if seats are available. Batches are kept small for quality."
            },
            methodology: "Industrial R&D Logic Flow, Weekly Hard-Mode Tests, Chapter-wise Analytics, and Scientific Error Correction."
        },
        location: {
            address: "Mahaveer Promenade, Whitefield, Bangalore.",
            type: "Offline intensive sessions."
        },
        fees: {
            startingPoint: "Fees can start from around Rs 15,000 for a short-term engagement of about 3 months.",
            qualifier: "There is no fixed upper slab because fees are engagement-specific and depend on the class, subjects, duration, batch size, and mentoring depth."
        }
    };

    let state = {
        stage: "idle",
        context: { student_name: "", class_mix: "", mobile: "", mode: "Offline" }
    };

    function initChatbot() {
        if (document.getElementById("chatbot-container")) return;

        const container = document.createElement("div");
        container.id = "chatbot-container";
        container.innerHTML = `
            <button id="chatbot-button">🎓</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="bot-info">
                        <div class="bot-avatar">🏛️</div>
                        <div>
                            <div style="font-weight:800; color:#1e293b; font-size:14px;">Academic Advisor</div>
                            <div style="font-size:10px; color:#10b981;">● Online Counselor</div>
                        </div>
                    </div>
                    <span id="chatbot-close" style="cursor:pointer; font-size:24px; color:#94a3b8;">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div class="typing-indicator" id="typing">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Ask about batches, fees, JEE/NEET, or contact...">
                    <button id="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const msgs = document.getElementById("chatbot-messages");
        const input = document.getElementById("chatbot-input");
        const send = document.getElementById("chatbot-send");
        const win = document.getElementById("chatbot-window");
        const type = document.getElementById("typing");

        function addMsg(text, typeName, options = null) {
            const d = document.createElement("div");
            d.className = `chat-message ${typeName}-message`;
            d.innerHTML = text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            msgs.appendChild(d);

            if (options) {
                const g = document.createElement("div");
                g.className = "options-grid";
                options.forEach((option) => {
                    const normalized = typeof option === "string" ? { label: option, value: option } : option;
                    const b = document.createElement("button");
                    b.className = "opt-btn";
                    b.innerText = normalized.label;
                    b.onclick = () => {
                        if (normalized.action === "whatsapp") {
                            openWhatsApp(normalized.value || defaultWhatsAppMessage());
                            return;
                        }
                        if (normalized.action === "call") {
                            window.location.href = `tel:+${c_p_f}`;
                            return;
                        }
                        state.stage = "idle";
                        input.value = normalized.value;
                        handleIn();
                    };
                    g.appendChild(b);
                });
                msgs.appendChild(g);
            }
            msgs.scrollTop = msgs.scrollHeight;
        }

        function validatePhone(phone) {
            const normalized = phone.replace(/\s/g, "").replace("+91", "");
            return /^[0-9]{10}$/.test(normalized);
        }

        async function postJson(url, data) {
            try {
                await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            } catch (e) {}
        }

        async function logEnquiry(data) {
            await postJson("/api/register", data);
        }

        async function logChatRequest(payload) {
            await postJson("/api/log_chat_request", payload);
        }

        function defaultWhatsAppMessage() {
            const name = state.context.student_name || "Student";
            const track = state.context.class_mix || "program details";
            return `Hello Dr. Amol, I want to enquire about ${track}. Name: ${name}. Please share the details.`;
        }

        function openWhatsApp(message) {
            window.open(`https://wa.me/${c_p_f}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
        }

        function buildContactOptions() {
            return [
                { label: "Open WhatsApp Chat", action: "whatsapp", value: defaultWhatsAppMessage() },
                { label: "Call Now", action: "call" },
                { label: "Batch Timings", value: "Batch Timings" }
            ];
        }

        function detectIntent(q) {
            if (q.includes("who") || q.includes("mentor") || q.includes("amol") || q.includes("credentials") || q.includes("background") || q.includes("info")) return "mentor";
            if (q.includes("fee") || q.includes("fees") || q.includes("cost") || q.includes("price") || q.includes("charges") || q.includes("pricing")) return "fees";
            if (q.includes("enroll") || q.includes("register") || q.includes("join") || q.includes("admission")) return "registration";
            if (q.includes("batch") || q.includes("start") || q.includes("date") || q.includes("when")) return "batches";
            if (q.includes("teach") || q.includes("method") || q.includes("how") || q.includes("logic")) return "methodology";
            if (q.includes("contact") || q.includes("call") || q.includes("email") || q.includes("phone") || q.includes("mobile") || q.includes("whatsapp")) {
                if (state.stage !== "awaiting_phone") return "contact";
            }
            if (q.includes("location") || q.includes("address") || q.includes("where") || q.includes("place")) return "location";
            return null;
        }

        function handleIn() {
            const v = input.value.trim();
            if (!v) return;
            addMsg(v, "user");
            input.value = "";
            type.style.display = "block";
            msgs.scrollTop = msgs.scrollHeight;

            setTimeout(() => {
                type.style.display = "none";
                processInput(v);
            }, 600);
        }

        function processInput(text) {
            const q = text.toLowerCase();
            const detectedIntent = detectIntent(q);

            logChatRequest({
                page: window.location.pathname,
                intent: detectedIntent || state.stage || "general",
                message: text,
                student_name: state.context.student_name,
                class_mix: state.context.class_mix,
                mobile: state.context.mobile
            });

            if (detectedIntent && state.stage !== "idle") {
                state.stage = "idle";
            }

            if (detectedIntent === "mentor") {
                addMsg(
                    `<b>${knowledgeBase.mentor.name}</b> is an ${knowledgeBase.mentor.title}. He has a <b>${knowledgeBase.mentor.credentials}</b> and brings ${knowledgeBase.mentor.experience}`,
                    "bot",
                    ["Teaching Methodology", "Batch Timings"]
                );
                return;
            }

            if (detectedIntent === "fees") {
                addMsg(
                    `${knowledgeBase.fees.startingPoint}\n\n${knowledgeBase.fees.qualifier}\n\nFor exact pricing and seat availability, please contact <b>${c_p_d}</b> on WhatsApp/call or email <b>${c_e_u}@${c_e_d}</b>.`,
                    "bot",
                    buildContactOptions()
                );
                return;
            }

            if (detectedIntent === "registration") {
                state.stage = "awaiting_name";
                addMsg(
                    `I can help with admission. Fees are engagement-specific, and the right plan depends on the student's class, subjects, and duration.\n\nPlease share the student's name to log the request, or use WhatsApp directly for faster coordination.`,
                    "bot",
                    buildContactOptions()
                );
                return;
            }

            if (detectedIntent === "batches") {
                addMsg(
                    `<b>Academic Intake (Whitefield Center):</b>\n• <b>JEE/NEET/Mentoring registration:</b> Mid-March/April\n• <b>Academic Session Batch:</b> June\n• <b>Mid-session admission:</b> Only if seats are available\n\nSeats are limited because mentoring is kept in small batches.`,
                    "bot",
                    ["Check Availability", "Location Details", { label: "Open WhatsApp Chat", action: "whatsapp", value: "Hello Dr. Amol, I want to check batch availability and admission details." }]
                );
                return;
            }

            if (detectedIntent === "methodology") {
                addMsg(
                    `Our <b>Concept-to-Competition</b> pipeline applies industrial R&D logic to exam preparation, with concept building, rigorous problem sets, weekly tests, analytics, and timed execution.`,
                    "bot",
                    ["Dr. Amol's Credentials", "Fees", { label: "Open WhatsApp Chat", action: "whatsapp", value: "Hello Dr. Amol, I want to understand the teaching methodology and mentoring format." }]
                );
                return;
            }

            if (detectedIntent === "contact") {
                addMsg(
                    `You can contact the admissions desk directly on <b>${c_p_d}</b> via call or WhatsApp, or email <b>${c_e_u}@${c_e_d}</b>.`,
                    "bot",
                    buildContactOptions()
                );
                openWhatsApp("Hello Dr. Amol, I want to enquire about coaching, fees, and batch availability.");
                return;
            }

            if (detectedIntent === "location") {
                addMsg(
                    `The mentorship lab is located at <b>${knowledgeBase.location.address}</b> with a focus on <b>${knowledgeBase.location.type}</b>.`,
                    "bot",
                    ["Contact Details", "Batch Timings"]
                );
                return;
            }

            if (state.stage === "awaiting_name") {
                state.context.student_name = text;
                state.stage = "awaiting_goal";
                addMsg(`Noted, ${text}. Which program are you targeting?`, "bot", [
                    "JEE Main & Advanced",
                    "NEET (Physics/Chem)",
                    "Class 11-12 Boards",
                    "Class 8-10 Foundation"
                ]);
                return;
            }

            if (state.stage === "awaiting_goal") {
                state.context.class_mix = text;
                state.stage = "awaiting_phone";
                addMsg(
                    `Please share your <b>10-digit mobile number</b>. I will log the enquiry and open WhatsApp so contact can happen immediately.`,
                    "bot",
                    buildContactOptions()
                );
                return;
            }

            if (state.stage === "awaiting_phone") {
                if (validatePhone(text)) {
                    state.context.mobile = text.replace(/\s/g, "");
                    state.stage = "idle";
                    addMsg(
                        `Verified. Your enquiry has been logged. Opening WhatsApp now so you can continue directly with Dr. Amol.`,
                        "bot"
                    );
                    logEnquiry(state.context);
                    openWhatsApp(
                        `Hello Dr. Amol, I am ${state.context.student_name}. I am enquiring about ${state.context.class_mix}. My mobile number is ${state.context.mobile}. Please share details.`
                    );
                    return;
                }

                addMsg(
                    `That does not look like a valid 10-digit mobile number. Please try again, or use the direct contact options below.`,
                    "bot",
                    buildContactOptions()
                );
                return;
            }

            addMsg(
                `I can help with admissions, fees, programs, batches, and contact details. Ask anything directly, or use WhatsApp for a faster response.`,
                "bot",
                ["Fees", "Batches & Admissions", "Dr. Amol's Credentials", { label: "Open WhatsApp Chat", action: "whatsapp", value: defaultWhatsAppMessage() }]
            );
        }

        document.getElementById("chatbot-button").onclick = () => {
            const isVisible = win.style.display === "flex";
            win.style.display = isVisible ? "none" : "flex";
            if (!isVisible && msgs.children.length === 0) {
                setTimeout(() => {
                    processInput("hello");
                }, 500);
            }
        };

        document.getElementById("chatbot-close").onclick = () => {
            win.style.display = "none";
        };
        send.onclick = handleIn;
        input.onkeypress = (e) => {
            if (e.key === "Enter") handleIn();
        };
        setTimeout(() => {
            if (win.style.display !== "flex") document.getElementById("chatbot-button").click();
        }, 2000);
    }

    initChatbot();
})();
