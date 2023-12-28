import { defaultLength, defaultTheme } from './constant.ts'
import { themeData } from "../data/theme.ts"


const themeMap = new Map()
Object.entries(themeData).forEach(([k, v]) => {
    themeMap.set(k, v)
})


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