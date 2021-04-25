const encodeMessage = document.querySelector("#encodeMessage");
const decodeMessage = document.querySelector("#decodeMessage");
const switchModesBtn = document.querySelector("#switchModesBtn");
const result = document.querySelector("#result");
const copyTextBtn = document.querySelector("#copyResultBtn");
const clearInputBtn = document.querySelector("#clearInputBtn");
const sendIn = 800;

let currentInput;
let encodingMode = true;
let processDataTimeout;


encodeMessage.addEventListener("input", (e) => {
    e.preventDefault();
    if (processDataTimeout) clearTimeout(processDataTimeout);
    processDataTimeout = setTimeout(() => processMessage(encodeMessage.value), sendIn);
    currentInput = encodeMessage;
});

decodeMessage.addEventListener("input", (e) => {
    e.preventDefault();
    if (processDataTimeout) clearTimeout(processDataTimeout);
    processDataTimeout = setTimeout(() => processMessage(decodeMessage.value, "decode"), sendIn);
    currentInput = decodeMessage;
});

async function processMessage(text, method = "encode") {
    let resultText = ""
    if (!text) {
        resultText = "Укажите текст.";
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
        // Swithing to encoding;
        switchModesBtn.innerText = "Режим дешифрования";
        els[0].classList.remove("hidden");
        els[1].classList.add("hidden");
    } else {
        // Swithing to decoding;
        switchModesBtn.innerText = "Режим шифрования";
        els[0].classList.add("hidden");
        els[1].classList.remove("hidden");
    }
});

copyTextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    result.select();
    result.setSelectionRange(0, 9999);

    document.execCommand("copy");

    result.setSelectionRange(0, 0, "none");
});

clearInputBtn.addEventListener("click", (e) => {
    e.preventDefault();
    encodeMessage.value = decodeMessage.value = result.value = "";
});