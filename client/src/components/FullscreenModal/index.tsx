import React, { ReactChild, useEffect } from "react";
import styles from "./styles.module.css";

interface Props {
    isOpened: boolean;
    children: ReactChild | ReactChild[],
}

export default function FullscreenModal({ isOpened, children }: Props) {
    // Disable scrolling when modal is open
    useEffect(() => {
        document.body.style.overflowY = isOpened ? "hidden" : "auto";
    }, [isOpened]);

    return (
        isOpened ? (
            <div className={styles.modal}>
                { children }
            </div>
        ) : null
    );
}