import { useDark, useStorage, usePreferredDark } from '@vueuse/core'
import { ref, watchEffect, computed } from 'vue'
import { theme } from 'ant-design-vue';

import { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
export const darkmode = useDark()
const isDark = usePreferredDark()

const vscodeThemeKey = 'workbench.colorTheme'
interface AppTheme {
    isDark: boolean | 'auto'
    name: string
    vscodeTheme?: string
    colorPrimary?: string
}
const autoTheme: AppTheme = {
    isDark: 'auto',
    name: '自动',
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

export const currentTheme = useStorage('app.theme', autoTheme)
export const themeList = ref<AppTheme[]>([autoTheme, lightTheme, darkTheme])

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
        algorithm: darkmode.value ? theme.darkAlgorithm : theme.defaultAlgorithm
    }
})

export function watchTheme(getUserConfiguration: () => Promise<string>, updateUserConfiguration: (config: string) => void) {
    watchEffect(async () => {
        console.info('Switch theme:', currentTheme.value);
        const dark = isDark.value
        const theme = currentTheme.value
        let vscodeTheme = theme.vscodeTheme
        if (theme.isDark === 'auto') {
            darkmode.value = dark
            if (!vscodeTheme) {
                vscodeTheme = dark ? darkTheme.vscodeTheme : lightTheme.vscodeTheme
            }
        } else darkmode.value = theme.isDark
        if (vscodeTheme) {
            const c = JSON.parse(await getUserConfiguration())
            c[vscodeThemeKey] = vscodeTheme
            updateUserConfiguration(JSON.stringify(c, null, 2))
        }

    })
}
export type { AppTheme }