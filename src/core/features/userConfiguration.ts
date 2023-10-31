import {
    updateUserConfiguration, onUserConfigurationChange, getUserConfiguration
} from '@codingame/monaco-vscode-configuration-service-override'
import { useStorage } from '@vueuse/core'

const defaultConfiguration: string = JSON.stringify({
    "editor.minimap.enabled": false,
    "editor.scrollbar.horizontalScrollbarSize": 6,
    "editor.scrollbar.verticalScrollbarSize": 6,
    "files.autoSave": "off"
}, undefined, 2)
const userConfiguration = useStorage('userConfiguration', defaultConfiguration)

await updateUserConfiguration(userConfiguration.value)
onUserConfigurationChange(async () => {
    const configuration = await getUserConfiguration()
    userConfiguration.value = configuration
})


export default userConfiguration