import { Context } from 'hono'
import { createComment, createPost, getComments, getPostById, getPosts } from './content.service'


export const postHandler = async (c: Context) => {
    const { id } = c.req.param()
    return c.json(getPostById(id))
}

export const postsHandler = async (c: Context) => {
    const { userId } = c.var
    return getPosts({ userId })
}

export const createPostHandler = async (c: Context) => {
    const payload = await c.req.json()
    return c.json(createPost(payload))
}

export const commentHandler = async (c: Context) => {
    return c.text('commentHandler')
}

export const commentsHandler = async (c: Context) => {
    const { postId } = c.var
    return c.json(getComments(postId))
}

export const createCommentHandler = async (c: Context) => {
    const payload = await c.req.json()
    payload.authorId = c.var.userId
    return c.json(createComment(payload))
}

export const contentHandlers = {
    postHandler,
    postsHandler,
    createPostHandler,

    commentHandler,
    commentsHandler,
    createCommentHandler
}