import React, { useEffect, useState } from "react";
import styles from "./TranslateForm.module.css";
import Swap from "../../assets/Swap.svg";
import History from "../../assets/History.svg";
import axios from "axios";

export default function TranslateForm() {
    const [originalText, setOriginalText] = useState<string>("");
    const [isTextSwapped, setTextSwapped] = useState<boolean>(false);
    const [translatedText, setTranslatedText] = useState<string>("");
    const [isEncodingMode, setEncodingMode] = useState<boolean>(true);
    const [typingTimeout, setTypingTimeout] = useState<any>();

    useEffect(() => {
        const from = document.querySelector("textarea#from") as HTMLTextAreaElement;
        const to = document.querySelector("textarea#to") as HTMLTextAreaElement;

        from.placeholder = isEncodingMode ? "Текст..." : "Шифр...";
        to.placeholder = isEncodingMode ? "Шифр..." : "Текст...";

    }, [isEncodingMode]);

    useEffect(() => {
        if (originalText && !isTextSwapped) {
            clearTimeout(typingTimeout);
            setTypingTimeout(setTimeout(async () => {
                try {
                    const { data } = await axios.post(`${process.env.REACT_APP_DOMAIN}/cipher/${isEncodingMode ? "encode" : "decode"}`, { original: originalText });
                    setTranslatedText(data.result);    
                } catch (e: any) {
                    // @ts-ignore
                    if (e?.response?.data?.error) {
                        setTranslatedText(e.response.data.message);
                    }
                }
                
            }, 1000));
        }

        setTextSwapped(false);
       
    }, [originalText, isEncodingMode]);

    function swapModes() {
        if (translatedText) {
            const original = originalText;
            setOriginalText(translatedText === "Неверный шифр." ? "" : translatedText);
            setTranslatedText(original);
            setTextSwapped(true);
        }
        
        setEncodingMode(!isEncodingMode);
    }

    return (
        <>
            <div className={styles['mode-swapper']}>
                <span>{isEncodingMode ? "Текст" : "Шифр"}</span>
                <img src={Swap} alt="Swap" onClick={swapModes} />
                <span>{isEncodingMode ? "Шифр" : "Текст"}</span>
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
            <div className={styles.history}>
                <img src={History} alt="History" />
                <span>История</span>
            </div>
        </>
    );
}