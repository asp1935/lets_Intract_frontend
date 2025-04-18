import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from '../../redux/slice/UserSlice';
import { Navigate, Outlet } from 'react-router';
import PropTypes from 'prop-types';
import { showToast } from '../../redux/slice/ToastSlice';
// import { showToast } from '../../redux/slice/ToastSlice';

function ProtededRoute({ allowedPermission }) {
    const currectUser = useSelector(user);
    const dispatch = useDispatch();
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        if (!currectUser) {
            setRedirectPath("/login");
        }

        // const { role, permissions } = currectUser;   
        const role=currectUser?.role;
        const permissions=currectUser?.permissions
        // Allow full access for admin/superadmin
        if (role === "admin" || role === "superadmin") return;

        // For staff, check permission
        if (role === "user" && allowedPermission) {

            if (!permissions?.includes(allowedPermission)) {
                setRedirectPath("/"); // Or home
                dispatch(showToast({ message: 'Unauthorized Access', type: 'warn' }))
            }
            return
        }

    }, [currectUser, allowedPermission, dispatch]);

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }
    if (!currectUser) return null;
    return <Outlet />;
}

ProtededRoute.propTypes = {
    allowedRoles: PropTypes.array,
};

export default ProtededRoute;
