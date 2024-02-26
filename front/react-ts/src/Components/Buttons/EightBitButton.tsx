import React from "react"
import "./styles.css"

interface Props {
    children: React.ReactNode
    classNames?: string
    onClick?: () => void
}

export default function EightBitButton(props: Props) {
    const { children, classNames, onClick } = props
    return (
        <a className={`eightbit-btn bg-green-500 ${classNames}`} onClick={onClick}>
            {children}
        </a>
    )
}
