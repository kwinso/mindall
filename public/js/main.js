const encodeMessage = document.querySelector("#encodeMessage");
const encodeBtn = document.querySelector("#encodeBtn");
const decodeMessage = document.querySelector("#decodeMessage");
const decodeBtn = document.querySelector("#decodeBtn");
const switchModesBtn = document.querySelector("#switchModesBtn");
const result = document.querySelector("#result");

encodeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    processMessage(encodeMessage.value);
});

decodeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    processMessage(decodeMessage.value, "decode");
});

async function processMessage(text, method="encode") {
    let resultText = ""
    if (!text) {
        resultText = "Укажите текст для начала.";
    } else {
        try {
            const { data } = await axios.post(`/cipher/${method}`, { original: text });
            resultText = data.result;
    
        } catch (e) {
            resultText = e.response.data.message ?? "Произошла ошибка."
        }
    }

    result.value = resultText;
}

switchModesBtn.addEventListener("click", () => {
    const els = document.querySelectorAll(".input-container");
    const firstHidden = els[0].classList.contains("hidden");
    if (firstHidden) {
        els[0].classList.remove("hidden");
        els[1].classList.add("hidden");
    } else {
        els[0].classList.add("hidden");
        els[1].classList.remove("hidden");
    }
});