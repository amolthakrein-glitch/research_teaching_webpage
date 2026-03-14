(function() {
    let state = { lead: 'none', data: { name: '', goal: '', phone: '' } };

    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <button id="chatbot-button">✉️</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="counselor-profile">
                        <div style="position:relative;">
                            <div style="width:40px; height:40px; background:#f1f5f9; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;">🎓</div>
                            <div class="status-indicator" style="position:absolute; bottom:-2px; right:-2px;"></div>
                        </div>
                        <div>
                            <div style="font-weight:700; color:#1e293b; font-size:14px;">Admissions and Enquiry Assistant</div>
                            <div style="font-size:11px; color:#64748b;">Dr. Amol Thakre's Office</div>
                        </div>
                    </div>
                    <span id="chatbot-close" style="cursor:pointer; font-size:20px; color:#94a3b8;">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div class="typing-indicator" id="typing">Counselor is typing...</div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Type your message...">
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
            "admission": "Our admission process is designed for clarity and efficiency. We offer two primary intake cycles:\n\n1. **Early Starter Batch (March/April)**: Ideal for students aiming for a competitive edge.\n2. **Academic Batch (June)**: Aligned with the standard school calendar.\n\n**Rolling Admissions**: If seats are available, mid-session entry is possible. Would you like to check current seat availability?",
            "mentor": "**Dr. Amol Thakre** leads all mentoring sessions. His credentials include:\n\n• **Ph.D.** from University of Twente, Netherlands.\n• **Masters** from IISc Bangalore.\n• **Industrial R&D**: GE Research & Equinor (Norway).\n\nHe specializes in providing analytical depth to Science and Mathematics coaching.",
            "method": "Dr. Thakre's **'Concept-to-Competition'** pipeline involves:\n\n1. **Concept Intuition**: Visual and equation-based fundamentals.\n2. **Problem Sets**: Multi-level difficulty mapping.\n3. **Timed Frameworks**: To improve exam selection and speed.\n4. **Analytics**: Weekly tests with chapter-wise error logs.",
            "fees": "Fee structures are customized based on the specific track (JEE, NEET, or School Boards). To provide an accurate quote, may I start by noting your **Full Name**?",
            "contact": "For immediate assistance, you may contact the office at **+91-9591233320** or email **amolthakre.in@gmail.com**."
        };

        function addMsg(text, sender, options = null) {
            const d = document.createElement('div');
            d.className = `chat-message ${sender}-message`;
            d.innerHTML = text.replace(/\n/g, '<br>');
            msgs.appendChild(d);
            
            if (options) {
                const c = document.createElement('div');
                c.className = 'opt-container';
                options.forEach(o => {
                    const b = document.createElement('button');
                    b.className = 'opt-btn';
                    b.innerText = o;
                    b.onclick = () => { input.value = o; handleIn(); };
                    c.appendChild(b);
                });
                msgs.appendChild(c);
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
                process(v);
            }, 1000);
        }

        function process(q) {
            const query = q.toLowerCase();

            // Lead Collection States
            if (state.lead === 'name') {
                state.data.name = q;
                state.lead = 'goal';
                addMsg(`Thank you, ${q}. Are you inquiring for **JEE**, **NEET**, or **Foundation (8th-10th)**?`, 'bot', ["JEE", "NEET", "Foundation"]);
                return;
            }
            if (state.lead === 'goal') {
                state.data.goal = q;
                state.lead = 'phone';
                addMsg(`Understood. Lastly, please provide your **Phone Number** so Dr. Amol Thakre can share the detailed syllabus and fee structure.`, 'bot');
                return;
            }
            if (state.lead === 'phone') {
                state.data.phone = q;
                state.lead = 'none';
                addMsg(`Information received. A counselor will reach out to you within 24 hours to finalize your registration. Is there anything else I can clarify?`, 'bot');
                return;
            }

            // Intent Matching
            if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('join')) {
                state.lead = 'name';
                addMsg(knowledge.fees, 'bot');
                return;
            }
            if (query.includes('who') || query.includes('mentor') || query.includes('background') || query.includes('amol')) {
                addMsg(knowledge.mentor, 'bot');
                return;
            }
            if (query.includes('batch') || query.includes('admission') || query.includes('start')) {
                addMsg(knowledge.admission, 'bot');
                return;
            }
            if (query.includes('how') || query.includes('teach') || query.includes('method')) {
                addMsg(knowledge.method, 'bot');
                return;
            }

            addMsg("I'm here to provide detailed information regarding admissions and Dr. Thakre's mentoring program. Please select a topic below or type your query.", 'bot', ["Batches & Admissions", "Dr. Amol's Background", "Teaching Methodology", "Enquire about Fees"]);
        }

        document.getElementById('chatbot-button').onclick = () => {
            const show = win.style.display !== 'flex';
            win.style.display = show ? 'flex' : 'none';
            if (show && msgs.children.length === 0) {
                setTimeout(() => {
                    addMsg("Welcome to Dr. Amol Thakre's Admissions Office. I am here to provide you with clear and detailed information regarding our mentoring programs. How may I assist you today?", 'bot', ["Check Admissions", "Mentor Information", "Fee Structure"]);
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
