import { useEffect, useState } from "react";
import TranslateForm from "../TranslateForm";
import styles from "./styles.module.sass";

export default function Translate() {
    // Selected value from history. By default is empty
    const [selected, setSelected] = useState<Translation>({ input: "", output: "", encodeMode: true });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const text = params.get("t");
        const isDecoding = params.get("d") === "1";
        if (text) {
            setSelected({ input: text, output: "", encodeMode: !isDecoding });
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles["translate-wrapper"]}>
                <TranslateForm pastedValue={selected} />
            </div>
        </div>
    );
}
