import {cookies} from 'next/headers';

const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? '';
}

export const getStytchCookie = async () => getCookie('stytch_session_jwt');