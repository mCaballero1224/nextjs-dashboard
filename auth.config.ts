/*
 * This is the logic to protect routes. This prevents users from
 * accessing the dashboard pages unless they are logged in.
 */
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        /* The authorized callback is used to verify if the request is 
         * authorized to access a page with Next.js Proxy.
         * It is called before the request is completed, and receives
         * `auth` and `reqeuest` properties.
         */
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // redirect unauth'd users to login pages
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    /* The providers array is where you list different login options */
    providers: [], // add providers iwth an empty array for now
} satisfies NextAuthConfig;
