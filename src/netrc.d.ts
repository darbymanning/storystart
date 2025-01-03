// types/netrc.d.ts
declare module "netrc" {
  export interface NetrcEntry {
    login: string
    password: string
    [key: string]: string | undefined
  }

  export interface NetrcData {
    [host: string]: NetrcEntry
  }

  // Declare the netrc object with methods (e.g., `read`)
  const netrc: {
    (file_path: string): NetrcData
    format: (data: NetrcData) => string
  }

  export default netrc
}
