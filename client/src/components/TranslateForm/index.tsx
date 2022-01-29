// Код хуйня, переделывай
// Теперь чуть получше)
import React, { useEffect, useState } from "react";
import styles from "./styles.module.sass";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import { copyText } from "../../utils";

export default function TranslateForm({
    pastedValue,
    onNewTranslation,
    onShareUpdate,
}: {
    pastedValue: Translation;
    onNewTranslation: (arg1: Translation) => any;
    onShareUpdate: (update: { input: string; encodeMode: boolean } | null) => any;
}) {
    const alert = useAlert();
    const params = useParams<{ id: string }>();
    const [input, setInput] = useState<string>(pastedValue.input);
    const [output, setOutput] = useState<string>(pastedValue.output);
    // Should we encode or decode?
    const [encodeMode, setEncodeMode] = useState<boolean>(pastedValue.decodeMode);
    // Used to wait until user stops typing
    const [typingTimeout, setTypingTimeout] = useState<any>();
    // Used to prevent requesting already known value from history
    const [isPastedFromHistory, setIsPastedFromHistory] = useState<boolean>(false);

    // Check if user is on the link for share, so check if that share exists
    useEffect(() => {
        async function getShare() {
            const res = await axios.get(`${process.env.REACT_APP_DOMAIN}/share/${params.id}`).catch((e) => {
                let msg = e?.response?.data?.message ?? "Ошибка на сервере.";
                alert.error(msg);
            });
            if (res) {
                setInput(res.data.input);
                setEncodeMode(res.data.encodeMode);

                if (params.id === "ad") {
                    if (localStorage.getItem("seenAdvHint") !== "1") {
                        alert.info("Обновите страницу, чтобы получить новую цитату.");
                        localStorage.setItem("seenAdvHint", "1");
                    }
                }
            }
        }
        if (params.id) {
            getShare();
        }
    });

    function swapModes() {
        setEncodeMode(!encodeMode);

        if (output && input) {
            const original = input;
            setInput(output);
            setOutput(original);
            return;
        }
    }

    useEffect(() => {
        onShareUpdate(output ? { input, encodeMode } : null);
    }, [output]);

    useEffect(() => {
        // Should request only if new text was passed to the input
        // (Means excluding something pasted from history (exception: translated text is empty) or just swapped already encoded value)
        if (input && (!isPastedFromHistory || !output)) {
            // Timeout is used to give user some time to end the phrase
            if (typingTimeout) clearTimeout(typingTimeout);
            setTypingTimeout(
                setTimeout(async () => {
                    try {
                        const { data } = await axios.post(`${process.env.REACT_APP_DOMAIN}/cipher/${encodeMode ? "encode" : "decode"}`, {
                            original: input,
                        });
                        setOutput(data.result);

                        onNewTranslation({
                            output: data.result,
                            input: input,
                            decodeMode: encodeMode,
                        });
                    } catch (e: any) {
                        let msg = e?.response?.data?.message ?? "Ошибка на сервере.";
                        alert.error(msg);
                    }
                }, 1000)
            );
        } else {
            // Clear translated text if original text is none
            if (output && !isPastedFromHistory) setOutput("");
            clearTimeout(typingTimeout);
        }

        // After we checked current original text update, we can drop all indicators for text
        // So we know that the next text change will be ok to translate
        setIsPastedFromHistory(false);
    }, [input, encodeMode]);

    // Handle pasting from the history
    useEffect(() => {
        setEncodeMode(pastedValue?.decodeMode);
        setInput(pastedValue.input);
        setOutput(pastedValue.output);
    }, [pastedValue]);

    function copyTranslated() {
        if (output) {
            copyText(output);
            alert.show("Текст скопирован в буфер обмена.");
        }
    }

    function clearFields() {
        setInput("");
        setOutput("");
    }

    return (
        <div className={styles["translate-form"]}>
            <div className={styles["mode-swapper"]}>
                <span>{encodeMode ? "Текст" : "Код"}</span>
                <SwapHorizIcon onClick={swapModes} />
                <span>{encodeMode ? "Код" : "Текст"}</span>
            </div>

            <div className={styles.results}>
                <textarea
                    id="from"
                    className={styles.input}
                    cols={40}
                    rows={10}
                    placeholder={`${encodeMode ? "Текст..." : "Код"}`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <textarea
                    id="to"
                    className={styles.output}
                    cols={40}
                    rows={10}
                    readOnly
                    placeholder={`${encodeMode ? "Код" : "Текст..."}`}
                    value={output}
                ></textarea>
                <div className={styles["menu-buttons"]}>
                    <ClearIcon onClick={clearFields} />
                    <ContentPasteIcon onClick={copyTranslated} />
                </div>
            </div>
        </div>
    );
}
