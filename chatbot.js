(function() {
    function initChatbot() {
        if (document.getElementById('chatbot-container')) return;

        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        chatbotContainer.style.zIndex = '9999999';
        chatbotContainer.style.display = 'block';
        
        chatbotContainer.innerHTML = `
            <button id="chatbot-button" style="display: flex !important;">💬</button>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <span>Admission Assistant</span>
                    <span id="chatbot-close">&times;</span>
                </div>
                <div id="chatbot-messages"></div>
                <div id="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Type your query...">
                    <button id="chatbot-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatbotContainer);

        const button = document.getElementById('chatbot-button');
        const chatWindow = document.getElementById('chatbot-window');
        const close = document.getElementById('chatbot-close');
        const messages = document.getElementById('chatbot-messages');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');

        const responses = {
            "admission": "We have two main batches: March/April and June. Mid-session admission is possible only if seats are available. Please contact for specific enquiry.",
            "batch": `Our main batches are:
1. Mid-March/April Batch: Focused on early starters.
2. June Batch: Aligned with academic sessions.
Mid-session entry is seat-dependent.`,
            "march": "The Mid-March/April batch is currently open. Mid-session entry is only possible if seats are available.",
            "april": "The Mid-March/April batch is currently open. Mid-session entry is only possible if seats are available.",
            "june": "The June batch starts in the first week of June. For mid-session admission, please contact us to check seat availability.",
            "rolling": "Mid-session admission is possible only if seats are available. Please contact us directly for an enquiry.",
            "mentor": "Your mentor is Amol Kumar Thakre, Ph.D. (Twente) and Masters (IISc). He has extensive research experience at Equinor and GE. Please contact him for any specific admission or fee enquiries.",
            "amol": "Amol Kumar Thakre is a scientist and educator specializing in multiphase flows. He brings deep analytical expertise to JEE/NEET mentoring.",
            "contact": "For any enquiries, you can reach out at amolthakre.in@gmail.com or call/WhatsApp +91-9591233320.",
            "fees": "For a detailed fee enquiry, please contact the mentors directly at +91-9591233320.",
            "enquiry": "For detailed enquiries regarding fees or mid-session admissions, please contact the mentors at +91-9591233320.",
            "seats": "Mid-session admission is strictly subject to seat availability. Please contact us to check the current status.",
            "default": "I can help with admissions, batches, or mentor info. For detailed fee enquiries or mid-session seat availability, please contact the mentors at +91-9591233320."
        };

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message ' + (sender === 'bot' ? 'bot-message' : 'user-message');
            msgDiv.innerText = text;
            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        function showGreeting() {
            if (messages.children.length === 0) {
                addMessage("Hello, how can I help you?", 'bot');
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'chatbot-options';
                const options = ["Admissions", "Fees", "Mentor info", "Contact"];
                options.forEach(opt => {
                    const optBtn = document.createElement('button');
                    optBtn.className = 'chatbot-option';
                    optBtn.innerText = opt;
                    optBtn.onclick = (event) => {
                        event.stopPropagation();
                        input.value = opt;
                        handleInput();
                    };
                    optionsDiv.appendChild(optBtn);
                });
                messages.appendChild(optionsDiv);
            }
        }

        function handleInput() {
            const query = input.value.toLowerCase().trim();
            if (!query) return;

            addMessage(input.value, 'user');
            input.value = '';

            setTimeout(() => {
                let found = false;
                for (let key in responses) {
                    if (query.includes(key)) {
                        addMessage(responses[key], 'bot');
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    addMessage(responses['default'], 'bot');
                }
            }, 500);
        }

        button.onclick = (e) => {
            e.preventDefault();
            const isVisible = chatWindow.style.display === 'flex';
            chatWindow.style.display = isVisible ? 'none' : 'flex';
            if (chatWindow.style.display === 'flex') showGreeting();
        };

        close.onclick = (e) => {
            e.stopPropagation();
            chatWindow.style.display = 'none';
        };

        send.onclick = (e) => {
            e.stopPropagation();
            handleInput();
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleInput();
        };

        // Automatically open and greet after 2 seconds
        setTimeout(() => {
            if (chatWindow.style.display !== 'flex') {
                chatWindow.style.display = 'flex';
                showGreeting();
            }
        }, 2000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initChatbot();
    } else {
        window.addEventListener('load', initChatbot);
    }
})();
