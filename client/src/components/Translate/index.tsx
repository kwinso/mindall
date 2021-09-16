import React, { useEffect, useRef, useState } from "react";
import SwipablePopup from "../FullscreenModal";
import TranslateForm from "../TranslateForm";
import RightArrow from "../../assets/Right.svg";
import TranslateHistory from "../TranslateHistory";
import History from "../../assets/History.svg";
import styles from "./styles.module.css";

export default function Translate() {
    const [isHistoryOpened, setHistoryOpened] = useState<boolean>(false);
    const [selected, setSelected] = useState<Translation>({ originalText: "", translatedText: "", isEncoding: true });
    const [history, setHistory] = useState<Translation[]>([]);
    const historyListRef = useRef<HTMLDivElement>(null); 


    function onHistorySelect(selected: Translation) {
        setSelected(selected);
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


    // ToDo: Animation for opening
    function toggleHistory() {
        const isOpened = historyListRef.current?.classList.contains(styles.active);
        if (isOpened) {
            return historyListRef.current?.classList.remove(styles.active);
        } 
        return historyListRef.current?.classList.add(styles.active);
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
                // rendering different type of history based on screen width
                window.screen.width >= 900 ?
                    (<div ref={historyListRef} id="history" className={styles["history-container"]}>
                        <div className={styles["history-header"]}>
                            <img src={RightArrow} alt="close" onClick={toggleHistory} />
                            <span>История</span>
                        </div>
                        <TranslateHistory list={history} onSelect={onHistorySelect} />
                    </div>) :
                    (<SwipablePopup isOpened={isHistoryOpened}>
                        <TranslateHistory list={history} onSelect={onHistorySelect} />
                    </ SwipablePopup>)

            }
        </div >
    )
}