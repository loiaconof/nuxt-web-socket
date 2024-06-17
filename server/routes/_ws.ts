const storage = useStorage('cache:state')

export default defineWebSocketHandler({
    close(peer, details) {
        console.log('WebSocket closed', details)
        peer.unsubscribe('state-updates')
    },
    error(peer, error) {
        console.log('WebSocket error', error)
    },
    open(peer) {
        console.log('WebSocket opened')
        peer.subscribe('state-updates')
    },
    async message (peer, message) {
        console.log('WebSocket message', message)

        const blob = message.text()
        const data = JSON.parse(blob)

        await storage.setItem(data.id, data.value)
        peer.publish('state-updates', blob)
    }
})