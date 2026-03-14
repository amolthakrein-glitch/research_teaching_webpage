(function() {
    // Obfuscated Contact Data
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
            tracks: ["JEE Main & Advanced", "NEET Physics & Chemistry", "Class 11-12 Boards (PCM/PCB)", "Class 8-10 Foundation"],
            batches: {
                spring: "Early Starter Batch: Mid-March / April.",
                summer: "Academic Session Batch: June.",
                rolling: "Mid-session admission possible only if seats are available (maximum 10 seats per batch for quality)."
            },
            methodology: "Industrial R&D Logic Flow, Weekly Hard-Mode Tests, Chapter-wise Analytics, and Scientific Error Correction."
        },
        location: {
            address: "Mahaveer Promenade, Whitefield, Bangalore.",
            type: "Offline intensive sessions and potentially hybrid/online support."
        }
    };

    let state = { stage: 'idle', context: { student_name: '', class_mix: '', mobile: '', mode: 'Offline', timing: 'Weekday' } };

    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <button id="chatbot-button">🎓</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="bot-info">
                        <div class="bot-avatar">🏛️</div>
                        <div>
                            <div style="font-weight:800; color:#1e293b; font-size:14px;">Admissions & Enquiry</div>
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
                    <input type="text" id="chatbot-input" placeholder="Ask about Batches, Dr. Amol, or Fees...">
                    <button id="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const msgs = document.getElementById('chatbot-messages');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const win = document.getElementById('chatbot-window');
        const type = document.getElementById('typing');

        function addMsg(text, type, options = null) {
            const d = document.createElement('div');
            d.className = `chat-message ${type}-message`;
            d.innerHTML = text.replace(/\n/g, '<br>');
            msgs.appendChild(d);
            
            if (options) {
                const g = document.createElement('div');
                g.className = 'options-grid';
                options.forEach(o => {
                    const b = document.createElement('button');
                    b.className = 'opt-btn';
                    b.innerText = o;
                    b.onclick = () => { input.value = o; handleIn(); };
                    g.appendChild(b);
                });
                msgs.appendChild(g);
            }
            msgs.scrollTop = msgs.scrollHeight;
        }

        function validatePhone(phone) {
            const re = /^[0-9]{10}$/;
            return re.test(phone.replace(/\s/g, '').replace('+91', ''));
        }

        async function logEnquiry(data) {
            try {
                await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (e) {}
        }

        function forwardToWhatsApp(data) {
            const msg = `*New Chatbot Enquiry*%0A*Name:* ${encodeURIComponent(data.student_name)}%0A*Target:* ${encodeURIComponent(data.class_mix)}%0A*Phone:* ${encodeURIComponent(data.mobile)}%0A*Source:* Website Chatbot`;
            window.open(`https://wa.me/${c_p_f}?text=${msg}`, '_blank');
        }

        function handleIn() {
            const v = input.value.trim();
            if (!v) return;
            addMsg(v, 'user');
            input.value = '';
            type.style.display = 'block';
            msgs.scrollTop = msgs.scrollHeight;

            setTimeout(() => {
                type.style.display = 'none';
                processInput(v);
            }, 1000);
        }

        function processInput(text) {
            const q = text.toLowerCase();

            if (state.stage === 'awaiting_name') {
                state.context.student_name = text;
                state.stage = 'awaiting_goal';
                addMsg(`Pleasure to meet you, ${text}! Which program are you interested in? (JEE, NEET, or Foundation?)`, 'bot', ["JEE", "NEET", "Class 8-10 Foundation"]);
                return;
            }
            if (state.stage === 'awaiting_goal') {
                state.context.class_mix = text;
                state.stage = 'awaiting_phone';
                addMsg(`Great choice. Lastly, please share your **10-digit mobile number** so Dr. Amol can share the detailed syllabus and fee structure.`, 'bot');
                return;
            }
            if (state.stage === 'awaiting_phone') {
                if (validatePhone(text)) {
                    state.context.mobile = text;
                    state.stage = 'idle';
                    addMsg(`Authenticity verified. I am now forwarding your details to Dr. Amol Thakre via WhatsApp for immediate priority.`, 'bot');
                    logEnquiry(state.context);
                    forwardToWhatsApp(state.context);
                    return;
                } else {
                    addMsg("That doesn't look like a valid 10-digit mobile number. Could you please check and type it again?", 'bot');
                    return;
                }
            }

            if (q.includes('who') || q.includes('mentor') || q.includes('amol') || q.includes('background') || q.includes('credentials')) {
                addMsg(`**${knowledgeBase.mentor.name}** is an **Ex-GE Senior Scientist** with a Ph.D. from the **University of Twente** and a Masters from **IISc Bangalore**.`, 'bot');
                return;
            }

            if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('join') || q.includes('register') || q.includes('enroll')) {
                state.stage = 'awaiting_name';
                addMsg("I can certainly help you with registration and fee details. To provide accurate information for your target track, may I have your name?", 'bot');
                return;
            }

            if (q.includes('contact') || q.includes('call') || q.includes('email') || q.includes('phone') || q.includes('number')) {
                addMsg(`You can reach the Lab HQ at **${c_p_d}** or email **${c_e_u}@${c_e_d}**.`, 'bot');
                return;
            }

            if (q.includes('batch') || q.includes('start') || q.includes('date') || q.includes('admission')) {
                addMsg(`We have two primary intakes at Whitefield:\n• **Spring Batch**: Mid-March/April\n• **Summer Batch**: June\n\nEach batch is capped at **10 seats**. Rolling admissions depend on availability.`, 'bot', ["Check Availability", "Location Details"]);
                return;
            }

            if (q.includes('teach') || q.includes('method') || q.includes('how') || q.includes('logic')) {
                addMsg(`Our methodology is unique: **'Concept-to-Competition'**. It involves industrial logic, weekly hard-mode tests, and scientific error correction.`, 'bot');
                return;
            }

            addMsg("I'm trained on Dr. Amol's full research and teaching profile. Ask me about credentials, teaching methods, batch dates, or contact details!", 'bot', ["Dr. Amol's Credentials", "Batch Timings", "Contact Details", "Fees & Registration"]);
        }

        document.getElementById('chatbot-button').onclick = () => {
            const isVisible = win.style.display === 'flex';
            win.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Greetings! I am the Admissions Assistant. How can I help you navigate your academic journey today?", 'bot', ["Batches & Admissions", "Enrollment Process", "Teaching Methodology"]);
                }, 500);
            }
        };

        document.getElementById('chatbot-close').onclick = () => win.style.display = 'none';
        send.onclick = handleIn;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleIn(); };

        setTimeout(() => {
            if (win.style.display !== 'flex') document.getElementById('chatbot-button').click();
        }, 2000);
    }

    initChatbot();
})();
