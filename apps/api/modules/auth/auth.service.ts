import { Prisma } from "@prisma/client"
import db from "../../lib/db"
import redis from "../../lib/redis"

export const RT_KEY = 'rf'

export const getUser = async (id: string) => {
    return db?.user.findUnique({ where: { id } })
}

export const getUserByEmail = async (email: string) => {
    return db?.user.findUnique({ where: { email } })
}

export const createUser = async (data: Prisma.UserCreateInput) => {
    return db?.user.create({ data })
}

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    return db?.user.update({ where: { id }, data })
}

export const deleteUser = async (id: string) => {
    return db?.user.delete({ where: { id } })
}

export const createRefreshToken = async (data: Prisma.RefreshTokenCreateInput) => {
    await redis.set(`${RT_KEY}:${data.userId}`, data.token, 'EX', 60 * 60 * 24 * 7)
    return db?.refreshToken.create({ data })
}

export const revokeRefreshToken = async (id: string) => {
    return db?.refreshToken.delete({ where: { id } })
}

export const getRefreshToken = async (userId: string, token: string) => {
    const _token = await redis.get(`${RT_KEY}:${userId}`)

    if (_token) {
        return _token
    }
    const rf = await db?.refreshToken.findFirst({ where: { token } })
    return rf?.token
}

export const getRefreshTokens = async (userId: string) => {
    return db?.refreshToken.findMany({ where: { userId } })
}

export const deleteExpiredRefreshTokens = async () => {
    const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    console.log('Deleting expired refresh tokens older than', sevenDaysAgo);

    await db?.refreshToken.deleteMany({ where: { createdAt: { lt: sevenDaysAgo } } })
}