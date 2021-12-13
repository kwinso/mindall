import React, { useEffect, useRef, useState } from "react";
import FullscreenModal from "../FullscreenModal";
import TranslateForm from "../TranslateForm";
import History from "../../assets/History.svg";
import styles from "./styles.module.css";
import TranslateHistory from "../TranslateHistory";
import { useHotkeys } from "react-hotkeys-hook";

const mobileScreenWidth = 900;

export default function Translate() {
    const [isHistoryOpened, setHistoryOpened] = useState<boolean>(false);
    // Selected value from history. By default is empty
    const [selected, setSelected] = useState<Translation | undefined>();
    const [history, setHistory] = useState<Translation[]>([]);
    const historyListRef = useRef<HTMLDivElement>(null);

    function onHistorySelect(selected: Translation) {
        setSelected(selected);
        // If item was selected with mobile fullscreen modal, modal should be closed
        if (window.screen.width <= mobileScreenWidth) {
            setHistoryOpened(false);
        }
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

    function clearHistory() {
        setHistory([]);
    }

    // Keep in sync with saved state
    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    function toggleHistory() {
        setHistoryOpened(!isHistoryOpened);

        // Toggle animations for desktop history sidebar
        if (window.screen.width >= mobileScreenWidth) {
            const isOpened = historyListRef.current?.classList.contains(styles.active);
            if (isOpened) {
                return historyListRef.current?.classList.remove(styles.active);
            }
            return historyListRef.current?.classList.add(styles.active);
        }
    }

    // Shortcut
    useHotkeys("shift + h", toggleHistory);

    return (
        <div className={styles.container}>
            <div className={styles["translate-wrapper"]}>
                <TranslateForm selected={selected} save={saveToHistory} />
                <div title="Открыть Историю (Shift + H)" className={styles["history-btn"]} onClick={toggleHistory}>
                    <img src={History} alt="History" />
                    <span>История</span>
                </div>
            </div>
            {
                // rendering different representation of history based on screen width
                window.screen.width >= mobileScreenWidth ? (
                    <div ref={historyListRef} id="history" className={styles["history-container"]}>
                        <TranslateHistory
                            clearHistory={clearHistory}
                            history={history}
                            onHistorySelect={onHistorySelect}
                            toggleHistory={toggleHistory}
                        />
                    </div>
                ) : (
                    <FullscreenModal isOpened={isHistoryOpened}>
                        <TranslateHistory
                            clearHistory={clearHistory}
                            history={history}
                            onHistorySelect={onHistorySelect}
                            toggleHistory={toggleHistory}
                        />
                    </FullscreenModal>
                )
            }
        </div>
    );
}
