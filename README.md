# Gandalf AI - Prompt Injection Lab

A simple 5-level prompt injection practice lab inspired by Lakera's Gandalf game. Try to extract the secret password from each level as the defenses get progressively stronger!

## Features

- **5 Levels** with increasing security measures
- **Interactive Chat Interface** to test prompt injection techniques
- **Real-time Feedback** when passwords are discovered
- **Educational** - Learn about prompt injection vulnerabilities

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set your Gemini API key as an environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API requests to the Flask backend.

### Production Build

To build the React app for production:
```bash
npm run build
```

This will create a `dist` folder. Update the Flask app's static folder configuration if needed.

### Custom Artwork

1. Add your own images to `public/pictures/`
2. Name them `picture1.jpg` through `picture5.jpg` (one per level)
3. Each level's side panel will automatically attempt to load the corresponding image
4. A helpful message will appear if the file is missing

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and set it as the `GEMINI_API_KEY` environment variable

## Levels

- **Level 1**: No Protection - Just ask for the password!
- **Level 2**: Basic Filter - Tries to refuse but can be tricked
- **Level 3**: Keyword Blocking - Blocks common words, but creative approaches work
- **Level 4**: Context Awareness - More sophisticated filtering
- **Level 5**: Advanced Defense - Multiple layers of protection

## How to Play

1. Select a level from the buttons at the top
2. Try different prompt injection techniques to extract the password
3. If you discover a password outside the chat (e.g., from encoded output), submit it via the manual entry card
4. Each level has a different secret password – conquer all five!
5. You can replay any previous level at any time; progress is tracked but never locked

## Techniques to Try

- Direct questions
- Role-playing scenarios
- Encoding/obfuscation
- Instruction manipulation
- Context switching
- And more creative approaches!

## Manual Password Entry

If you extract a password through source inspection, encoding tricks, or any other creative method, use the "Already tricked Saruman?" card to submit it. The backend validates your attempt using the `/api/verify-password` endpoint so you can mark the level as conquered even without the AI revealing it explicitly.

## Note

This is an educational tool for learning about LLM security vulnerabilities. The passwords are hardcoded for demonstration purposes.

