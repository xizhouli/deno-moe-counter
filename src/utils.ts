import { imageSize, mimeType, path, fs, fileURLToPath } from "./deps.ts"
import { defaultLength, defaultTheme } from './constant.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const themeMap = new Map()
const themePath = path.resolve(__dirname, '../assets/theme')

fs.readdirSync(themePath).forEach(theme => {
    const themeList = new Array()
    const imgList = fs.readdirSync(path.resolve(themePath, theme))
    imgList.forEach(img => {
        const imgPath = path.resolve(themePath, theme, img)
        const name = path.parse(img).name
        const { width, height } = imageSize(imgPath)
        themeList.push({
            name,
            width,
            height,
            data: convertToDataURI(imgPath)
        })
    })
    themeMap.set(theme, themeList)
})

function convertToDataURI(path: string) {
    const mime = mimeType.lookup(path)
    const base64 = fs.readFileSync(path).toString('base64')
    return `data:${mime};base64,${base64}`
}

export function getImage(num: number, theme: string = defaultTheme, len: number = defaultLength) {
    const numArray = num.toString().padStart(len, '0').split('')
    let x = 0, y = 0
    const parts = numArray.reduce((acc, next, _) => {
        const {width, height, data} = themeMap.get(theme)[next]
        const image = `${acc}
        <image x="${x}" y="0" width="${width}" height="${height}" xlink:href="${data}" />`

        x += width
        if (height > y) {
            y = height
        }
        return image
    }, '')

    return `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${x}" height="${y}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="image-rendering: pixelated;">
        <title>Moe Count</title>
        <g>
          ${parts}
        </g>
    </svg>`
}