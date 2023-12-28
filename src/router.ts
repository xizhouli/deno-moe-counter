import { Router, Context, helpers } from './deps.ts'
import { defaultLength, defaultTheme } from './constant.ts'
import { getImage } from "./utils.ts"
import {
    getNum,
    updateNum
} from './db.ts'


const router = new Router()
const { getQuery } = helpers


router.get("/ping", async (ctx: Context) => {
    ctx.response.body = 'pong'
}).get("/get/:name", async (ctx: Context) => {
    const { name } = getQuery(ctx, { mergeParams: true })
    const { theme = defaultTheme } = getQuery(ctx, { mergeParams: true })
    ctx.response.headers.set('content-type', 'image/svg+xml')
    ctx.response.headers.set('cache-control', 'max-age=0, no-cache, no-store, must-revalidate')
    const res = (await getNum(name))
    let num = 0
    if (res) {
        num = res.num
    }
    updateNum(name, num + 1)
    // console.log(`name: ${name}`, 
    //     `num: ${num}`, 
    //     `theme: ${theme}`, 
    //     `ref: ${ctx.request.headers.get('Referrer') || null}`, 
    //     `ua: ${ctx.request.headers.get('User-Agent') || null}`)
    ctx.response.body = getImage(num, theme, defaultLength)
})

export default router