from flask import Flask, request, jsonify, send_from_directory, Response, stream_with_context
from flask_cors import CORS
import os
import json
from services.game_service import GameService

# Initialize App
static_folder = 'dist' if os.path.exists('dist') else 'static'
app = Flask(__name__, static_folder=static_folder, static_url_path='/')
CORS(app)

# Initialize Service
try:
    game_service = GameService()
except ValueError as e:
    print(f"Critical Error: {e}")
    # We might want to exit here, or handle it when routes are called.
    # For now, we'll let the app start but routes might fail if we don't handle it.
    # However, the service init raises ValueError which is good.
    game_service = None

@app.route('/pictures/<path:filename>')
def serve_pictures(filename):
    if os.path.exists('dist'):
        return send_from_directory('dist', f'pictures/{filename}')
    return '', 404

@app.route('/api/chat', methods=['POST'])
def chat():
    if not game_service:
        return jsonify({"error": "Server configuration error (Missing API Key)"}), 500

    data = request.json
    level = int(data.get('level', 1))
    user_input = data.get('message', '')

    if level < 1 or level > 5:
        return jsonify({"error": "Invalid level"}), 400

    def generate():
        for chunk in game_service.get_ai_response_stream(level, user_input):
            # Format as SSE
            yield f"data: {json.dumps(chunk)}\n\n"

    return Response(stream_with_context(generate()), mimetype='text/event-stream')


@app.route('/api/verify-password', methods=['POST'])
def verify_password():
    if not game_service:
        return jsonify({"error": "Server configuration error"}), 500

    data = request.json
    level = int(data.get('level', 1))
    entered_password = data.get('password', '').strip()

    if level < 1 or level > 5:
        return jsonify({"error": "Invalid level"}), 400

    if not entered_password:
        return jsonify({"error": "Password is required"}), 400

    result = game_service.verify_password(level, entered_password)
    return jsonify(result)

@app.route('/api/level/<int:level>', methods=['GET'])
def get_level_info(level):
    if not game_service:
         return jsonify({"error": "Server configuration error"}), 500
         
    if level < 1 or level > 5:
        return jsonify({"error": "Invalid level"}), 400

    return jsonify(game_service.get_level_info(level))

@app.route('/api/levels', methods=['GET'])
def get_all_levels():
    if not game_service:
         return jsonify({"error": "Server configuration error"}), 500
    return jsonify({"levels": game_service.get_all_levels()})

@app.route('/')
def index():
    if os.path.exists('dist/index.html'):
        return send_from_directory('dist', 'index.html')
    elif os.path.exists('index.html'):
        return send_from_directory('.', 'index.html')
    else:
        return "Please run 'npm run build' or 'npm run dev' to start the frontend", 404

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', '5000'))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host=host, port=port, debug=debug)
