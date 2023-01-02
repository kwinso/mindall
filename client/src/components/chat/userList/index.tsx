import styles from "./styles.module.sass"

interface Props {
    users: User[]
}

export function UsersList(props: Props) {
    return <div className={styles.userList}>
        {/* <div className={styles.scroll}> */}
            {
                props.users.map(u => {
                    return <div className={styles.user}>
                        <img src={u.avatar} />
                        <span style={{ color: u.usernameColor }}>{u.username}</span>
                    </div>
                })
            }

        {/* </div> */}
    </div>
}