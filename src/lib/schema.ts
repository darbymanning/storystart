/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Generated by the generate script on 2024-12-23T00:42:43.500Z.
 * Any changes will be overwritten.
 */

import type { SbBlokData } from "@storyblok/svelte"

export type Blok<T> = SbBlokData & T

import { StoryblokStory } from "storyblok-generate-ts"

export interface FeatureStoryblok {
	name?: string
	_uid: string
	component: "feature"
}

export interface GridStoryblok {
	columns?: (FeatureStoryblok | GridStoryblok | PageStoryblok | TeaserStoryblok)[]
	ok?: string
	_uid: string
	component: "grid"
}

export interface PageStoryblok {
	body?: (FeatureStoryblok | GridStoryblok | PageStoryblok | TeaserStoryblok)[]
	_uid: string
	component: "page"
	uuid?: string
}

export interface TeaserStoryblok {
	headline?: string
	_uid: string
	component: "teaser"
}
