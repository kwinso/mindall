import { useState } from "react";
import styles from "./styles.module.sass";

interface Props {
    onSubmit: (s: string) => void
}

export function ChatSignIn(props: Props) {
    const [value, setValue] = useState("");

    return <div className={styles.signIn}>
        <h1>Чат</h1>
        <h5>Чат Mindall будет преобразовываeт ваши сообщения в шифр налету!</h5>
        <input onChange={(v) =>  setValue(v.target.value)} placeholder="Придумайте имя..." />

        <button onClick={() => props.onSubmit(value)}>Присоединиться!</button>
    </div>
}