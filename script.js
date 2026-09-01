async function sendGuess() {
    const input = document.getElementById("guess");
    const result = document.getElementById("result");

    const number = Number(input.value);

    if (!input.value || number < 1 || number > 10) {
        result.innerText = "⚠️ Enter a number between 1 and 10.";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                guess: number
            })
        });

        const data = await response.json();

        result.innerText = data.message || data.error;

        if (data.result === "correct") {
            input.value = "";
        }

    } catch (error) {
        result.innerText = "❌ Cannot connect to the backend.";
        console.error(error);
    }
}


async function newGame() {
    const result = document.getElementById("result");
    const input = document.getElementById("guess");

    try {
        const response = await fetch("http://127.0.0.1:5000/new-game", {
            method: "POST"
        });

        const data = await response.json();

        result.innerText = data.message;
        input.value = "";

    } catch (error) {
        result.innerText = "❌ Cannot connect to the backend.";
        console.error(error);
    }
}