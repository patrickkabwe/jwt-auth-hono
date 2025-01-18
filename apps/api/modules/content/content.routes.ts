import { Hono } from "hono";
import { commentsHandler, postHandler, postsHandler } from "./content.handlers";
import { authMiddlewareHandler } from "../auth/auth.handlers";

const contentRouter = new Hono();


contentRouter.use(authMiddlewareHandler)
contentRouter.get('/post/:id', postHandler)
contentRouter.get('/posts', postsHandler)
contentRouter.post('/post', postHandler)
contentRouter.get('/comment', postHandler)
contentRouter.get('/comments/:postId', commentsHandler)
contentRouter.post('/comment', postHandler)

export default contentRouter