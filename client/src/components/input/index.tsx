import React, { ChangeEventHandler } from "react"
import { PropsWithChildren } from "react"
import styles from "./styles.module.sass"

interface Props {
    placeholder: string
    value: string | undefined
    readOnly?: boolean
    onChange?: ChangeEventHandler<HTMLTextAreaElement>
}
export function AppInput(props: PropsWithChildren<Props>) {

    return <div className={styles.inputContainer}>
        <textarea
            cols={40}
            readOnly={props.readOnly}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />

        <div className={styles.inputButtons}>
            {props.children}
        </div>
    </div>
}