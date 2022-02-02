const { HttpError } = require("../httpError");
const fs = require("fs");
const table = JSON.parse(fs.readFileSync("./table.json"));
const translationMap = JSON.parse(fs.readFileSync("./translateMap.json"));
const escapingChar = "120"; // just beyond the max value in the table
// Represents last number that has own symbol so it can't be used
const EXTRA_VALUES_START = 120;
const splitChar = ";";

const extra = "qwzyjJQ[]{}()!@#$%^&*-+1234567890,./|\\~` "

function getExtraIndex(char) {
    // We start counting extra chars from the last reserved number
    // +1 since indexes are zero-based
    return EXTRA_VALUES_START + 1 + extra.indexOf(char);
}

//#region ENDCODING
function encode(text) {
    // Replacing all russian chars with traslated to eng values
    const chars = Array.from(text).reduce((str, ch) => {
        return str + (translationMap[ch] ?? ch);
    }, "").split("");

    // Output string
    let encoded = "";

    for (let i = 0; i < chars.length;) {
        // Max amount of symbols in symbol is 2, so start with that
        let digitsInSymbol = 2;
        let code = null;

        while (!code) {
            let char = chars.slice(i, i + digitsInSymbol).join("");
            // Nothing to search, end of the string basically
            if (!char) break;

            if (extra.includes(char))
                code = getExtraIndex(char);
            else
                code = getSymbolFromChar(char);

            // If no code, try to get a symbol with lower amount of digits in it
            if (!code) digitsInSymbol--;
            // No acceptable symbol found, leave char as it is.
            if (digitsInSymbol == 0) {
                code = `${escapingChar}${char}`;
                digitsInSymbol = char.length;
            }
        }
        // Add found code to the output string
        if (code)
            encoded += code + splitChar;
        // This needed to skip already encoded chars
        i += digitsInSymbol;
    }

    // Return without trailing comma
    return encoded.replace(/;$/, "");
}

function getSymbolFromChar(char) {
    for (let { symbol, number } of table) {
        if (symbol == char) {
            return `${number}`;
        } else if (symbol.includes(char)) {
            return (symbol.indexOf(char) == 0 ? `.${number}` : `${number}.`);
        }
    }

    return null;

}
//#endregion

//#region DECODING
function decode(code) {
    let decoded = "";
    // replace extra spaces for convenient typing on phone
    const chars = code.replace(/\ ./gm, "").split(splitChar);
    console.log(chars);

    for (let char of chars) {
        // if (char.startsWith(getExtraIndex(" "))) {
        //     decoded += " ";
        //     char = char.slice(1);
        // }
        // Process non-encoded characters
        if (char.startsWith(escapingChar)) {
            let str = char.slice(escapingChar.length);
            // if there's an empty string after split character, its a split character
            decoded += str == "" ? splitChar : str;
            continue;
        }
        if (!char) continue;

        decoded += decodeSymbol(char);
    }

    return decoded;
}

function decodeSymbol(num) {
    const codeRegExp = new RegExp(/(^\.?)\d+(\.?$)/);

    // Codes should be valid to be processed
    if (!codeRegExp.test(num)) {
        throw new HttpError("Неверный код.", 400);
    }

    let codeNumber = parseInt(num.replace(/\D/g, ""));

    if (codeNumber >= EXTRA_VALUES_START) {
        return extra[codeNumber - EXTRA_VALUES_START - 1];
    }

    let decodedValue = "";
    for (let { number, symbol } of table) {
        if (number == codeNumber) {
            // Getting only first/last/ or all chars in symbol.
            if (num.startsWith(".")) decodedValue += symbol[0];
            else if (num.endsWith(".") && num.length > 1) decodedValue += symbol[symbol.length - 1];
            else decodedValue += symbol;
        }
    }



    return decodedValue;
}
//#endregion

module.exports = {
    decode, encode
}