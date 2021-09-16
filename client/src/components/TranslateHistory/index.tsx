import React from "react";
import Close from "../../assets/Close.svg";
import Trash from "../../assets/Trash.svg";
import HistoryList from "../HistoryList";
import styles from "./styles.module.css";


interface Props {
    toggleHistory: () => void;
    history: Translation[];
    onHistorySelect: (arg1: Translation) => void;
    clearHistory: () => void
}

export default function TranslateHistory(props: Props) {
    return (
        <>
            <div className={styles["history-header"]}>
                <img src={Close} alt="close" onClick={props.toggleHistory} />
                <span>История</span>
            </div>
            <HistoryList list={props.history} onSelect={props.onHistorySelect} />
            <div className={styles["history-menu"]} >
                <div className={styles["menu-btn"]} onClick={props.clearHistory}>
                    <img src={Trash} alt="clear" />
                    <span>Очистить</span>
                </div>
            </div>
        </>
    );
}