import React, { useEffect, useState } from "react";
import styles from "./styles.module.sass";
import SwapHorizIcon from "../../assets/icons/swap.svg";
import Copy from "../../assets/icons/copy.svg";
import Delete from "../../assets/icons/delete.svg";
import axios from "axios";

import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import { AppInput } from "../input";

interface Translation {
    input: string,
    output: string,
    encodeMode: boolean,
}

export default function TranslateForm({
    // pastedValue,
}: {
        // pastedValue: Translation;
    }) {
    const alert = useAlert();
    const params = useParams<{ id: string }>();
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>();
    // const [inShareMode, setShareMode] = useState<boolean>(false);
    // Should we encode or decode?
    const [encodeMode, setEncodeMode] = useState<boolean>(true);
    // Used to wait until user stops typing
    const [typingTimeout, setTypingTimeout] = useState<any>();
    // Used to prevent requesting already known value from history
    const [isPastedFromHistory, setIsPastedFromHistory] = useState<boolean>(false);

    function copyText(t: string) {
        try {
            navigator.clipboard.writeText(t);
        } catch {
            const el = document.createElement("textarea");
            el.value = t;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            el.select();
            el.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }
    }


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
                        const { data } = await axios.get(`${import.meta.env.VITE_API_ROOT ?? ""}/${encodeMode ? "encode" : "decode"}`, {
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

    function swapModes(e: any) {
        e.preventDefault();
        e.stopPropagation();

        if (input && output) {
            const original = input;
            setInput(output);
            setEncodeMode(!encodeMode);
            setOutput(original);

            return;
        }

        translateInput(input, !encodeMode);
    }

    function copyTranslated(e: any) {
        e.preventDefault();
        e.stopPropagation();

        if (output) {
            copyText(output);
            alert.show("Текст скопирован в буфер обмена.");
        }
    }

    function clearFields(e: any) {
        e.preventDefault();
        e.stopPropagation();

        setInput("");
        setOutput("");
    }

    return (
        <div className={styles["translate-form"]}>
            <div className={styles["mode-swapper"]}>
                <span>{encodeMode ? "Текст" : "Код"}</span>
                <img className={styles.swapButton} src={SwapHorizIcon} onMouseDown={swapModes} alt="Swap" />
                <span>{encodeMode ? "Код" : "Текст"}</span>
                {/* {inShareMode ? (
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
                    </>
                )} */}
            </div>


            <div className={styles.toolbar}>
                <img src={Copy} onMouseDown={copyTranslated} />
                <img className={styles.swapButton} src={SwapHorizIcon} onMouseDown={swapModes} alt="Swap" />
                <img src={Delete} onMouseDown={clearFields} />
            </div>

            <AppInput
                    placeholder={`${encodeMode ? "Текст..." : "Код..."}`}
                    value={input}
                    onChange={(e) => translateInput(e.target.value, encodeMode)}
            >
                <img src={Delete} onClick={clearFields} />
            </AppInput>

            <AppInput
                    placeholder={encodeMode ? "Код..." : "Текст..."}
                    value={output}
                    readOnly
            >
                <img src={Copy} onClick={copyTranslated} />
            </AppInput>
        </div>
    );
}