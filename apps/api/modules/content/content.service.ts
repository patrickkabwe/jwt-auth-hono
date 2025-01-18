import { Prisma } from '@prisma/client'
import db from '../../db'


export async function getPosts({ userId }: { userId?: string } = {}) {
    return db?.post.findMany({
        where: {
            authorId: userId
        }
    })
}

export async function getPostById(id: string) {
    return db?.post.findUnique({ where: { id } })
}

export async function createPost(data: Prisma.PostCreateInput) {
    return db?.post.create({ data })
}

export async function getComments(postId: string) {
    return db?.comment.findMany({
        where: {
            postId
        }
    })
}

export async function createComment(data: Prisma.CommentCreateInput) {
    return db?.comment.create({ data })
}
