import styles from "./styles.module.sass";
import Logo from "../../assets/logo.svg"
import NewYearLogo from "../../assets/new-year-logo.svg";
import { Link, useLocation } from "react-router-dom";
import { checkNewYearTime } from "../../utils/newYear";

export function Header() {
    const isNewYearTime = checkNewYearTime();

    const { pathname } = useLocation();

    return <div className={styles.header}>
        <div />
        <img src={isNewYearTime ? NewYearLogo : Logo} alt="Mindall" />


        <div className={styles.links}>
            {pathname == "/" && <Link className="buttonLink" to="/chat" >Чат</Link>}
            {pathname == "/chat" && <Link className="buttonLink" to="/" >Главная</Link>}

        </div>
    </div>
}