"use client"

import React, { useEffect } from 'react'
import { getCookie, setCookie } from "cookies-next";
import { SessionProvider, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { useIsAuth } from '@/hooks/useIsAuth';
import { Logo } from '@/components/logo';
import { BoardsSkeleton } from '@/components/placeholders';
import { API_URL } from '@/helpers/contrants';
import { useAtom } from 'jotai';
import { userAtom } from '@/store';
import { GeneralLoader } from '@/components/loaders';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true)
    const { data: session, status } = useSession()
    const cookie = getCookie("token_2sl");
    const [globalUser, setGlobalUser] = useAtom(userAtom);

    const { isLoadded, isAuthenticated, error } = useIsAuth(cookie);

    /**
     *  Verify if the user is authenticated 
     */
    useEffect(() => {
        if (status === "authenticated") {
            setGlobalUser({ user: session.user })
            if (cookie) {
                if (!isLoadded) {
                    if (!isAuthenticated) {
                        setCookieToken()
                    }
                }
            } else {
                setCookieToken()
            }
        }
        return;
    }
        , [status, isLoadded, isAuthenticated])

    const setCookieToken = () => {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", session?.user?.email || "");
        urlencoded.append("name", session?.user?.name || "");

        fetch(API_URL + "/auth/sessionToken", {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        })
            .then(response => response.json())
            .then(response => {
                setCookie("token_2sl", response?.data?.token);
                const rt = getCookie("token_2sl");
            })
            .catch(error => console.log('error', error)).finally(() => {
                setLoading(false)
            });

    }

    if (isLoadded) {
        return (
            <>
                <SessionProvider>
                    <Navbar />
                    <GeneralLoader />
                </SessionProvider>
            </>
        )
    }

    if (error) {
        return (
            <h1>op
                Ups! there was an error. Please try again later.
            </h1>
        )
    }

    if (!status && status === "unauthenticated") {
        redirect("/loading")
    }

    if (status === "authenticated" && isAuthenticated && cookie) {
        return (
            <>
                <SessionProvider>
                    <Navbar />
                    {children}
                </SessionProvider>
            </>
        )
    }

    if (status === "loading") {
        return (
            <>
                <SessionProvider>
                    <Navbar />
                    <BoardsSkeleton />
                </SessionProvider>
            </>

        )
    }
}

export default DashboardLayout