import styles from "./styles.module.sass";
import Logo from "../../assets/logo.svg"

export function Header() {
    return  <div className={styles.header}>
        <img src={Logo} alt="Mindall" />
    </div>
}