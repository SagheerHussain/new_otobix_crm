import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const Authenticated = () => {

    const isUserFound = JSON.parse(localStorage.getItem("token"));

    return (
        <>
        {
            isUserFound ? <Outlet /> : <Navigate to={`/login`} />
        }        
        </>
    )
}

export default Authenticated