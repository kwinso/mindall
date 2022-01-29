import React, { useState, useEffect } from "react";
import styles from "./styles.module.sass";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import axios from "axios";
import { downloadImage, copyText } from "../../utils";
import { useAlert } from "react-alert";

interface Props {
    info: {
        input: string;
        encodeMode: boolean;
    };
}

interface ShareInfo {
    id: string;
    qr: string;
}

let lastShareText = "";
let lastShare: ShareInfo | undefined;

export default function Share({ info }: Props) {
    const alert = useAlert();
    const [share, setShare] = useState<ShareInfo>();
    const [isError, setError] = useState<boolean>();

    async function createShare() {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_DOMAIN}/share`, info);

            setShare(data);
        } catch (e: any) {
            alert.error("Не удалось создать ссылку: " + e?.repsonse?.data?.message ?? "Ошибка на сервере.");
            setError(true);
        }
    }

    useEffect(() => {
        setError(false);
        if (lastShareText !== info.input) {
            createShare();
            lastShareText = info.input;
        } else {
            setShare(lastShare);
        }
    }, []);

    useEffect(() => {
        lastShare = share;
    }, [share]);

    return !share ? (
        <div className={styles.splash}>
            {isError ? (
                <>
                    <ErrorOutlineIcon />
                    <span>Ой...</span>
                </>
            ) : (
                <>
                    <HourglassEmptyIcon className={styles.load} />
                    <span>Ссылка создается...</span>
                </>
            )}
        </div>
    ) : (
        <div className={styles.container}>
            <div
                onClick={() => {
                    copyText("https://mindall.herokuapp.com/" + share.id);
                    alert.info("Ссылка скопирована.");
                }}
                className={`${styles["raw"]} ${styles.option}`}
            >
                <InsertLinkIcon />
                <span>Скопировать ссылку</span>
            </div>
            <div onClick={() => downloadImage(share.qr)} className={`${styles["qr"]} ${styles.option}`}>
                <img className={styles["qr-image"]} src={`data:image/png;base64,${share.qr}`} alt="QR" />
                <span>Скачать QR</span>
            </div>
        </div>
    );
}
