import { FileSystemProvider, EventEmitter } from "vscode";


export interface CallEvent {
    type: 'load' | 'call'
    pluginId: string
    method?: string
    data?: string
}

export interface PluginInfo {
    pluginId: String
    methods: Array<String>
}

export interface CallbackEvent {
    type: 'success' | 'error'
    data?: string
    errorMessage?: string
}
