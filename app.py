from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

secret_number = random.randint(1, 10)


@app.route("/")
def home():
    return jsonify({"message": "Game backend is running!"})


@app.route("/guess", methods=["POST"])
def guess():
    data = request.get_json()

    if not data or "guess" not in data:
        return jsonify({"error": "Please send a guess."}), 400

    player_guess = data["guess"]

    if not isinstance(player_guess, int):
        return jsonify({"error": "Guess must be a number."}), 400

    if player_guess == secret_number:
        return jsonify({
            "result": "correct",
            "message": "Correct! You won!"
        })

    elif player_guess < secret_number:
        return jsonify({
            "result": "low",
            "message": "Too low! Try again."
        })

    else:
        return jsonify({
            "result": "high",
            "message": "Too high! Try again."
        })


@app.route("/new-game", methods=["POST"])
def new_game():
    global secret_number
    secret_number = random.randint(1, 10)

    return jsonify({"message": "New game started!"})


if __name__ == "__main__":
    app.run(debug=True)