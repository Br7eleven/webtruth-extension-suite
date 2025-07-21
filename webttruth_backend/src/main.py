from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import io
import os
from dotenv import load_dotenv

# Load environment variables (HF_API_TOKEN)
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

HF_TOKEN = os.getenv("HF_API_TOKEN")

@app.route("/api/tts", methods=["POST"])
def tts():
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    model = "espnet/kan-bayashi_ljspeech_vits"
    api_url = f"https://api-inference.huggingface.co/models/{model}"

    try:
        response = requests.post(api_url, headers=headers, json={"inputs": text})
        response.raise_for_status()

        return send_file(
            io.BytesIO(response.content),
            mimetype="audio/wav",
            as_attachment=False,
            download_name="tts_output.wav"
        )

    except requests.exceptions.RequestException as e:
        app.logger.error(f"TTS error: {e}")
        return jsonify({"error": "Failed to generate audio"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
