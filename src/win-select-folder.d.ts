declare module 'win-select-folder' {
    declare const _default: (options: {root:string, description:string, newFolderButton: 0 | 1}, folder?: string) => Promise<string>; 
    export default _default;
} 
