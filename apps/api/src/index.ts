import { CronJob } from 'cron'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from '../modules/auth/auth.routes'
import { deleteExpiredRefreshTokens } from '../modules/auth/auth.service'
import contentRouter from '../modules/content/content.routes'

const app = new Hono()

// create a cron job that runs every 7 days to delete expired refresh tokens
const job = new CronJob('0 0 */7 * *', deleteExpiredRefreshTokens)

job.start()


app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
        origin: 'http://localhost:5174',
        credentials: true,
    })
    return corsMiddlewareHandler(c, next)
})
app.route('/auth', authRouter)
app.route('/contents', contentRouter)
app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('Custom Error Message', 500)
})

export default app
