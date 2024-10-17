<script lang="ts">
	import {
		userChallengesSchema,
		userChallenges,
		type UserChallenges,
		formatAnswersForZenroom
	} from '$lib/keypairoom/userQuestions.js';
	import {
		generateKeypair,
		getHMAC,
		matchPublicAndPrivateKeys,
		saveKeyringToLocalStorage
	} from '$lib/keypairoom/keypair';
	import {
		getPublicKeysFromKeypair,
		saveUserPublicKeys,
		getUserPublicKeys,
		RegenerateKeyringSession
	} from '$lib/keypairoom/utils.js';
	import { currentUser, pb } from '@/pocketbase';
	import { z } from 'zod';
	import { featureFlags } from '$lib/features';

	// Components
	import { Form, createForm, FormError, SubmitButton } from '@/forms';
	import { Field } from '@/forms/fields';
	import CopyButton from '$lib/components/copyButton.svelte';
	import Card from '$lib/components/card.svelte';
	import { HelpCircle } from 'lucide-svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { WelcomeSession } from '$lib/utils/welcome';
	import WelcomeBanner from '$lib/components/welcomeBanner.svelte';
	import { m } from '$lib/i18n';
	import RegenerateBanner from './_partials/RegenerateBanner.svelte';
	import { log } from '$lib/utils/devLog';

	import Button from '@/components/ui/button/button.svelte';
	import T from '@/components/custom/t.svelte';
	import Alert from '@/components/custom/alert.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	//

	let seed = '';

	const schema = z.object({
		email: z.string().email(),
		questions: userChallengesSchema
	});

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async ({ form }) => {
			const { email, questions } = form.data;
			const challenges = formatAnswersForZenroom(questions);
			const keypair = await createKeypairFromFormData(email, challenges);

			const privateKeys = keypair.keyring;
			const publicKeys = getPublicKeysFromKeypair(keypair);

			if ($featureFlags.AUTH && $currentUser) {
				const storedPublicKeys = await getUserPublicKeys();

				if (!storedPublicKeys) {
					await saveUserPublicKeys(publicKeys);
				} else {
					try {
						await matchPublicAndPrivateKeys(storedPublicKeys, privateKeys);
					} catch (e) {
						throw new Error('Wrong answers');
					}
				}

				if ($featureFlags.DID) {
					try {
						await pb.send('/api/did', {});
					} catch (e) {
						log(e);
					}
				}
			}

			saveKeyringToLocalStorage(privateKeys);
			seed = keypair.seed;
		}
	});

	async function createKeypairFromFormData(email: string, challenges: UserChallenges) {
		const HMAC = await getHMAC(email);
		return await generateKeypair(email, HMAC, challenges);
	}

	const { form: formData } = form;
	if ($currentUser) $formData.email = $currentUser.email;
</script>

{#if !seed}
	{#if WelcomeSession.isActive()}
		<WelcomeBanner class="mb-6">
			<T class="font-bold">{m.Thanks_for_joining_us()}</T>
			<T>
				{m.One_last_thing_before_to_using_the_app()}<br />
				{m.we_need_you_to_answer_these_questions_as_they_will_be_used_to_secure_your_data_()}
			</T>
		</WelcomeBanner>
	{/if}

	<Card class="space-y-6 p-6">
		<T tag="h4">{m.Generate_your_keys()}</T>

		{#if WelcomeSession.isActive()}
			<Alert color="blue">
				<span class="sr-only">{m.Info()}</span>
				<span class="text mb-2 flex items-center font-bold">
					<Icon src={HelpCircle} mr />
					{m.Important_information()}
				</span>
				<ul class="list-disc space-y-1 pl-4 pt-1">
					<li>
						{m.By_answering_these_questions_you_will_generate_keys_that_will_be_used_to_encrypt_your_data()}
					</li>
					<li>
						{m.Please_remember_the_answers_as_they_will_be_the_only_way_to_restore_the_encryption_keys()}
					</li>
					<li>{m.Please_answer_at_least_3_of_the_following_questions()}</li>
				</ul>
			</Alert>
		{:else if RegenerateKeyringSession.isActive()}
			<RegenerateBanner />
		{/if}

		<Separator />

		<Form {form} class="space-y-6" submitButtonText={m.Generate_keys()}>
			{#if !$currentUser}
				<div class="space-y-1">
					<Field {form} name="email" options={{ label: 'User email' }} />

					<T tag="small" class="text-gray-400">
						{m.Your_email_wont_be_stored_anywhere_it_will_be_used_only_to_generate_the_keys_()}
					</T>
				</div>

				<Separator />
			{/if}

			{#each userChallenges as question}
				<Field {form} name={`questions.${question.id}`} options={{ label: question.text }} />
			{/each}
		</Form>

		<Separator />

		<a class="text-sm" href="/keypairoom/regenerate">{m.I_have_the_seed_passphrase()}</a>
	</Card>
{:else}
	<Card class="space-y-6">
		<T tag="h4">{m.Keypair_creation_successful()}</T>
		<T tag="small" class="text-gray-400 dark:text-gray-600">
			{m.Please_store_this_in_a_safe_place_to_recover_your_account_in_the_future_this_passphrase_will_be_shown_only_one_time()}
		</T>
		<Alert color="blue">
			<span class="font-mono">
				{seed}
				<div class="flex flex-col items-end pt-4">
					<CopyButton textToCopy={seed}>{m.Copy_seed()}</CopyButton>
				</div>
			</span>
		</Alert>
		<Button href="/my">{m.Go_to_Dashboard()}</Button>
	</Card>
{/if}
