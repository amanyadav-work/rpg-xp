'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { MoonLoader } from 'react-spinners';
import { userContext } from '@/context/userContext';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { user,loading:userLoading } = useContext(userContext);


    useEffect(() => {
        const token = localStorage.getItem('jwttoken');
        setLoading(true)

      if(!userLoading){  
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // if (decodedToken.role === 'user') {

                // }
                if (pathname === '/onboarding' && user?.interests?.length > 0) {
                    router.push('/dashboard');
                    return;
                }
                if ((user && !user.interests.length > 0) && pathname !== '/onboarding' && pathname !== '/') {
                    router.push('/onboarding');
                    return;
                }

                if (['/login', '/register'].includes(pathname)) {
                    router.push('/dashboard');
                    return;
                }

            } catch (err) {
                console.error('Token decode failed', err);
            }
        } else {
            // No token
            if (!['/', '/login', '/register'].includes(pathname)) {
                router.push('/login');
                return;
            }
        }}



        setLoading(false);
    }, [pathname, router, user]);

    if (loading || userLoading) {
        return (
            <div className="h-[90vh] w-full flex items-center justify-center">
                <MoonLoader size={20} color="gray" />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
