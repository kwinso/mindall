const { HttpError } = require("../httpError");
const fs = require("fs");
const table = JSON.parse(fs.readFileSync("./table.json"));
const translationMap = JSON.parse(fs.readFileSync("./translateMap.json"));
const escapingChar = "+";
const splitChar = ";";

// TODO:
/*
    1. Add termination char (x) to decoding (the opposit of dot (.) ) 
*/


//#region ENDCODING
function encode(text) {
    // Replacing all russian chars with traslated to eng values
    const chars = text.split("").reduce((str, ch) => {
        return str + (translationMap[ch] ?? ch);
    }, "").split("");
    
    // Output string
    let encoded = "";

    for (let i = 0; i < chars.length;) {
        // Max amount of symbols in symbol is 2, so start with that
        let digitsInSymbol = 2;
        let code = null;

        while (!code) {
            let symbolToFind = chars.slice(i, i + digitsInSymbol).join("");
            // Nothing to search, end of the string basically
            if (!symbolToFind) break;

            switch (symbolToFind) {
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
                code = `${escapingChar}${symbolToFind}${splitChar}`;
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
    return encoded.replace(/;$/, "");
}

function encodeSymbol(symbolToFind) {
    for (let { symbol, number } of table) {
        if (symbol == symbolToFind) {
            return `${number}${splitChar}`;
        } else if (symbol.includes(symbolToFind)) {
            return (symbol.indexOf(symbolToFind) == 0 ? `.${number}` : `${number}.`) + splitChar;
        }
    }

    return null;
}
//#endregion

//#region DECODING
function decode(code) {
    let decoded = "";
    // replace extra spaces for convenient typing on phone
    const symbols = code.replace(/\ ./gm, "").split(splitChar);

    for (let char of symbols) {
        if (char.startsWith("_")) {
            decoded += " ";
            char = char.slice(1);
        }
        // Process non-encoded characters
        if (char.startsWith(escapingChar)) { 
            let str = char.slice(1);
            // if there's an empty string after $, its a split character
            decoded += str == "" ? splitChar : str;
            continue;
        }
        if (!char) continue;

        decoded += decodeSymbol(char);
    }

    return decoded;
}

function decodeSymbol(encoded) {
    const codeRegExp = new RegExp(/(^\.?)\d+(\.?$)/);
    let codeNumber = parseInt(encoded.replace(/\D/g, ""));
    let decodedText = "";

    // Codes should be valid to be processed
    if (!codeRegExp.test(encoded)) {
        throw new HttpError("Неверный код.", 400);
    }

    for (let { number, symbol } of table) {
        if (number == codeNumber) {
            // Getting only first/last/ or all chars in symbol.
            if (encoded.startsWith(".")) decodedText += symbol[0];
            else if (encoded.endsWith(".") && encoded.length > 1) decodedText += symbol[symbol.length - 1];
            else decodedText += symbol;
        }
    }

    return decodedText;
}
//#endregion

module.exports = { 
    decode, encode
}