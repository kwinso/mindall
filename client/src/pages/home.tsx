import TranslateForm from "../components/translate-form";
import packageInfo from "../../package.json"

export function HomePage() {
    return <>
        <TranslateForm />
        <div className="footer">
            Mindall v{packageInfo.version}
            <br />
            By <a href={packageInfo.author.url}>{packageInfo.author.name}</a>
        </div>
    </>
}