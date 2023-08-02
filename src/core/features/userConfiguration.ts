import {
    updateUserConfiguration, onUserConfigurationChange, getUserConfiguration
} from 'vscode/service-override/configuration'
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