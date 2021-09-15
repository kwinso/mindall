import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Swap from "../../assets/Swap.svg";
import axios from "axios";

export default function TranslateForm({ selected, save }: { selected: Translation, save: (arg1: Translation) => void }) {
    const [originalText, setOriginalText] = useState<string>(selected.originalText);
    const [translatedText, setTranslatedText] = useState<string>(selected.translatedText);
    const [isEncoding, setEncoding] = useState<boolean>(selected.isEncoding);
    const [isTextSwapped, setTextSwapped] = useState<boolean>(false);
    const [typingTimeout, setTypingTimeout] = useState<any>();

    useEffect(() => {
        const from = document.querySelector("textarea#from") as HTMLTextAreaElement;
        const to = document.querySelector("textarea#to") as HTMLTextAreaElement;

        from.placeholder = isEncoding ? "Текст..." : "Шифр...";
        to.placeholder = isEncoding ? "Шифр..." : "Текст...";

    }, [isEncoding]);

    useEffect(() => {
        if (originalText && !isTextSwapped) {
            clearTimeout(typingTimeout);
            setTypingTimeout(setTimeout(async () => {
                try {
                    const { data } = await axios.post(`${process.env.REACT_APP_DOMAIN}/cipher/${isEncoding ? "encode" : "decode"}`, { original: originalText });
                    setTranslatedText(data.result);
                    save({
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

        setTextSwapped(false);
       
    }, [originalText]);

    useEffect(() => {
        setOriginalText(selected.originalText);
        setTranslatedText(selected.translatedText);
        setEncoding(selected?.isEncoding);
    }, [selected]);

    function swapModes() {
        if (translatedText) {
            const original = originalText;
            setOriginalText(translatedText === "Неверный шифр." ? "" : translatedText);
            setTranslatedText(original);
            setTextSwapped(true);
        }
        
        setEncoding(!isEncoding);
    }

    return (
        <div className={styles["translate-form"]} >
            <div className={styles['mode-swapper']}>
                <span>{isEncoding ? "Текст" : "Шифр"}</span>
                <img src={Swap} alt="Swap" onClick={swapModes} />
                <span>{isEncoding ? "Шифр" : "Текст"}</span>
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
                    placeholder="Шифр..."
                    defaultValue={translatedText}
                >
                </textarea>
            </div>
        </div>
    );
}