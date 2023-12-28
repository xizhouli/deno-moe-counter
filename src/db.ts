export interface Counter {
    name: string
    num: number
}


const kv = await Deno.openKv()

export async function getNum(name: string) {
    const key = ["counter", name]
    return (await kv.get<Counter>(key)).value!
}

export async function updateNum(name: string, num: number) {
    const key = ["counter", name]
    return (await kv.set(key, { name, num }))
}