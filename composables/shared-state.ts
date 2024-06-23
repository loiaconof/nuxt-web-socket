import { hash } from "ohash"
import { useWebSocket } from "~/composables/webSocket"

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
        let snapshot = hash(state.value)
        const ws = useWebSocket()!

        async function syncState(newState: T) {
            await ws.ready
            ws.ws.send(JSON.stringify({id, value: newState}))
        }

        ws.ws.addEventListener('message', event => {
            const data = JSON.parse(event.data)

            // prevent updating other ids
            if (data.id !== id)
                return

            // prevent infinite updates loops
            const newSnapshot = hash(data.value)
            if(newSnapshot === snapshot)
                return

            snapshot = newSnapshot
            state.value = data.value
        })
        watch(state, syncState, {deep: true, flush: 'post'})
    }

    return state
}
