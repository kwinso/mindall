import styles from "./styles.module.sass";
import Logo from "../../assets/logo.svg"
import NewYearLogo from "../../assets/new-year-logo.svg";

export function Header(props: { isNewYearTime: boolean }) {
    return  <div className={styles.header}>
        <img src={props.isNewYearTime ? NewYearLogo : Logo} alt="Mindall" />
    </div>
}