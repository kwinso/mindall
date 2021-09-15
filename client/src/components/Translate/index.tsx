import React, { useEffect, useState } from "react";
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
    function openHistory() {
    }
    return (
        <div className={styles.container}>
            <div className={styles["translate-wrapper"]}>
                <TranslateForm selected={selected} save={saveToHistory} />
                <div className={styles["history-btn"]} onClick={openHistory}>
                    <img src={History} alt="History" />
                    <span>История</span>
                </div>
            </ div>
            {
                // rendering different type of history based on screen width
                window.screen.width >= 900 ?
                    (<div id="history" className={styles["history-container"]}>
                        <div className={styles["history-header"]}>
                            <img src={RightArrow} alt="close" />
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