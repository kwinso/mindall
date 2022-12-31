// Код хуйня, переделывай
// Теперь чуть получше)
import React, { useEffect, useState } from "react";
import styles from "./styles.module.sass";
import SwapHorizIcon from "../../assets/icons/swap.svg";
import Copy from "../../assets/icons/copy.svg";
import Delete from "../../assets/icons/delete.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import { copyText } from "../../utils";

export default function TranslateForm({
    pastedValue,
}: {
    pastedValue: Translation;
}) {
    const alert = useAlert();
    const params = useParams<{ id: string }>();
    const [input, setInput] = useState<string>(pastedValue.input);
    const [output, setOutput] = useState<string>(pastedValue.output);
    const [inShareMode, setShareMode] = useState<boolean>(false);
    // Should we encode or decode?
    const [encodeMode, setEncodeMode] = useState<boolean>(pastedValue.encodeMode);
    // Used to wait until user stops typing
    const [typingTimeout, setTypingTimeout] = useState<any>();
    // Used to prevent requesting already known value from history
    const [isPastedFromHistory, setIsPastedFromHistory] = useState<boolean>(false);

    function translateInput(t: string, encodeMode: boolean) {
        setInput(t);
        setEncodeMode(encodeMode);

        // Should request only if new text was passed to the input
        // (Means excluding something pasted from history (exception: translated text is empty) or just swapped already encoded value)
        if (t && (!isPastedFromHistory || !output)) {
            // Timeout is used to give user some time to end the phrase
            if (typingTimeout) clearTimeout(typingTimeout);
            setTypingTimeout(
                setTimeout(async () => {
                    try {
                        const { data } = await axios.get(`${process.env.REACT_APP_DOMAIN ?? ""}/${encodeMode ? "encode" : "decode"}`, {
                            params: { text: t }
                        });
                        setOutput(data.result);
                    } catch (e: any) {
                        let msg = e?.response?.data?.message ?? "Ошибка на сервере.";
                        alert.error(msg);
                    }
                }, 1000)
            );
        } else {
            // Clear translated text if original text is none
            if (output && !isPastedFromHistory) {
                setOutput("");
            }

            clearTimeout(typingTimeout);
        }

        // After we checked current original text update, we can drop all indicators for text
        // So we know that the next text change will be ok to translate
        setIsPastedFromHistory(false);
    }

    // Check if user is on the link for share, so check if that share exists
    useEffect(() => {
        async function getShare() {
            const res = await axios.get(`${process.env.REACT_APP_DOMAIN}/share/${params.id}`).catch((e) => {
                let msg = e?.response?.data?.message ?? "Ошибка на сервере.";
                alert.error(msg);
            });
            if (res) {
                setIsPastedFromHistory(true);
                setShareMode(true);
                translateInput(res.data.input, res.data.encodeMode);

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
    }, []);

    function swapModes() {
        if (input && output) {
            const original = input;
            setInput(output);
            setEncodeMode(!encodeMode);
            setOutput(original);

            return;
        }

        translateInput(input, !encodeMode);
    }

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
                {inShareMode ? (
                    <div
                        className={styles.reveal}
                        onClick={() => {
                            setShareMode(false);
                        }}
                    >
                        <span>Показать текст</span>
                        <VisibilityIcon />
                    </div>
                ) : (
                    <>
                        <span>{encodeMode ? "Текст" : "Код"}</span>
                        <img src={SwapHorizIcon} onClick={swapModes} alt="Swap" />
                        <span>{encodeMode ? "Код" : "Текст"}</span>
                    </>
                )}
            </div>


            <div className={styles.inputContainer}>
                <textarea
                    id="from"
                    className={styles.input}
                    cols={40}
                    rows={10}
                    placeholder={`${encodeMode ? "Текст..." : "Код..."}`}
                    value={input}
                    onChange={(e) => translateInput(e.target.value, encodeMode)}
                />
                <div className={styles.inputButtons}>
                    <img src={Delete} onClick={clearFields} />
                </div>
            </div>

            <div className={styles.inputContainer}>
                <textarea
                    id="to"
                    className={styles.output}
                    cols={40}
                    rows={10}
                    readOnly
                    placeholder={encodeMode ? "Код..." : "Текст..."}
                    value={output}
                />
                <div className={styles.inputButtons} onClick={copyTranslated}>
                    <img src={Copy} />
                </div>
            </div>

            {/* <div className={styles["menu-buttons"]}>
                {!inShareMode && <ClearIcon onClick={clearFields} />}
                <ContentPasteIcon onClick={copyTranslated} />
            </div> */}
        </div>
    );
}
