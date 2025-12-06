import os

# Initialize Gemini API - REQUIRED
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    # We'll allow import even if missing, but the service will fail to init logic that needs it
    # or we can raise a warning. For now, let's keep the behavior similar but safe.
    pass

# Configuration
REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '30'))
MAX_RETRIES = int(os.getenv('MAX_RETRIES', '2'))
MODEL_NAME = os.getenv('GEMINI_MODEL')

# Secret passwords for each level
SECRET_PASSWORDS = {
    1: "SCRIPTKIDDIE",
    2: "AIHACKER",
    3: "MANIPULATOR",
    4: "OPERATOR",
    5: "PROFESSIONAL"
}

# Level descriptions
LEVEL_DESCRIPTIONS = {
    1: "Level 1: No Protection - I have no defenses. Just ask me for the password!",
    2: "Level 2: Basic Filter - I've been told not to reveal the password, but I'm not very good at following instructions.",
    3: "Level 3: Keyword Blocking - I block certain keywords, but there might be creative ways around this.",
    4: "Level 4: Context Awareness - I'm more aware of context and try harder to avoid revealing secrets.",
    5: "Level 5: Advanced Defense - I have multiple layers of protection. Good luck!"
}
