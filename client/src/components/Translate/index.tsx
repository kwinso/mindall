import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import TranslateForm from "../TranslateForm";
import HistoryIcon from "@mui/icons-material/History";
import ShareIcon from "@mui/icons-material/Share";
import Share from "../../components/Share";
import styles from "./styles.module.css";
import TranslateHistory from "../TranslateHistory";
import { useHotkeys } from "react-hotkeys-hook";

const mobileScreenWidth = 900;

export default function Translate() {
    const [isHistoryOpened, setHistoryOpened] = useState<boolean>(false);
    const [isShareModalOpened, setShareOpened] = useState<boolean>(false);
    const [shareInfo, setShareInfo] = useState<{ originalText: string; isEncoding: boolean } | null>(null);
    // Selected value from history. By default is empty
    const [selected, setSelected] = useState<Translation>({ originalText: "", translatedText: "", isEncoding: true });
    const [history, setHistory] = useState<Translation[]>([]);
    const historyListRef = useRef<HTMLDivElement>(null);

    function onHistorySelect(selected: Translation) {
        setSelected(selected);
        setHistoryOpened(false);
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

        const params = new URLSearchParams(window.location.search);
        const text = params.get("t");
        const isDecoding = params.get("d") === "1";
        if (text) {
            setSelected({ originalText: text, translatedText: "", isEncoding: !isDecoding });
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
                <TranslateForm selected={selected} save={saveToHistory} onShareUpdate={setShareInfo} />
                <div className={styles.menu}>
                    <div title="Открыть Историю (Shift + H)" className={styles["menu-btn"]} onClick={toggleHistory}>
                        <HistoryIcon />
                        <span>История</span>
                    </div>
                    <button disabled={!shareInfo} title="Поделиться" className={styles["menu-btn"]} onClick={() => setShareOpened(true)}>
                        <ShareIcon />
                        <span>Поделиться</span>
                    </button>
                </div>
            </div>
            <Modal isOpened={isHistoryOpened} onClose={() => setHistoryOpened(false)} title="История">
                <TranslateHistory clearHistory={clearHistory} history={history} onHistorySelect={onHistorySelect} />
            </Modal>
            <Modal isOpened={isShareModalOpened} onClose={() => setShareOpened(false)} title="Поделиться">
                {shareInfo && <Share info={shareInfo} />}
            </Modal>
        </div>
    );
}
