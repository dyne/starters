import { createI18n } from '@inlang/paraglide-sveltekit';
import * as runtime from '$lib/paraglide/runtime.js';
import * as m from '$lib/paraglide/messages.js';

export const i18n = createI18n(runtime);
export { m };
