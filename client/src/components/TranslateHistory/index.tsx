import React from "react";
import HistoryList from "../HistoryList";
import styles from "./styles.module.sass";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Props {
    history: Translation[];
    onHistorySelect: (arg1: Translation) => void;
    clearHistory: () => void;
}

export default function TranslateHistory(props: Props) {
    return (
        <>
            <HistoryList list={props.history} onSelect={props.onHistorySelect} />
            <div className={styles["history-menu"]}>
                <div className={styles["menu-btn"]} onClick={props.clearHistory}>
                    <DeleteForeverIcon />
                    <span>Очистить</span>
                </div>
            </div>
        </>
    );
}
