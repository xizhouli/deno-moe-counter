import { imageSize, mimeType, path, fs, fileURLToPath } from "./src/deps.ts"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const themeMap = new Map()
const themePath = path.resolve(__dirname, './assets/theme')
const dataPath = path.resolve(__dirname, './data/theme.ts')


function convertToDataURI(path: string) {
    const mime = mimeType.lookup(path)
    const base64 = fs.readFileSync(path).toString('base64')
    return `data:${mime};base64,${base64}`
}


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


let content = 'export const themeData = {'
for (let key of themeMap.keys()) {
    const themeList = themeMap.get(key)
    content += `${key}: [`
    for (let item of themeList) {
        content += `{
            name: '${item.name}',
            width: ${item.width},
            height: ${item.height},
            data: '${item.data}',
        },`
    }
    content += `],`
}
content += `}`


await Deno.writeTextFile(dataPath, content)
console.log(`File written to ${dataPath}`)