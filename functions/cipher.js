const { HttpError } = require("../httpError");

const table = JSON.parse(require("fs").readFileSync("./table.json"));

// TODO:
/*
    1. Fix reversing algorithm and update decoding algorithm to add reversing
    2. Add termination char (x) to decoding (the opposit of dot (.) ) 
*/


//#region ENDCODING
function encode(text) {
    const chars = text.split("");
    // Output string
    let encoded = "";

    for (let i = 0; i < chars.length;) {
        // Max amount of symbols in symbol is 2, so start with that
        let digitsInSymbol = 2;
        let code = null;

        while (!code) {
            const symbolToFind = chars.slice(i, i + digitsInSymbol).join("");
            // Nothing to search, end of the string basically
            if (!symbolToFind) break;

            switch (symbolToFind) {
                // TODO: make it work
                // case "!": {
                //     console.log("!")
                //     let parts = chars.slice(i + 1).join("").split("!");
                //     const toReverse = parts[0];
                //     if (toReverse.length && parts[1]) {
                //         encoded += `!${encode(toReverse.split("").reverse().join(""))}!`;
                //     } else {
                //         break;
                //     }
                //     i += toReverse.length + 2;

                //     code = "";
                // }
                // Replace space with underscore
                case " ": {
                    code = "_";
                    break;
                }
                default: {
                    code = encodeSymbol(symbolToFind);
                }
            }


            // If no code, try to get a symbol with lower amount of digits in it
            if (!code) digitsInSymbol--;
            // No acceptable symbol found, leave char as it is.
            if (digitsInSymbol == 0) {
                code = `$${symbolToFind},`;
                digitsInSymbol = symbolToFind.length;
            }
        }
        // Add found code to the output string
        if (code)
            encoded += code;
        // This needed to skip already encoded chars
        i += digitsInSymbol;
    }

    // Return without trailing comma
    return encoded.replace(/,$/, "");
}

function encodeSymbol(symbolToFind) {
    for (let { symbol, number } of table) {
        if (symbol == symbolToFind) {
            return `${number},`;
        } else if (symbol.includes(symbolToFind)) {
            return symbol.indexOf(symbolToFind) == 0 ? `.${number},` : `${number}.,`;
        }
    }

    return null;
}
//#endregion

//#region DECODING
function decode(code) {
    let decoded = "";
    const symbols = code.split(",");

    for (let char of symbols) {
        if (char.startsWith("_")) {
            decoded += " ";
            char = char.slice(1);
        }
        // Process non-encoded characters
        if (char.startsWith("$")) { 
            let str = char.slice(1);
            // if there's an empty string after $, its a comma
            decoded += str == "" ? "," : str;
            continue;
        }
        if (!char) continue;

        decoded += decodeSymbol(char);
    }

    return decoded;
}

function decodeSymbol(encoded) {
    const codeRegExp = new RegExp(/(^\.?)\d+(\.?$)/);
    let codeNumber = parseInt(encoded.replaceAll(/\D/g, ""));
    let decodedText = "";

    // Codes should be valid to be processed
    if (!codeRegExp.test(encoded)) {
        throw new HttpError("Неверный шифр.", 400);
    }

    for (let { number, symbol } of table) {
        if (number == codeNumber) {
            // Getting only first/last/ or all chars in symbol.
            if (encoded.startsWith(".")) decodedText += symbol[0];
            else if (encoded.endsWith(".") && encoded.length > 1) decodedText += symbol[1];
            else decodedText += symbol;
        }
    }

    return decodedText;
}
//#endregion

module.exports = { 
    decode, encode
}