import path from "node:path"
import netrc, { type NetrcData } from "netrc"
import type { Region } from "@storyblok/region-helper";

const HOST = "api.storyblok.com"

type Credentials = { email: string; token: string; region?: Region }

function get_netrc_file_path(): string {
  const home = process.env[/^win/.test(process.platform) ? "USERPROFILE" : "HOME"] || ""
  return path.join(home, ".netrc")
}

function read_netrc(): NetrcData {
  try {
    return netrc(get_netrc_file_path())
  } catch {
    return {}
  }
}

function get_env_credentials(): Credentials | null {
  const env_vars = [
    ["STORYBLOK_LOGIN", "STORYBLOK_TOKEN", "STORYBLOK_REGION"],
    ["TRAVIS_STORYBLOK_LOGIN", "TRAVIS_STORYBLOK_TOKEN", "TRAVIS_STORYBLOK_REGION"],
  ]

  for (const [login_key, token_key, region_key] of env_vars) {
    if (process.env[login_key] && process.env[token_key]) {
      return {
        email: process.env[login_key]!,
        token: process.env[token_key]!,
        region: process.env[region_key] as Region | undefined,
      }
    }
  }

  return null
}

function credentials(): Credentials | null {
  const env_creds = get_env_credentials()
  if (env_creds) return env_creds

  const netrc_data = read_netrc()
  const host_entry = netrc_data[HOST]

  if (host_entry) {
    return {
      email: host_entry.login,
      token: host_entry.password,
      region: host_entry.region as Region | undefined,
    }
  }

  return null
}

export default credentials()
