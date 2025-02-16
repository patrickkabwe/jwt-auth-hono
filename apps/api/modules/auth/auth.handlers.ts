import { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'
import { decodeToken, generateToken, verifyToken } from '../../utils'
import { createRefreshToken, createUser, getRefreshToken, getUserByEmail } from './auth.service'

export const authMiddlewareHandler = createMiddleware(async (c, next) => {
    const authToken = c.req.header('Authorization')
    if (!authToken) {
        return c.json({ message: 'No token provided' }, 401)
    }

    const [_, token] = authToken.split(' ')


    try {
        const jwt = await verifyToken(token)
        c.set('userId', jwt.payload.sub)
        return await next()
    } catch (e) {
        // console.log(e);

        return c.json({ message: 'Session Expired' }, 403)
    }
})

export const authHandler = async (c: Context) => {
    const user = c.var.user
    return c.json(user)
}

export const loginHandler = async (c: Context) => {
    const payload = await c.req.json()
    const user = await getUserByEmail(payload.email)
    if (!user) {
        return c.status(401)
    }

    // const passwordMatch = await bcrypt.compare(payload.password, user.password)

    // if (!passwordMatch) {
    //     return c.status(401)
    // }

    const accessToken = await generateToken(user.id, '2s')

    const refreshToken = await generateToken(user.id, '7d')

    await createRefreshToken({ userId: user.id, token: refreshToken })

    setCookie(c, 'refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    })

    return c.json({ accessToken })
}

export const registerHandler = async (c: Context) => {
    const payload = await c.req.json()
    return c.json(createUser(payload))
}

export const logoutHandler = async (c: Context) => {
    return c.text('logoutHandler')
}

export const refreshHandler = async (c: Context) => {
    try {
        const refreshToken = getCookie(c, 'refreshToken')
        if (!refreshToken) {
            return c.json({ message: 'No token provided' }, 401)
        }

        const userId = await decodeToken(refreshToken)

        if (!userId) {
            return c.json({ message: 'Invalid token' }, 401)
        }

        const rt = await getRefreshToken(userId, refreshToken)

        if (!rt) {
            return c.json({ message: 'Invalid token' }, 401)
        }

        await verifyToken(rt)

        const newRefreshToken = await generateToken(userId, '7d')
        setCookie(c, 'refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
        })

        await createRefreshToken({ userId, token: newRefreshToken })
        const accessToken = await generateToken(userId, '2s')

        return c.json({ accessToken })

    } catch (error) {
        if (error instanceof jose.errors.JWTExpired) {
            console.log('Session Expired', error);
            return c.text('Session Expired', 401)
        }
        throw error
    }
}

export const authHandlers = {
    loginHandler,
    registerHandler,
    logoutHandler,
    refreshHandler
}

