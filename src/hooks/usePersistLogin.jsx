// // src/hooks/usePersistLogin.js
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { authService } from '../Api/auth.api';
// import { login, logout } from '../store/authSlice';

// const usePersistLogin = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const persist = async () => {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const user = await authService.getCurrentUser();
//         dispatch(login({
//           userData: user,
//           accessToken: token
//         }));
//       } catch (err) {
//         localStorage.removeItem('accessToken');
//         dispatch(logout());
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     persist();
//   }, [dispatch]);

//   return isLoading;
// };

// export default usePersistLogin;


// src/hooks/usePersistLogin.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshData } from '../store/authSlice';

export default function usePersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { authStatus } = useSelector(state => state.auth);

  useEffect(() => {
    const restoreSession = () => {
      try {
        // Check if user data exists in localStorage
        const accessToken = localStorage.getItem('accessToken');
        const userDataStr = localStorage.getItem('userData');

        if (accessToken && userDataStr) {
          const userData = JSON.parse(userDataStr);
          
          // Restore to Redux
          dispatch(refreshData({
            userData,
            accessToken,
          }));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    // Only restore if not already authenticated
    if (!authStatus) {
      restoreSession();
    } else {
      setIsLoading(false);
    }
  }, [authStatus, dispatch]);

  return isLoading;
}