import React from 'react'
import { Course } from '.'

export default function Card(props: Course) {
    const { name, description } = props
    return (
        <div className="mr-4 mb-8 shadow-lg w-72 rounded-lg">
            <div className="w-full h-32 bg-zinc-700 rounded-t-lg"></div>
            <div className="p-4">
                <p className="text-sm font-bold text-zinc-700">{name}: {description}</p>
            </div>
        </div>
    )
}
