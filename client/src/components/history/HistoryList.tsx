import React from "react";
import styles from "./HistoryList.module.css";

export default function HistoryList(props: { list: HistoryElement[], onSelect: (selected: HistoryElement) => any }) {
    return (
        <ul className={styles.list}>
            {props.list.map(({ originalText, translatedText, isFromText }) => {
                return (<li title="Перевести снова" onClick={props.onSelect({ originalText, translatedText, isFromText })}>
                    <span className={styles.original}>{originalText}</span>
                    <br />
                    <span className={styles.translated}>{translatedText}</span>
                    <hr />
                </li>);
            })}
        </ul>
    )
}