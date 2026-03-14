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
            "admission": "We have two main batches: one starting in March/April and another in June. We also offer rolling admissions depending on seat availability. Would you like to know more about a specific batch?",
            "batch": `Our main batches are:
1. Mid-March/April Batch: Focused on early starters.
2. June Batch: Aligned with the start of the academic year.
Rolling admissions are also available.`,
            "march": "The Mid-March/April batch is currently open for registration. You can join via the registration link on the main page.",
            "april": "The Mid-March/April batch is currently open for registration. You can join via the registration link on the main page.",
            "june": "The June batch starts in the first week of June. It's ideal for students looking to start with the new academic session.",
            "rolling": "Rolling admissions allow you to join our ongoing batches at any time, provided there is space and your fundamentals are aligned.",
            "mentor": "Your mentor is Amol Kumar Thakre, Ph.D. from the University of Twente and Masters from IISc Bangalore. He has extensive experience in Energy Research (Equinor, Norway) and GE Research, and has been mentoring JEE/NEET aspirants since 2020.",
            "amol": "Amol Kumar Thakre is a scientist, engineer, and educator. He specializes in multiphase flows and computational modeling, and brings that analytical depth to teaching Science and Math for JEE/NEET.",
            "contact": "You can reach out at amolthakre.in@gmail.com or call +91-9591233320.",
            "fees": "For details on fees and scheduling, please fill out the registration form or contact us directly at +91-9591233320.",
            "default": "I'm sorry, I didn't quite get that. You can ask about admissions, batches (March/April or June), or the mentor Amol Thakre."
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
                const options = ["Admissions", "Mentor info", "March Batch", "June Batch"];
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
