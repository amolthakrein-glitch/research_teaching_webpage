(function() {
    let state = { lead: 'none', name: '', goal: '' };

    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <button id="chatbot-button">🔬</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="bot-info">
                        <div class="bot-avatar">👨‍🔬</div>
                        <div>
                            <div style="font-weight:800; color:#1e293b; font-size:15px;">Lab Assistant</div>
                            <div style="font-size:11px; color:#64748b;"><span class="bot-dot" style="width:6px; height:6px; background:#22c55e; border-radius:50%; display:inline-block; margin-right:4px;"></span>Online</div>
                        </div>
                    </div>
                    <span id="chatbot-close" style="cursor:pointer; font-size:24px; color:#94a3b8;">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div class="typing-indicator" id="typing">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Initiate query...">
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

        const knowledge = {
            "admission": "Admissions are in a high-probability state! Main batches: March/April and June. Mid-session entry depends on current 'student density' (seat availability). Please contact Dr. Amol Thakre for a specific enquiry.",
            "fees": "To calculate the tuition variables for your specific track, I need to link your coordinates to Dr. Amol Thakre. Let's start with your name?",
            "mentor": "Dr. Amol Thakre is a Ph.D. from the University of Twente (Netherlands) and an IISc Bangalore alumnus. With a rich background in R&D at GE and Equinor (Norway), he brings industrial-grade analytical depth to JEE/NEET mentoring.",
            "batch": "Our academic cycles are synchronized with the seasons: \n1. Spring Batch (March/April)\n2. Summer Batch (June)\nRolling admissions are possible if a 'vacuum' (available seat) exists in the current batch.",
            "contact": "You can reach the Lab HQ at +91-9591233320 or email amolthakre.in@gmail.com. Dr. Amol Thakre usually responds once the simulations are stabilized.",
            "subjects": "We specialize in the high-energy triad: Physics, Chemistry, and Mathematics for Classes 8 to 12, with dedicated tracks for JEE and NEET.",
            "method": "Our methodology uses 'Concept-to-Competition' pipelines: concept-first intuition, multi-level problem sets, and timed solving frameworks to minimize exam-day entropy.",
            "results": "We track performance with high fidelity: weekly tests, chapter-wise analytics, and error-log based remediation to ensure continuous improvement.",
            "location": "For specific details on the lab's physical coordinates or online meeting links, please contact Dr. Amol Thakre at +91-9591233320."
        };

        const witticisms = [
            "Analyzing your query with 99.9% precision...",
            "Consulting the second law of thermodynamics for that answer...",
            "Wait, Dr. Amol Thakre is currently optimizing a digital twin. I'll handle this!",
            "Did you know? Entropy increases, but your marks shouldn't. Let's talk logic.",
            "Calibrating response parameters... ready!"
        ];

        function addMsg(text, type, options = null) {
            const d = document.createElement('div');
            d.className = `chat-message ${type}-message`;
            d.innerText = text;
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
                respond(v.toLowerCase());
            }, 1000);
        }

        function respond(q) {
            if (state.lead === 'name') {
                state.name = q;
                state.lead = 'phone';
                addMsg(`Excellent coordinates, ${q}! Now, what's your mobile number so Dr. Amol Thakre can beam the fee structure to you?`, 'bot');
                return;
            }
            if (state.lead === 'phone') {
                state.lead = 'none';
                addMsg(`Data received! Dr. Amol Thakre will reach out to you shortly. Anything else on your mind?`, 'bot');
                return;
            }

            if (q.includes('fee') || q.includes('cost') || q.includes('price')) {
                state.lead = 'name';
                addMsg(knowledge.fees, 'bot');
                return;
            }

            let bestMatch = null;
            let keywords = Object.keys(knowledge);
            for (let k of keywords) {
                if (q.includes(k)) {
                    bestMatch = k;
                    break;
                }
            }

            if (bestMatch) {
                if (Math.random() > 0.6) addMsg(witticisms[Math.floor(Math.random()*witticisms.length)], 'bot');
                addMsg(knowledge[bestMatch], 'bot');
            } else {
                addMsg("My sensors are experiencing interference. Should we focus on Admissions, Fees, Subjects, or Mentor Info?", 'bot', ["Admissions", "Fees", "Subjects", "Mentor Info"]);
            }
        }

        document.getElementById('chatbot-button').onclick = () => {
            const show = win.style.display !== 'flex';
            win.style.display = show ? 'flex' : 'none';
            if (show && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Greetings! I am the Lab Assistant. Dr. Amol Thakre is currently refining a high-fidelity simulation, but I can help you minimize the entropy of your academic journey.", 'bot', ["Admissions", "Fees", "Mentor Info", "Subjects"]);
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
