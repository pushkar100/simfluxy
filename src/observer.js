class Observer {
    constructor() {
        this.subscribers = []
    }

    subscribe(handler) {
        if (!this.subscribers.includes(handler)) {
            this.subscribers.push(handler)
        }
        return handler
    }

    unsubscribe(handler) {
        if (this.subscribers.includes(handler)) {
            this.subscribers.splice(this.subscribers.indexOf(handler), 1)
        }
        return handler
    }

    publish(data) {
        this.subscribers.forEach(handler => handler(data))
    }
}

export default Observer
