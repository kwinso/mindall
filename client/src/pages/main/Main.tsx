import React, { useState } from "react";
import { useEffect } from "react";
import HistoryList from "../../components/history/HistoryList";
import SwipablePopup from "../../components/swipablePopup/SwipablePopup";
import TranslateForm from "../../components/translate/TranslateForm";
import RightArrow from "../../assets/Right.svg";
import styles from "./Main.module.css";

export default function Main() {
    const [isHistoryOpened, setHistoryOpened] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryElement[]>([]);

    function onHistorySelect(selected: HistoryElement) {

    }

    useEffect(() => {
        const savedHistory = localStorage.getItem("history");
        try {
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory) as HistoryElement[];
                setHistory(parsedHistory);
            }
        } catch {
            return;
        }
    }, []);

    return (
        <div className="container">
            <TranslateForm />
            {
                window.screen.width <= 900 ?
                    (<SwipablePopup isOpened={isHistoryOpened}>
                        <HistoryList list={history} onSelect={onHistorySelect} />
                    </ SwipablePopup>) :
                    (<div className={styles["history-container"]}>
                        <div className={styles["history-header"]}>
                            <img src={RightArrow} alt="close" />
                            <span>История</span>
                        </div>
                        <HistoryList list={history} onSelect={onHistorySelect} />
                    </div>)
            }
        </div>
    )
}