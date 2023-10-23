import { useDark, useStorage } from '@vueuse/core'
import { ref, watchEffect, computed } from 'vue'
import { theme } from 'ant-design-vue';
import {
    updateUserConfiguration,
    getUserConfiguration
} from 'vscode/service-override/configuration'
import { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
export const darkmode = useDark()

const vscodeThemeKey = 'workbench.colorTheme'
interface AppTheme {
    isDark: boolean
    name: string
    vscodeTheme?: string
    colorPrimary?: string
}

const lightTheme: AppTheme = {
    isDark: false,
    name: '浅色',
    vscodeTheme: 'Default Light Modern',
}
const darkTheme: AppTheme = {
    isDark: true,
    name: '深色',
    vscodeTheme: 'Visual Studio Dark'
}

export const currentTheme = useStorage('app.theme', lightTheme)
export const themeList = ref<AppTheme[]>([lightTheme, darkTheme])

export function switchTheme(theme: AppTheme) {
    currentTheme.value = theme
}
export const ant_theme = computed<ThemeConfig>(() => {
    let colorPrimary = currentTheme.value.colorPrimary ?
        currentTheme.value.colorPrimary : theme.defaultConfig.token.colorPrimary
        ;
    return {
        token: {
            colorPrimary
        },
        algorithm: currentTheme.value.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
    }
})

watchEffect(async () => {
    console.info('Switch theme:', currentTheme.value);

    const t = currentTheme.value
    darkmode.value = t.isDark
    if (t.vscodeTheme) {
        const c = JSON.parse(await getUserConfiguration())
        c[vscodeThemeKey] = t.vscodeTheme
        updateUserConfiguration(JSON.stringify(c, null, 2))
    }

})

export type { AppTheme }