import React, { useEffect, useRef, useState } from "react";
import FullscreenModal from "../FullscreenModal";
import TranslateForm from "../TranslateForm";
import History from "../../assets/History.svg";
import styles from "./styles.module.css";
import TranslateHistory from "../TranslateHistory";

const mobileScreenWidth = 900;

export default function Translate() {
    const [isHistoryOpened, setHistoryOpened] = useState<boolean>(false);
    const [selected, setSelected] = useState<Translation>({ originalText: "", translatedText: "", isEncoding: true });
    const [history, setHistory] = useState<Translation[]>([]);
    const historyListRef = useRef<HTMLDivElement>(null);


    function onHistorySelect(selected: Translation) {
        setSelected(selected);
        if (window.screen.width <= mobileScreenWidth) {
            setHistoryOpened(false);
        }
    }

    function clearHistory() {
        setHistory([]);
    }


    useEffect(() => {
        const savedHistory = localStorage.getItem("history");
        try {
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory) as Translation[];
                setHistory(parsedHistory);
            }
        } catch {
            return;
        }
    }, []);

    function saveToHistory(newSave: Translation) {
        setHistory([...history, newSave]);
    }

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);


    function toggleHistory() {
        setHistoryOpened(!isHistoryOpened);
        if (window.screen.width >= mobileScreenWidth) {
            const isOpened = historyListRef.current?.classList.contains(styles.active);
            if (isOpened) {
                return historyListRef.current?.classList.remove(styles.active);
            }
            return historyListRef.current?.classList.add(styles.active);
        }

    }
    return (
        <div className={styles.container}>
            <div className={styles["translate-wrapper"]}>
                <TranslateForm selected={selected} save={saveToHistory} />
                <div className={styles["history-btn"]} onClick={toggleHistory}>
                    <img src={History} alt="History" />
                    <span>История</span>
                </div>
            </ div>
            {

                // rendering different representation of history based on screen width
                window.screen.width >= mobileScreenWidth ?
                    (<div ref={historyListRef} id="history" className={styles["history-container"]}>
                        <TranslateHistory
                            clearHistory={clearHistory}
                            history={history}
                            onHistorySelect={onHistorySelect}
                            toggleHistory={toggleHistory}
                        />
                    </div>) :
                    (<FullscreenModal isOpened={isHistoryOpened}>
                        <TranslateHistory
                            clearHistory={clearHistory}
                            history={history}
                            onHistorySelect={onHistorySelect}
                            toggleHistory={toggleHistory}
                        />
                    </ FullscreenModal>)

            }
        </div >
    )
}