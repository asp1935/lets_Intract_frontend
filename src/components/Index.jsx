import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Home from './Home'
import { Outlet } from 'react-router'

function Index() {
    return (
        <div className='flex'>

            <div className='w-[21vw]'>
                <Sidebar />
            </div>
            <div className='w-[79vw]'>
                <Navbar />
                <div className='relative top-[15vh] ml-3'>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Index
