import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Swap from "../../assets/Swap.svg";
import axios from "axios";
import { useHotkeys } from "react-hotkeys-hook";


export default function TranslateForm({ selected, save: saveToLocalStorage }: { selected: Translation, save: (arg1: Translation) => void }) {
    const [originalText, setOriginalText] = useState<string>(selected.originalText);
    const [translatedText, setTranslatedText] = useState<string>(selected.translatedText);
    // Should we encode or decode?
    const [isEncoding, setEncoding] = useState<boolean>(selected.isEncoding);
    const [isTextSwapped, setTextSwapped] = useState<boolean>(false);
    // Used to request API with delay
    const [typingTimeout, setTypingTimeout] = useState<any>();
    // Used to prevent requesting already known value from history
    const [isPastedFromHistory, setIsPastedFromHistory] = useState<boolean>(false); 

    useEffect(() => {
        const from = document.querySelector("textarea#from") as HTMLTextAreaElement;
        const to = document.querySelector("textarea#to") as HTMLTextAreaElement;

        from.placeholder = isEncoding ? "Текст..." : "Код...";
        to.placeholder = isEncoding ? "Код..." : "Текст...";

    }, [isEncoding]);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // Should request only if new text was passed to the input
        // (Means excluding something pasted from history or just swapped already encoded value)
        if (originalText && !isTextSwapped && !isPastedFromHistory) {
            // Timeout is used to give user some time to end the phrase
            clearTimeout(typingTimeout);
            setTypingTimeout(setTimeout(async () => {
                try {
                    const { data } = await axios.post(`${process.env.REACT_APP_DOMAIN}/cipher/${isEncoding ? "encode" : "decode"}`, { original: originalText });
                    setTranslatedText(data.result);

                    saveToLocalStorage({
                        translatedText: data.result,
                        originalText,
                        isEncoding
                    })
                } catch (e: any) {
                    // @ts-ignore
                    if (e?.response?.data?.error) {
                        setTranslatedText(e.response.data.message);
                    }
                }

            }, 1000));
        }
        // After we checked current original text update, we can drop all indicators for text
        // So we know that the next text change will be ok to translate
        setTextSwapped(false);
        setIsPastedFromHistory(false);

    }, [originalText]);

    useEffect(() => {
        setIsPastedFromHistory(true);
        setOriginalText(selected.originalText);
        setTranslatedText(selected.translatedText);
        setEncoding(selected?.isEncoding);
    }, [selected]);


    function swapModes() {
        if (translatedText) {
            const original = originalText;
            setOriginalText(translatedText === "Неверный код." ? "" : translatedText);
            setTranslatedText(original);
            setTextSwapped(true);
        }
        setEncoding(!isEncoding);
    }

    return (
        <div className={styles["translate-form"]} >
            <div className={styles['mode-swapper']}>
                <span>{isEncoding ? "Текст" : "Код"}</span>
                <img title="Развернуть текст (Shift + S)" src={Swap} alt="Swap" onClick={swapModes} />
                <span>{isEncoding ? "Код" : "Текст"}</span>
            </div>

            <div className={styles.results}>
                <textarea
                    id="from"
                    className={styles.input}
                    cols={40}
                    rows={10}
                    placeholder="Текст..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                >
                </textarea>
                <textarea
                    id="to"
                    className={styles.output}
                    cols={40} rows={10}
                    readOnly
                    placeholder="Код..."
                    defaultValue={translatedText}
                >
                </textarea>
            </div>
        </div>
    );
}