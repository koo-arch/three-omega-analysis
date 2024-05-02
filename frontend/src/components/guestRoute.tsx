import React from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? <Navigate to='/' /> : <Outlet />;
}

export default GuestRoute;