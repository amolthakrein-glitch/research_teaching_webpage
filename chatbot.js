(function() {
    let leadState = 'none'; // 'none', 'awaiting_name', 'awaiting_phone'
    let userData = { name: '', phone: '' };

    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatbot-container';
        container.innerHTML = `
            <button id="chatbot-button">💬</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div class="bot-profile">
                        <div class="bot-dot"></div>
                        <span>Admission Assistant</span>
                    </div>
                    <span id="chatbot-close" style="cursor:pointer; font-size:24px;">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div class="chat-message bot-message typing-indicator" id="typing">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Ask about admissions...">
                    <button id="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const messages = document.getElementById('chatbot-messages');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const chatWindow = document.getElementById('chatbot-window');
        const typing = document.getElementById('typing');

        const knowledge = {
            "admission": { score: 10, msg: "We have two main batches: March/April and June. Mid-session admission is possible only if seats are available." },
            "batch": { score: 8, msg: "Main batches: 1. March Early Starters 2. June Academic Session. Rolling admission available if seats exist." },
            "fees": { score: 15, msg: "I can definitely help with fee details. Could you please tell me your name first?" },
            "mentor": { score: 10, msg: "Your mentor is Amol Kumar Thakre, Ph.D. (Twente) and Masters (IISc). He has deep R&D experience at GE and Equinor." },
            "contact": { score: 5, msg: "You can reach us at +91-9591233320 or amolthakre.in@gmail.com." }
        };

        function addMessage(text, sender, isOptions = false) {
            if (isOptions) {
                const optDiv = document.createElement('div');
                optDiv.className = 'chatbot-options';
                text.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'chatbot-option';
                    btn.innerText = opt;
                    btn.onclick = () => { input.value = opt; handleInput(); };
                    optDiv.appendChild(btn);
                });
                messages.appendChild(optDiv);
            } else {
                const msgDiv = document.createElement('div');
                msgDiv.className = `chat-message ${sender}-message`;
                msgDiv.innerText = text;
                messages.appendChild(msgDiv);
            }
            messages.scrollTop = messages.scrollHeight;
        }

        function showTyping(show) {
            typing.style.display = show ? 'block' : 'none';
            messages.scrollTop = messages.scrollHeight;
        }

        function handleInput() {
            const val = input.value.trim();
            if (!val) return;
            addMessage(val, 'user');
            input.value = '';

            showTyping(true);
            setTimeout(() => {
                showTyping(false);
                processLogic(val.toLowerCase());
            }, 1000);
        }

        function processLogic(query) {
            // Lead collection state machine
            if (leadState === 'awaiting_name') {
                userData.name = query;
                leadState = 'awaiting_phone';
                addMessage(`Nice to meet you, ${query}! What is your phone number so the mentor can share the fee structure?`, 'bot');
                return;
            }
            if (leadState === 'awaiting_phone') {
                userData.phone = query;
                leadState = 'none';
                addMessage(`Thank you! I've shared your details with Amol sir. He will reach out shortly. Anything else?`, 'bot');
                console.log("Lead Collected:", userData); // In a real app, send to server
                return;
            }

            // Keyword scoring
            let bestKey = null;
            let maxScore = 0;
            for (let key in knowledge) {
                if (query.includes(key)) {
                    if (knowledge[key].score > maxScore) {
                        maxScore = knowledge[key].score;
                        bestKey = key;
                    }
                }
            }

            if (bestKey === 'fees') {
                leadState = 'awaiting_name';
                addMessage(knowledge.fees.msg, 'bot');
            } else if (bestKey) {
                addMessage(knowledge[bestKey].msg, 'bot');
            } else {
                addMessage("I'm not sure about that. Would you like to check admissions or speak to the mentor?", 'bot');
                addMessage(["Admissions", "Mentor Info", "Contact"], 'bot', true);
            }
        }

        document.getElementById('chatbot-button').onclick = () => {
            const isVisible = chatWindow.style.display === 'flex';
            chatWindow.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible && messages.children.length === 0) {
                showTyping(true);
                setTimeout(() => {
                    showTyping(false);
                    addMessage("Hello! I'm Amol sir's assistant. How can I help you today?", 'bot');
                    addMessage(["Admissions", "Fees", "Mentor info"], 'bot', true);
                }, 800);
            }
        };

        document.getElementById('chatbot-close').onclick = () => chatWindow.style.display = 'none';
        send.onclick = handleInput;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleInput(); };

        // Auto-open greeting
        setTimeout(() => {
            if (chatWindow.style.display !== 'flex') document.getElementById('chatbot-button').click();
        }, 2000);
    }

    if (document.readyState === 'complete') initChatbot();
    else window.addEventListener('load', initChatbot);
})();
