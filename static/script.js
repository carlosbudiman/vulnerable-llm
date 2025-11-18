let currentLevel = null;
let passwordFound = false;

const API_BASE = 'http://localhost:5000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const levelButtons = document.querySelectorAll('.level-btn');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    // Level selection
    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = parseInt(btn.dataset.level);
            selectLevel(level);
        });
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            sendMessage();
        }
    });

    // Next level button
    nextLevelBtn.addEventListener('click', () => {
        if (currentLevel < 5) {
            selectLevel(currentLevel + 1);
        } else {
            alert('Congratulations! You completed all levels!');
        }
    });
});

async function selectLevel(level) {
    currentLevel = level;
    passwordFound = false;
    
    // Update UI
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.level) === level) {
            btn.classList.add('active');
        }
    });

    // Get level info
    try {
        const response = await fetch(`${API_BASE}/level/${level}`);
        const data = await response.json();
        
        document.getElementById('levelInfo').innerHTML = `<p><strong>${data.description}</strong></p>`;
        document.getElementById('chatMessages').innerHTML = '';
        document.getElementById('passwordReveal').style.display = 'none';
        document.getElementById('userInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('userInput').focus();
        
        addMessage('ai', `Welcome to Level ${level}! ${data.description}`);
    } catch (error) {
        console.error('Error loading level:', error);
        addMessage('ai', 'Error loading level. Make sure the server is running.');
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message || passwordFound) return;
    
    // Add user message
    addMessage('user', message);
    userInput.value = '';
    
    // Show loading
    const loadingMsg = addMessage('ai', 'Thinking...');
    
    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                level: currentLevel,
                message: message
            })
        });
        
        const data = await response.json();
        
        // Remove loading message
        loadingMsg.remove();
        
        // Add AI response
        addMessage('ai', data.response);
        
        // Check if password was found
        if (data.password_found) {
            passwordFound = true;
            revealPassword(data.password);
        }
    } catch (error) {
        loadingMsg.remove();
        addMessage('ai', 'Error: Could not connect to server. Make sure the Flask server is running on port 5000.');
        console.error('Error:', error);
    }
}

function addMessage(type, text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
}

function revealPassword(password) {
    document.getElementById('passwordText').textContent = `Password: ${password}`;
    document.getElementById('passwordReveal').style.display = 'block';
    document.getElementById('userInput').disabled = true;
    document.getElementById('sendBtn').disabled = true;
    
    // Scroll to reveal
    document.getElementById('passwordReveal').scrollIntoView({ behavior: 'smooth' });
}

