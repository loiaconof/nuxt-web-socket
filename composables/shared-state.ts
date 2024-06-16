export function useSharedState(id: string = 'state') {
    const state = useState(() => ({}))

    if (import.meta.server) {
        onServerPrefetch(async () => {
            const data = await $fetch(`/api/state/${id}`)
            state.value = data
        })
    }

    return state
}