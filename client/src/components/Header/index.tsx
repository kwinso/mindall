import React from "react";
import styles from "./styles.module.sass";
import Logo from "../../assets/Logo.svg";

export default function Header() {
    return (
        <header>
            <div className={styles.logo}>
                <img src={Logo} alt="Logo" />
                <span>Mindall</span>
            </div>
        </header>
    );
}
