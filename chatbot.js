(function() {
    /**
     * PROMPT: ELITE ADMISSIONS ADVISOR
     * Role: You are the digital representative of Dr. Amol Thakre's Elite Mentorship Lab.
     * Logic: Intent-First Architecture. 
     * Rule 1: Always check for new questions (Intents) before continuing a registration flow (State).
     * Rule 2: If an intent is detected, reset the stage to 'idle' to break any loops.
     * Rule 3: Use authoritative, high-signal language.
     */

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
            type: "Offline intensive sessions."
        }
    };

    let state = { 
        stage: 'idle', 
        context: { student_name: '', class_mix: '', mobile: '', mode: 'Offline' } 
    };

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
            d.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            msgs.appendChild(d);
            
            if (options) {
                const g = document.createElement('div');
                g.className = 'options-grid';
                options.forEach(o => {
                    const b = document.createElement('button');
                    b.className = 'opt-btn';
                    b.innerText = o;
                    b.onclick = () => { 
                        state.stage = 'idle'; // Reset state on button click
                        input.value = o; 
                        handleIn(); 
                    };
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
            const msg = `*New Lead*%0A*Name:* ${encodeURIComponent(data.student_name)}%0A*Target:* ${encodeURIComponent(data.class_mix)}%0A*Phone:* ${encodeURIComponent(data.mobile)}`;
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
            }, 600);
        }

        function processInput(text) {
            const q = text.toLowerCase();

            // 1. UNIVERSAL INTENT DETECTION (Highest Priority)
            let detectedIntent = null;
            if (q.includes('who') || q.includes('mentor') || q.includes('amol') || q.includes('credentials') || q.includes('background') || q.includes('info')) detectedIntent = 'mentor';
            else if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('enroll') || q.includes('register') || q.includes('join') || q.includes('admission')) detectedIntent = 'registration';
            else if (q.includes('batch') || q.includes('start') || q.includes('date') || q.includes('when')) detectedIntent = 'batches';
            else if (q.includes('teach') || q.includes('method') || q.includes('how') || q.includes('logic')) detectedIntent = 'methodology';
            else if (q.includes('contact') || q.includes('call') || q.includes('email') || q.includes('phone') || q.includes('mobile')) {
                // If they ask for phone while we are asking for theirs, answer them first
                if (state.stage !== 'awaiting_phone') detectedIntent = 'contact';
            }
            else if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('place')) detectedIntent = 'location';

            // 2. BREAK FLOW IF NEW INTENT IS DETECTED
            if (detectedIntent && state.stage !== 'idle') {
                state.stage = 'idle'; // Reset state to handle new question
            }

            // 3. EXECUTE INTENT OR FALLBACK TO STATE
            if (detectedIntent === 'mentor') {
                addMsg(`<b>Dr. Amol Kumar Thakre</b> is an Ex-GE Senior Scientist with a Ph.D. from the <b>University of Twente</b> and a Masters from <b>IISc Bangalore</b>. He specializes in elite-level JEE/NEET mentorship.`, 'bot', ["Teaching Methodology", "Batch Timings"]);
                return;
            }
            if (detectedIntent === 'registration') {
                state.stage = 'awaiting_name';
                addMsg("I can facilitate your enrollment. To provide the correct fee structure and syllabus for your track, may I have the student's name?", 'bot');
                return;
            }
            if (detectedIntent === 'batches') {
                addMsg(`<b>Academic Intake (Whitefield Center):</b>\n• <b>Spring Batch:</b> Mid-March/April\n• <b>Summer Batch:</b> June\n\nEach batch is strictly limited to <b>10 seats</b> for quality control.`, 'bot', ["Check Availability", "Location Details"]);
                return;
            }
            if (detectedIntent === 'methodology') {
                addMsg(`Our <b>'Concept-to-Competition'</b> pipeline applies industrial R&D logic to exam preparation, focusing on concept intuition and timed high-pressure execution.`, 'bot', ["Dr. Amol's Credentials", "Enroll Now"]);
                return;
            }
            if (detectedIntent === 'contact') {
                addMsg(`You can reach the Admissions Office directly at <b>${c_p_d}</b> or email <b>${c_e_u}@${c_e_d}</b>.`, 'bot', ["Location Details", "Batch Timings"]);
                return;
            }
            if (detectedIntent === 'location') {
                addMsg(`The mentorship lab is located at <b>Mahaveer Promenade, Whitefield, Bangalore</b>. We focus on high-impact offline sessions.`, 'bot', ["Contact Details", "Batch Timings"]);
                return;
            }

            // 4. STATE-SPECIFIC FLOWS (Only if no intent was detected)
            if (state.stage === 'awaiting_name') {
                state.context.student_name = text;
                state.stage = 'awaiting_goal';
                addMsg(`Noted, ${text}. Which program are you targeting?`, 'bot', ["JEE Main & Advanced", "NEET (Physics/Chem)", "Class 8-10 Foundation"]);
                return;
            }
            if (state.stage === 'awaiting_goal') {
                state.context.class_mix = text;
                state.stage = 'awaiting_phone';
                addMsg(`Excellent. Lastly, please share your <b>10-digit mobile number</b> so Dr. Amol can share the detailed fee structure and schedule.`, 'bot');
                return;
            }
            if (state.stage === 'awaiting_phone') {
                if (validatePhone(text)) {
                    state.context.mobile = text;
                    state.stage = 'idle';
                    addMsg(`Verified. Forwarding your details to Dr. Amol Thakre for priority review. You will receive a WhatsApp update shortly.`, 'bot');
                    logEnquiry(state.context);
                    forwardToWhatsApp(state.context);
                    return;
                } else {
                    addMsg("That doesn't look like a valid 10-digit mobile number. Please try again or ask another question to exit registration.", 'bot', ["Batch Timings", "Contact Details"]);
                    return;
                }
            }

            // 5. DEFAULT GREETING
            addMsg("Greetings! I am the Academic Advisor for Dr. Amol Thakre's Mentorship Program. How can I assist you today?", 'bot', ["Batches & Admissions", "Teaching Methodology", "Dr. Amol's Credentials", "Contact Details"]);
        }

        document.getElementById('chatbot-button').onclick = () => {
            const isVisible = win.style.display === 'flex';
            win.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && msgs.children.length === 0) {
                setTimeout(() => { processInput("hello"); }, 500);
            }
        };

        document.getElementById('chatbot-close').onclick = () => win.style.display = 'none';
        send.onclick = handleIn;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleIn(); };
        setTimeout(() => { if (win.style.display !== 'flex') document.getElementById('chatbot-button').click(); }, 2000);
    }

    initChatbot();
})();


