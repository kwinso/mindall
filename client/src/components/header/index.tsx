import styles from "./styles.module.sass";
import Logo from "../../assets/logo.svg"
import NewYearLogo from "../../assets/new-year-logo.svg";
import { Link, useLocation } from "react-router-dom";

export function Header(props: { isNewYearTime: boolean }) {
    const { pathname } = useLocation();

    return <div className={styles.header}>
        <div />
        <img src={props.isNewYearTime ? NewYearLogo : Logo} alt="Mindall" />


        <div className={styles.links}>
            {pathname == "/" && <Link className="buttonLink" to="/chat" >Чат</Link>}
            {pathname == "/chat" && <Link className="buttonLink" to="/" >Главная</Link>}

        </div>
    </div>
}