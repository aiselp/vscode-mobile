import { ILogService, IStorageService, LogLevel, StandaloneServices, getService, initialize as initializeMonacoService } from 'vscode/services'
import { initialize as initializeVscodeExtensions } from 'vscode/extensions'
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override'
import getNotificationServiceOverride from '@codingame/monaco-vscode-notifications-service-override'
import getDialogsServiceOverride from '@codingame/monaco-vscode-dialogs-service-override'
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override'
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override'
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override'
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override'
import getAudioCueServiceOverride from '@codingame/monaco-vscode-audio-cue-service-override'
import getViewsServiceOverride, {
    isEditorPartVisible, Parts, onPartVisibilityChange, renderEditorPart,
    renderActivitybarPar, renderSidebarPart, renderStatusBarPart, renderPanelPart,
} from '@codingame/monaco-vscode-views-service-override'
import getDebugServiceOverride from '@codingame/monaco-vscode-debug-service-override'
import getStatusBarServiceOverride from '@codingame/monaco-vscode-view-status-bar-service-override'
import getPreferencesServiceOverride from '@codingame/monaco-vscode-preferences-service-override'
import getSnippetServiceOverride from '@codingame/monaco-vscode-snippets-service-override'
import getQuickAccessServiceOverride from '@codingame/monaco-vscode-quickaccess-service-override'
import getOutputServiceOverride from '@codingame/monaco-vscode-output-service-override'
import getTerminalServiceOverride from '@codingame/monaco-vscode-terminal-service-override'
import getSearchServiceOverride from '@codingame/monaco-vscode-search-service-override'
import getMarkersServiceOverride from '@codingame/monaco-vscode-markers-service-override'
import getLanguageDetectionWorkerServiceOverride from '@codingame/monaco-vscode-language-detection-worker-service-override'
import getStorageServiceOverride, { BrowserStorageService } from '@codingame/monaco-vscode-storage-service-override'
import getExtensionServiceOverride from '@codingame/monaco-vscode-extensions-service-override'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import TextMateWorker from '@codingame/monaco-vscode-textmate-service-override/worker?worker'
import OutputLinkComputerWorker from '@codingame/monaco-vscode-output-service-override/worker?worker'
import ExtensionHostWorker from 'vscode/workers/extensionHost.worker?worker'
import LanguageDetectionWorker from '@codingame/monaco-vscode-language-detection-worker-service-override/worker?worker'
import * as monaco from 'monaco-editor'
// import { TerminalBackend } from './features/terminal'
import { openNewCodeEditor } from './features/editor'
import { toCrossOriginWorker, toWorkerConfig } from './tools/workers'

// Workers
export type WorkerLoader = () => Worker
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    editorWorkerService: () => new (toCrossOriginWorker(EditorWorker))(),
    textMateWorker: () => new (toCrossOriginWorker(TextMateWorker))(),
    outputLinkComputer: () => new (toCrossOriginWorker(OutputLinkComputerWorker))(),
    languageDetectionWorkerService: () => new (toCrossOriginWorker(LanguageDetectionWorker))()
}
window.MonacoEnvironment = {
    getWorker: function (moduleId, label) {
        const workerFactory = workerLoaders[label]
        if (workerFactory != null) {
            return workerFactory()
        }
        throw new Error(`Unimplemented worker ${label} (${moduleId})`)
    }
}

// Override services
await initializeMonacoService({
    ...getStatusBarServiceOverride(),
    ...getExtensionServiceOverride(toWorkerConfig(ExtensionHostWorker)),
    ...getModelServiceOverride(),
    ...getNotificationServiceOverride(),
    ...getDialogsServiceOverride(),
    ...getConfigurationServiceOverride(monaco.Uri.file('/tmp')),
    ...getKeybindingsServiceOverride(),
    ...getTextmateServiceOverride(),
    ...getThemeServiceOverride(),
    ...getLanguagesServiceOverride(),
    ...getAudioCueServiceOverride(),
    ...getDebugServiceOverride(),
    ...getPreferencesServiceOverride(),
    ...getViewsServiceOverride(openNewCodeEditor),
    ...getSnippetServiceOverride(),
    ...getQuickAccessServiceOverride({
        isKeybindingConfigurationVisible: isEditorPartVisible,
        shouldUseGlobalPicker: (_editor, isStandalone) => !isStandalone && isEditorPartVisible()
    }),
    ...getOutputServiceOverride(),
    //   ...getTerminalServiceOverride(new TerminalBackend()),
    ...getSearchServiceOverride(),
    ...getMarkersServiceOverride(),
    ...getLanguageDetectionWorkerServiceOverride(),
    ...getStorageServiceOverride()
})
StandaloneServices.get(ILogService).setLevel(LogLevel.Off)

export async function clearStorage(): Promise<void> {
    await (await getService(IStorageService) as BrowserStorageService).clear()
}

await initializeVscodeExtensions()

export { renderEditorPart, renderActivitybarPar, renderSidebarPart, renderStatusBarPart, renderPanelPart }