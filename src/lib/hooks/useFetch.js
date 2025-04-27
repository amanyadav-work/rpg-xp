"use client";

import { useState, useEffect, useCallback } from "react";

export function useFetch(url, options = {}, autoFetch = true, withToken) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (customOptions = {}) => {
        setLoading(true);
        setError(null);

        let headers = {};
        const token = localStorage.getItem('jwttoken');
        if (autoFetch || withToken) {
            console.log("Fetching data from URL:", url);

            headers = {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {}),
            }
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers,
                ...options,
                ...customOptions,
            });

            const json = await res.json();
            if (res.status === 201) {
                setData(json);
                return { success: true, data: json };
            } else {
                const message = json.message || json.error || "Something Went Wrong" ;
                setError(message);
                console.log(message);
                return { success: false, message: message };
            }
        } catch (err) {
            const message = err.message || "Something Went Wrong";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch]);

    return { data, loading, error, refetch: fetchData };
}
