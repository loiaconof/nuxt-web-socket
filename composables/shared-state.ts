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

    return state
}