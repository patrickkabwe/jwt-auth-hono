import * as jose from 'jose';

const secret = new TextEncoder().encode('secret')

export const generateToken = (userId: string, exp: string) => {
    return new jose.SignJWT()
        .setProtectedHeader({ alg: 'HS256' })
        .setAudience('api-gateway')
        .setIssuer('auth-service')
        .setSubject(userId)
        .setExpirationTime(exp)
        .sign(secret)
}

export const verifyToken = (token: string) => {
    return jose.jwtVerify(token, secret)
}

export const decodeToken = (token: string) => {
    return jose.decodeJwt(token).sub
}
