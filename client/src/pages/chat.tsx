import { useState } from "react"
import { ChatSignIn } from "../components/chat/signin";
import styles from "./chat.module.sass"

export function ChatPage() {
    const [username, setUsername] = useState<string>();

    return <div className={styles.signInContainer}>
        {
            username ? <>{username}</> : <ChatSignIn onSubmit={s => setUsername(s)} />
        }
    </div> 
}