import { Hono } from "hono";
import { authMiddlewareHandler, loginHandler, refreshHandler, registerHandler } from "./auth.handlers";

const authRouter = new Hono();


authRouter.post('/login', loginHandler)
authRouter.post('/register', registerHandler)

authRouter.get('/refresh', refreshHandler)

export default authRouter