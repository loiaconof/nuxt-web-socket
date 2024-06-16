export function useSharedState<T extends Record<string, any>>(id: string = 'state') {
    const state = useState(() => ({} as T))

    if (import.meta.server) {
        onServerPrefetch(async () => {
            const data = await $fetch(`/api/state/${id}`, {
                responseType: 'json'
            })
            state.value = data as T || {}
        })
    }

    if (import.meta.client) {
        async function syncState(newState: T) {
            await $fetch(`/api/state/${id}`, { method: 'PUT', body: newState})
        }
        watch(state, syncState, {deep: true, flush: 'post'})
    }

    return state
}