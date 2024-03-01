import React from 'react'
import { Course } from '.'
import {Link, useNavigate} from "react-router-dom";

export default function Card(props: Course) {
    const { id,name, description, content } = props
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/course/${id}`, { state: { course: { id, name, description, content } } })} className="cursor-pointer">
        <div className="mr-4 mb-8 shadow-lg w-72 rounded-lg">
            <div className="w-full h-32 bg-zinc-700 rounded-t-lg"></div>
            <div className="p-4">
                <p className="text-sm font-bold text-zinc-700">{name}: {description}</p>
            </div>
        </div>
        </div>
    )
}
