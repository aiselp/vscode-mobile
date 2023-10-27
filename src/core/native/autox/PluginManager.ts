import { JsBridge } from "./bridge";
import { CallEvent, CallbackEvent, PluginInfo } from "./sync_interface";

const PluginCallEventName = "__Plugin_Call"



class PluginManager {
    jsBridge: JsBridge

    constructor(jsBridge: JsBridge) {
        this.jsBridge = jsBridge;
    }
    async loadPlugin<T>(id: string): Promise<T> {
        const call: CallEvent = {
            type: "load",
            pluginId: id
        }
        return new Promise<T>((resolve, reject) => {
            this.jsBridge.callHandler(PluginCallEventName, JSON.stringify(call), (data) => {
                if (!data) return reject(new Error('Plugin: ' + id + ' not found'))
                const pluginInfo = JSON.parse(data) as PluginInfo
                resolve(this.createPlugin<T>(pluginInfo))
            })
        })
    }
    private createPlugin<T>(pluginInfo: PluginInfo): T {
        const methods = new Set(pluginInfo.methods)
        const callPlugin = (name: string) => {
            return async (data: any): Promise<string | undefined> => {
                const call: CallEvent = {
                    type: "call",
                    pluginId: pluginInfo.pluginId.toString(),
                    method: name,
                    data
                }
                return new Promise<string | undefined>((resolve, reject) => {
                    this.jsBridge.callHandler(PluginCallEventName, JSON.stringify(call), (data) => {
                        const callEvent = JSON.parse(data!) as CallbackEvent
                        if (callEvent.type === 'success') {
                            return resolve(callEvent.data)
                        } else reject(new Error(callEvent.errorMessage))
                    })
                })
            }
        }
        return new Proxy({ id: pluginInfo.pluginId }, {
            get(target, p) {
                if (typeof p === 'string' && methods.has(p)) {
                    return callPlugin(p)
                }
                return (target as any)[p]
            }
        }) as T
    }
}


export default PluginManager