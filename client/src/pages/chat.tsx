import { useState } from "react"
import { UsersList } from "../components/chat/userList";
import { ChatSignIn } from "../components/chat/signIn";
import { Header } from "../components/header";
import styles from "./chat.module.sass"

export function ChatPage() {
    // TODO: Remove when done with testing
    const [username, setUsername] = useState<string>("a");
    const users = new Array(11).fill(0).map((_, i) => ({
        username: `Сыыч`,
        usernameColor: "#D97777",
        avatar: "https://avataaars.io/?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Blue01&clotheType=Hoodie&eyeType=EyeRoll&eyebrowType=RaisedExcitedNatural&facialHairColor=Blonde&facialHairType=BeardMagestic&hairColor=Black&hatColor=White&mouthType=Sad&skinColor=Yellow&topType=ShortHairShortWaved"
    }));

    return <div className={styles.container}>
        <Header />
        {username && <UsersList users={users} />}
        {
            username ? null :
                <>
                    <ChatSignIn onSubmit={s => setUsername(s)} />
                    {/* This is needed to place sign in right in middle */}
                    <div />
                </>
        }
    </div>
}