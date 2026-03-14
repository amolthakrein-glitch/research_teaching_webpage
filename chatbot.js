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
            "admission": "Admissions are currently in a high-probability state! We have batches in March/April and June. Mid-session entry depends on the current 'student density' (seat availability).",
            "fees": "To calculate the tuition variables, I need to link your coordinates to Amol Sir. Let's start with your name?",
            "mentor": "Sir is a Ph.D. from Twente and an IISc alumnus. He has spent years in the labs of GE and Equinor. He doesn't just teach Science; he simulates success.",
            "batch": "Main academic cycles: \n1. Spring Equinox (March/April)\n2. Summer Solstice (June)\nRolling admissions occur if the vacuum of a seat exists!",
            "contact": "You can reach the Lab HQ at +91-9591233320 or amolthakre.in@gmail.com."
        };

        const witticisms = [
            "Analyzing your query with 99.9% precision...",
            "Consulting the laws of thermodynamics for that answer...",
            "Wait, Sir is currently optimizing a digital twin. I'll handle this!",
            "Did you know? Entropy increases, but your marks shouldn't. Let's talk admissions."
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
            }, 1200);
        }

        function respond(q) {
            // State Machine for Leads
            if (state.lead === 'name') {
                state.name = q;
                state.lead = 'phone';
                addMsg(`Excellent coordinates, ${q}! Now, what's your mobile number so we can beam the fee structure to you?`, 'bot');
                return;
            }
            if (state.lead === 'phone') {
                state.lead = 'none';
                addMsg(`Data received! Sir will reach out to you before the next batch cycle. Anything else on your mind?`, 'bot');
                return;
            }

            // Logic
            if (q.includes('fee') || q.includes('cost') || q.includes('price')) {
                state.lead = 'name';
                addMsg(knowledge.fees, 'bot');
                return;
            }

            let found = false;
            for (let k in knowledge) {
                if (q.includes(k)) {
                    if (Math.random() > 0.7) addMsg(witticisms[Math.floor(Math.random()*witticisms.length)], 'bot');
                    addMsg(knowledge[k], 'bot');
                    found = true;
                    break;
                }
            }

            if (!found) {
                addMsg("My sensors are confused by that input. Should we focus on Admissions, Fees, or Mentor info?", 'bot', ["Admissions", "Fees", "Mentor Info"]);
            }
        }

        document.getElementById('chatbot-button').onclick = () => {
            const show = win.style.display !== 'flex';
            win.style.display = show ? 'flex' : 'none';
            if (show && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Greetings! I am the Lab Assistant. Sir is currently busy with high-fidelity simulations, but I can help you minimize the entropy of your admission process.", 'bot', ["Admissions", "Fees", "Mentor Info"]);
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
