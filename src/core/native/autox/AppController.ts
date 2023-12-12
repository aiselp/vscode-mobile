

export default interface AppController {
    exit(): Promise<string | undefined>
    back(): Promise<string | undefined>
    runScript(data: string): Promise<string | undefined>
}