import React from "react";
import styles from "./styles.module.sass";

function cropText(t: string, max: number) {
    if (t.length > max) {
        return t.slice(0, max) + "...";
    }
    return t;
}

export default function HistoryList(props: { list: Translation[]; onSelect: (selected: Translation) => any }) {
    return (
        <div className={styles.list}>
            {props.list.length ? (
                [...props.list].reverse().map(({ originalText, translatedText, isEncoding }, i) => {
                    return (
                        <div key={i} title="Перевести снова" onClick={() => props.onSelect({ originalText, translatedText, isEncoding })}>
                            <span className={styles.original}>{cropText(originalText, 20)}</span>
                            <br />
                            <span className={styles.translated}>{cropText(translatedText, 30)}</span>
                        </div>
                    );
                })
            ) : (
                <span className={styles.empty}>Здесь пока ничего.</span>
            )}
        </div>
    );
}
