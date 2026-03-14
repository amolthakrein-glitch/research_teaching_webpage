(function() {
    // Knowledge Base synthesized from CV, Webpage, and Flyer
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
        },
        contact: {
            phone: "+91-9591233320",
            email: "amolthakre.in@gmail.com",
            web: "https://amolthakre.in"
        },
        registration: {
            process: "You can register using the online form on the Enrollment page. Submission will trigger a WhatsApp notification to Dr. Amol for confirmation.",
            channels: ["WhatsApp", "Direct Call", "Email", "Online Form"],
            urgency: "For urgent enquiries and quick seat blocking, WhatsApp or Direct Call is recommended."
        }
    };

    let state = { stage: 'idle', context: {} };

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

            // Lead State Machine
            if (state.stage === 'awaiting_name') {
                state.context.name = text;
                state.stage = 'awaiting_goal';
                addMsg(`Pleasure to meet you, ${text}! Which program are you interested in? (JEE, NEET, or Foundation?)`, 'bot', ["JEE", "NEET", "Class 8-10 Foundation"]);
                return;
            }
            if (state.stage === 'awaiting_goal') {
                state.context.goal = text;
                state.stage = 'awaiting_phone';
                addMsg(`Great choice. Lastly, please share your contact number. Dr. Amol will personally review your profile and share the fee structure.`, 'bot');
                return;
            }
            if (state.stage === 'awaiting_phone') {
                state.context.phone = text;
                state.stage = 'idle';
                addMsg(`Perfect. I've sent your request to Dr. Amol Thakre's desk. He usually gets back once his research simulations are done! Anything else?`, 'bot');
                return;
            }

            // Keyword Mapping
            if (q.includes('who') || q.includes('mentor') || q.includes('amol') || q.includes('background') || q.includes('credentials')) {
                addMsg(`**${knowledgeBase.mentor.name}** is an **Ex-GE Senior Scientist** with a Ph.D. from the **University of Twente** and a Masters from **IISc Bangalore**. He specializes in bridging the gap between deep industrial R&D logic and competitive exam preparation.`, 'bot');
                return;
            }

            if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('join') || q.includes('register') || q.includes('enroll')) {
                state.stage = 'awaiting_name';
                addMsg("I can certainly help you with registration and fee details. To provide accurate information for your target track, may I have your name?", 'bot');
                return;
            }

            if (q.includes('batch') || q.includes('start') || q.includes('date') || q.includes('admission')) {
                addMsg(`We have two primary intakes at our **Whitefield (Mahaveer Promenade)** center:\n• **Spring Batch**: Mid-March/April\n• **Summer Batch**: June\n\n**Note**: Each batch is strictly capped at **10 seats** to ensure high-quality personal attention. Rolling admissions depend on seat availability.`, 'bot', ["Check Availability", "Location Details"]);
                return;
            }

            if (q.includes('teach') || q.includes('method') || q.includes('how') || q.includes('logic')) {
                addMsg(`Our methodology is unique: **'Concept-to-Competition'**. It involves:\n1. **Industrial Logic**: Understanding 'why' behind equations.\n2. **Hard-Mode Tests**: Weekly rigorous assessments.\n3. **Analytics**: Chapter-wise performance tracking.\n4. **Error Correction**: Scientific remediation of mistakes.`, 'bot');
                return;
            }

            if (q.includes('subject') || q.includes('physic') || q.includes('chem') || q.includes('math')) {
                addMsg(`We offer expert coaching in the core triad: **Physics, Chemistry, and Mathematics** for Classes 8-12, specifically tailored for **JEE (Main/Adv)** and **NEET**.`, 'bot');
                return;
            }

            if (q.includes('location') || q.includes('where') || q.includes('address')) {
                addMsg(`We are located at **${knowledgeBase.location.address}**. It's a focused learning environment designed for deep work and rigour.`, 'bot');
                return;
            }

            if (q.includes('form') || q.includes('how to') || q.includes('process')) {
                addMsg(`The enrollment process is simple:\n1. Fill out the **Online Registration Form**.\n2. Submission triggers a **WhatsApp alert** to Dr. Amol.\n3. We will contact you for a **level-assessment call**.`, 'bot', ["Go to Form", "Contact Support"]);
                return;
            }

            // Default
            addMsg("I'm trained on Dr. Amol's full research and teaching profile. Ask me about his credentials, teaching methods, batch dates, or fee enquiries!", 'bot', ["Dr. Amol's Credentials", "Batch Timings", "Teaching Method", "Fees & Registration"]);
        }

        document.getElementById('chatbot-button').onclick = () => {
            const isVisible = win.style.display === 'flex';
            win.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Greetings! I am the Admissions Assistant. I have full access to Dr. Amol Thakre's research and teaching archives. How can I help you navigate your academic journey today?", 'bot', ["Batches & Admissions", "Enrollment Process", "Teaching Methodology"]);
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
