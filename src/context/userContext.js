'use client';

import { useState, createContext, useEffect } from 'react';
import { useFetch } from '@/lib/hooks/useFetch';
import { MoonLoader } from 'react-spinners';
import { getRankSymbol } from '@/utils/helpers';
import { LucideFlameKindling } from 'lucide-react';


export const userContext = createContext({})

const UserProvider = ({ children }) => {
    const { loading, error, data, refetch } = useFetch('/api/users', {}, true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!loading && data) {
            let result = { ...data?.user } || null
            result.rank = getRankSymbol(result.xp)
            setUser({ ...result })
            console.log("result", result);
        }
    }, [data])

    return (
        <userContext.Provider value={{ user, setUser, loading }}>
            {loading ? <div className="h-screen w-full flex items-center justify-center">
                <MoonLoader size={20} color="gray" />
            </div> :( children)}
        </userContext.Provider>
    )
}

export default UserProvider