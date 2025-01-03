import type { Result } from "neverthrow"
import { content_api, management_api, type ApiError } from "./fetcher"
import type { Region } from "@storyblok/region-helper"

type User = {
  userid: string
  email: string
  organization: string | null
  username: string | null
  use_username: boolean
  alt_email: string | null
  firstname: string
  lastname: string
  phone: string | null
  id: number
  login_strategy: string
  created_at: string // This can be Date, but leaving it as string for now since it's in ISO 8601 format
  org_role: string | null
  has_org: boolean
  has_partner: boolean
  partner_status: string | null
  org: Record<string, unknown> // Assuming this is some object; might need to adjust based on actual data
  timezone: string
  avatar: string | null
  friendly_name: string
  notified: string[]
  lang: string
  partner_role: string | null
  favourite_spaces: any[] // If you know the exact shape of spaces, replace `any`
  favourite_ideas: any[] // Same for ideas
  role: string | null
  beta_user: boolean
  track_statistics: boolean
  ui_theme: {
    theme: string
  }
  is_editor: boolean
  sso: boolean
  job_role: string
  totp_factor_verified: boolean
  configured_2fa_options: string[]
  disclaimer_ids: string[]
}

type SpaceSummary = {
  name: string
  id: number
  euid: string | null
  region: string
  owner_id: number
  updated_at: string
  fe_version: string
  plan: string
  plan_level: number
  pending_traffic_boosts: number | null
  pending_limit_boosts: number | null
  trial: boolean
  requires_2fa: boolean
  created_at: string
  org_id: number | null
  partner_id: number | null
  subscription_status: string | null
  stripe_trial_status: string | null
  stripe_trial_end: string | null
  space_type: string | null
  canceled_at: string | null
  org_requires_2fa: boolean
  unpaid_at: string | null
  blocked_at: string | null
  development_mode: boolean
  feature_limit_exceeded_flags: {
    roles: number | null
    assets: number | null
    folders: number | null
    datasources: number | null
    stories: number | null
    preview_urls: number | null
    api_requests: number | null
  }
}

export type Space = {
  name: string
  domain: string
  uniq_domain: string | null
  uniq_subdomain: string
  plan: string
  plan_level: number
  limits: {
    activities_owner_filter: boolean
    activities_type_filter: boolean
    activities_past_days_filter: number
    max_custom_workflows: number
    max_workflow_stages: number
    min_character_search: number
  }
  created_at: string
  id: number
  role: string
  owner_id: number
  story_published_hook: string | null
  environments: unknown[]
  stories_count: number
  parent_id: number | null
  assets_count: number
  searchblok_id: string | null
  duplicatable: boolean | null
  request_count_today: number
  api_requests: number
  exceeded_requests: number
  billing_address: Record<string, unknown>
  routes: unknown[]
  euid: string | null
  trial: boolean
  default_root: string
  has_slack_webhook: boolean
  first_token: string
  traffic_limit: number
  ai_text_generator_disabled: boolean
  ai_text_generator_feature_disabled: boolean
  ai_translation_disabled: boolean
  ai_translation_feature_disabled: boolean
  idea_room_beta_feature_disabled: boolean
  monthly_ai_tokens_traffic: number
  monthly_ai_tokens_traffic_limit: number
  has_pending_tasks: boolean
  options: {
    onboarding_step: string
  }
  assistance_mode: boolean
  crawl_config: Record<string, unknown>
  owner: {
    id: number
    userid: string
    real_email: string
    friendly_name: string
    avatar: string | null
    disabled: boolean
  }
  org: unknown | null
  asset_aws_role: string | null
  asset_region: string | null
  asset_signature: Record<string, unknown>
  required_assest_fields: unknown[]
  is_demo: boolean | null
  rev_share_enabled: boolean | null
  use_translated_stories: boolean | null
  backup_time: string | null
  strong_auth: boolean | null
  stage_changed_hook: string | null
  release_merged_hook: string | null
  branch_deployed_hook: string | null
  datasource_entry_saved_hook: string | null
  story_saved_hook: string | null
  custom_s3_asset_bucket: string | null
  personal_s3_asset_bucket: string | null
  asset_cdn: string | null
  s3_bucket: string | null
  aws_arn: string | null
  backup_frequency: string | null
  backup_week_day: string | null
  languages: unknown[]
  maintenance: unknown | null
  hosted_backup: boolean | null
  published_is_links_default: boolean | null
  webhook_token: string | null
  private_assets: boolean | null
  private_assets_token: string | null
  onboarding_step: string
  cloudinary_cloud_name: string | null
  cloudinary_api_key: string | null
  asset_custom_meta_data_schema: unknown[]
  tablet_size: number | null
  mobile_size: number | null
  visual_mode_disable: boolean | null
  default_lang_name: string | null
  region: Region
  force_v2: boolean | null
  force_v1: boolean | null
  track_statistics: boolean
  fe_version: string
  no_cc_community: boolean
  ui_blocked: boolean | null
  blocked: boolean | null
  pending_traffic_boosts: unknown | null
  pending_limit_boosts: unknown | null
  space_subscription_interval: string | null
  subscription_status: string | null
  space_type: string | null
  enable_extended_char_set_in_stories_slug: boolean | null
  duplicated_from: string | null
  custom_upload_limit_in_mb: number | null
  feature_limits: {
    key: string
    origin: string | null
    limit: string | null
    limit_type: "integer" | "float" | "boolean" | "string"
    is_available: boolean | null
    terms: {
      id: number
      key: string
      name: string
      version: string
      url: string | null
    }[]
  }[]
}

class Api {
  public async get_user(): Promise<Result<{ user: User }, ApiError>> {
    return await content_api.get("/users/me")
  }

  public async get_spaces(): Promise<Result<{ spaces: SpaceSummary[] }, ApiError>> {
    return await management_api.get("/spaces")
  }

  public async get_space(space_id: number): Promise<Result<{ space: Space }, ApiError>> {
    return await management_api.get(`/spaces/${space_id}`)
  }

  public async create_space(data: Partial<Space>): Promise<Result<{ space: Space }, ApiError>> {
    return await management_api.post("/spaces", { body: JSON.stringify(data) })
  }
}

export default new Api()
