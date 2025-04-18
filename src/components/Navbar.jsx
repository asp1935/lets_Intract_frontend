import React from 'react';
import { logout } from '../api/adminApi';
// import { useNavigate } from 'react-router'; // ✅ useNavigate instead of NavLink
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/slice/ToastSlice';
import { useNavigate } from 'react-router';
import { setLogoutAdmin } from '../redux/slice/UserSlice';

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // ✅ Hook to programmatically navigate

    const handleLogoutAdmin = async () => {
        try {
            const response = await logout();

            if (response.statusCode == 200) {
                dispatch(showToast({ message: 'Logged Out Successfully' }));
                dispatch(setLogoutAdmin())
                navigate('/login'); // ✅ Redirect to login
            } else {
                dispatch(showToast({message:'Something went Wrong',type:'warn'}));
            }
        } catch (error) {
            dispatch(showToast('Logout Failed'));
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-[#640D5F] navbar text-white p-4 py-3 flex items-center justify-between fixed top-0 right-0 z-50 w-full">
            <div className="ml-auto">
                <button
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={handleLogoutAdmin}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
