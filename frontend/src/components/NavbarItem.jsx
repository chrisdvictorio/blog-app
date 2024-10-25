import React from "react";

const NavbarItem = ({ category, active, onClick }) => {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-2 hover:text-blue-400 ${active ? "text-blue-400" : ""}`}>
            <div className={`flex size-12 items-center justify-center rounded-2xl border border-dashed shadow-md hover:border-blue-400 ${active ? "border-blue-400" : "border-white"}`}>
                <category.icon className="text-2xl" />
            </div>
            <li className="text-sm font-medium">{category.name}</li>
        </button>
    )
}

export default NavbarItem