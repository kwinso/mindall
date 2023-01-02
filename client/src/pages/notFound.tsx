import { Link } from "react-router-dom";
import styles from "./notFound.module.sass"

export function NotFoundPage() {
    return <div className={styles.notFound}>
        <span>Ой, страница не найдена...</span>
        <Link className="buttonLink" to="/">Домой</Link>
    </div>
}