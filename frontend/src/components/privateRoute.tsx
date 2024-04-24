import React from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;