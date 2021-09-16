import React, { ReactChild, useEffect } from "react";
import styles from "./styles.module.css";

interface Props {
    isOpened: boolean;
    children: ReactChild | ReactChild[],
}

export default function FullscreenModal({ isOpened, children }: Props) {
    useEffect(() => {
        if (isOpened)
            window.scrollTo({ top: 0 });
    }, [isOpened]);
    return (
        isOpened ? (
            <div className={styles.modal}>
                { children }
            </div>
        ) : null
    );
}