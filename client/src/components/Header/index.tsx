import React from "react";
import styles from "./styles.module.sass";
import Logo from "../../assets/icons/logo.svg";

export default function Header() {
    return (
        <header>
            <div className={styles.logo}>
                <img src={Logo} alt="Mindall" />
            </div>
        </header>
    );
}
