import React, { ReactChild, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.sass";

interface Props {
    isOpened: boolean;
    children: ReactChild | ReactChild[] | null;
    title: string;
    onClose: () => any;
}

export default function FullscreenModal({ isOpened, children, onClose, title }: Props) {
    // Disable scrolling when modal is open
    useEffect(() => {
        document.body.style.overflowY = isOpened ? "hidden" : "auto";
    }, [isOpened]);

    return (
        <div id="backdrop" className={`${styles.backdrop} ${isOpened ? styles.opened : styles.closed}`}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <CloseIcon onClick={onClose} />
                    <span>{title}</span>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
