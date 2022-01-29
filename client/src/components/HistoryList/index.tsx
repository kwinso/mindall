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
                [...props.list].reverse().map(({ input: input, output: output, decodeMode: encodeMode }, i) => {
                    return (
                        <div
                            key={i}
                            title="Перевести снова"
                            onClick={() => props.onSelect({ input: input, output: output, decodeMode: encodeMode })}
                        >
                            <span className={styles.original}>{cropText(input, 20)}</span>
                            <br />
                            <span className={styles.translated}>{cropText(output, 30)}</span>
                        </div>
                    );
                })
            ) : (
                <span className={styles.empty}>Здесь пока ничего.</span>
            )}
        </div>
    );
}
