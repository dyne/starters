// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'it'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * /​e​n​{​0​}
	 * @param {unknown} 0
	 */
	LINK: RequiredParams<'0'>
	/**
	 * P​a​g​e​s
	 */
	PAGES: string
	/**
	 * M​e​s​s​a​g​e​s
	 */
	MESSAGES: string
	/**
	 * M​y​ ​p​r​o​f​i​l​e
	 */
	MY_PROFILE: string
	/**
	 * M​y​ ​o​r​g​a​n​i​z​a​t​i​o​n​s
	 */
	MY_ORGANIZATIONS: string
}

export type TranslationFunctions = {
	/**
	 * /en{0}
	 */
	LINK: (arg0: unknown) => LocalizedString
	/**
	 * Pages
	 */
	PAGES: () => LocalizedString
	/**
	 * Messages
	 */
	MESSAGES: () => LocalizedString
	/**
	 * My profile
	 */
	MY_PROFILE: () => LocalizedString
	/**
	 * My organizations
	 */
	MY_ORGANIZATIONS: () => LocalizedString
}

export type Formatters = {}