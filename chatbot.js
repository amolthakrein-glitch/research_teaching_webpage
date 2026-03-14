(function() {
    let state = { phase: 'idle', name: '', phone: '' };

    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <button id="chatbot-button">🧪</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="bot-info">
                        <div class="bot-avatar">🤖</div>
                        <div>
                            <div style="font-weight:800; color:#1e293b; font-size:15px;">Lab Sidekick</div>
                            <div style="font-size:11px; color:#22c55e;">● Online & Hyper</div>
                        </div>
                    </div>
                    <span id="chatbot-close" style="cursor:pointer; font-size:24px;">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div class="typing-indicator" id="typing">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Type something cool...">
                    <button id="chatbot-send">Go!</button>
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
            "admission": "Good news! We have batches in March/April and June. If you're late, don't panic—rolling admissions exist if there's a free chair in the lab! 🪑",
            "fees": "I don't actually have a pocket, so I don't carry the price list. But Dr. Amol Thakre does! What's your name? I'll introduce you.",
            "mentor": "That's Dr. Amol Thakre! He's a Ph.D. from the Netherlands, worked at GE and Equinor, and basically knows how to build digital twins. He's the Boss. 👨‍🔬",
            "subjects": "We do Physics, Chemistry, and Math. The 'Big Three'! From Class 8 to 12, including JEE and NEET. 📚",
            "method": "The Boss uses a 'Concept-to-Competition' method. No boring rote learning here—just pure logic and timed practice to make you an exam ninja. 🥷",
            "contact": "Call us at +91-9591233320! Or email amolthakre.in@gmail.com. We usually reply faster than a speed of light! (Okay, maybe a bit slower).",
            "march": "The Spring batch! Starts March/April. Perfect for early birds who want to beat the stress. 🐣",
            "june": "The Summer batch! Starts in June. It's when the real heat begins! ☀️"
        };

        const randomGags = [
            "Boop! Brain cells activated.",
            "Just checked my internal database... 💾",
            "Easier than balancing a chemical equation!",
            "Warning: Highly intelligent response incoming... ⚡"
        ];

        function addMsg(text, sender, options = null) {
            const d = document.createElement('div');
            d.className = `chat-message ${sender}-message`;
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
            if (state.phase === 'get_name') {
                state.name = q;
                state.phase = 'get_phone';
                addMsg(`Nice to meet you, ${q}! Now give me your phone number so Dr. Amol Thakre can send you the fee details. I promise not to prank call you! 📱`, 'bot');
                return;
            }
            if (state.phase === 'get_phone') {
                state.phase = 'idle';
                addMsg(`Got it! I've beamed your info to the Boss. He'll get back to you soon. What else can I help with?`, 'bot');
                return;
            }

            // Fuzzy matching for fees
            if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('money') || q.includes('pay')) {
                state.phase = 'get_name';
                addMsg(knowledge.fees, 'bot');
                return;
            }

            if (q.includes('boss') || q.includes('who is')) {
                addMsg(knowledge.mentor, 'bot');
                return;
            }

            let match = Object.keys(knowledge).find(k => q.includes(k));
            if (match) {
                if (Math.random() > 0.5) addMsg(randomGags[Math.floor(Math.random()*randomGags.length)], 'bot');
                addMsg(knowledge[match], 'bot');
            } else {
                addMsg("I'm just a sidekick, and that question was too big for my circuits! Try asking about Admissions, the Boss (Dr. Amol), or Fees.", 'bot', ["Admissions", "Fees", "The Boss", "Subjects"]);
            }
        }

        document.getElementById('chatbot-button').onclick = () => {
            const show = win.style.display !== 'flex';
            win.style.display = show ? 'flex' : 'none';
            if (show && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Hi! I'm the Lab Sidekick. 🤖 Dr. Amol Thakre is busy doing science stuff, so I'm here to help you join the lab. What's on your mind?", 'bot', ["Admissions", "Fees", "Who is Dr. Amol?"]);
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
