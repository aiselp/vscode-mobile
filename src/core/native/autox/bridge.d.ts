
export interface JsBridge {
    callHandler(event: string, data?: string, callback?: (data?: string) => void): void
    registerHandler(event: string,
        handle: (data: string, callback: (data?: string) => void) => void): void
}

async function getAutoxBridge() {
    return new Promise<JsBridge>((resolve, reject) => {
        if (window.$autox) {
            return resolve(window.$autox as JsBridge)
        }
        document.addEventListener('AutoxJsBridgeReady', (event) => {
            resolve(window.$autox as JsBridge)
        })
        setTimeout(() => {
            reject(new Error('不存在AutoxJsBridge'))
        }, 3000)
    })
}

export default getAutoxBridge