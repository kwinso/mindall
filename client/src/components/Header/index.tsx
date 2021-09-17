import React from "react";
import styles from "./styles.module.css";
import Logo from "../../assets/Logo.svg";

export default function Header() {
    return (
        <header>
            <div className={styles.logo}>
                <img src={Logo} alt="Logo" />
                <span>Mindall</span>
            </div>
            {/* <a href="/chat">
                <button className={styles.chat}>
                    <img src={Chat} alt="Chat" />
                </button>
            </a> */}
        </header>
    );
}