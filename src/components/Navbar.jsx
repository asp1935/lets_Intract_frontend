import React from 'react'

function Navbar() {
    return (
            <nav className="bg-[#640D5F] navbar text-white p-4 py-3 flex items-center justify-between fixed top-0  right-0 z-50 w-full  " >
                <div className="ml-auto">
                    <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition">
                        Logout
                    </button>
                </div>
            </nav>
    )
}

export default Navbar
