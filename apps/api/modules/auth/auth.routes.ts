import { Hono } from "hono";
import { loginHandler, registerHandler } from "./auth.handlers";

const authRouter = new Hono();


authRouter.post('/login', loginHandler)
authRouter.put('/register', registerHandler)

export default authRouter