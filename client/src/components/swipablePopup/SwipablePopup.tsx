import React, { ReactChild, ReactChildren } from "react";

interface Props {
    isOpened: boolean;
    children: ReactChild | ReactChildren,
}

export default function SwipablePopup(props: Props) {
    if (!props.isOpened) {
        return null;
    }
    return (
        <div>Hello</div>
    )
}