const storage = useStorage('cache:state')

export default defineEventHandler(async event => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            status: 400,
            message: 'Missing id'
        })
    }

    const data = await readBody(event)
    event.waitUntil(storage.setItem(id, data))
})