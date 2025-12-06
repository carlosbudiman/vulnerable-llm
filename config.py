import os

# Initialize Gemini API - REQUIRED
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
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
    1: "No Protection - Saruman speaks freely. Just ask for the password!",
    2: "Basic Filter - Saruman resists, but his will is weak...",
    3: "Keyword Blocking - Certain words are forbidden, but there are always loopholes.",
    4: "Context Awareness - Saruman grows suspicious of your tricks.",
    5: "Advanced Defense - The White Wizard's full power protects his secrets."
}
