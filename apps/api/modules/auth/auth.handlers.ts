import { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../../utils'

export const authMiddlewareHandler = createMiddleware(async (c, next) => {
    const authToken = c.req.header('Authorization')
    if (!authToken) {
        return c.status(401)
    }

    const [_, token] = authToken.split(' ')

    try {
        const jwt = await verifyToken(token)
        c.set('userId', jwt.payload.sub)
        return next()
    } catch (e) {
        return c.status(401)
    }
})

export const authHandler = async (c: Context) => {
    const user = c.var.user
    return c.json(user)
}

export const loginHandler = async (c: Context) => {
    return c.text('loginHandler')
}

export const registerHandler = async (c: Context) => {
    return c.text('registerHandler')
}

export const logoutHandler = async (c: Context) => {
    return c.text('logoutHandler')
}

export const refreshHandler = async (c: Context) => {
    return c.text('refreshHandler')
}

export const authHandlers = {
    loginHandler,
    registerHandler,
    logoutHandler,
    refreshHandler
}

