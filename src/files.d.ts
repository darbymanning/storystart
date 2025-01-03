declare const $SPACE_ID: number
declare const $DESTINATION: string

interface ImportMeta {
  glob: import("vite/types/importGlob.d.ts").ImportGlobFunction
}

declare module "$env/static/public" {
  export const PUBLIC_STORYBLOK_ACCESS_TOKEN: string
}

declare module "$app/environment" {
  export const dev: boolean
}
