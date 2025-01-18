import { Prisma } from "@prisma/client"
import db from "../../db"

export const getUser = async (id: string) => {
    return db?.user.findUnique({ where: { id } })
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
    return db?.refreshToken.create({ data })
}

export const revokeRefreshToken = async (id: string) => {
    return db?.refreshToken.delete({ where: { id } })
}

export const getRefreshToken = async (id: string) => {
    return db?.refreshToken.findUnique({ where: { id } })
}

export const getRefreshTokens = async (userId: string) => {
    return db?.refreshToken.findMany({ where: { userId } })
}