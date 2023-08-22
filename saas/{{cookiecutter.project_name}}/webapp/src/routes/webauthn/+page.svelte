<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { bufferDecode, bufferEncode } from '$lib/utils/buffer';

	let username = 'a@a.it';

	const registerUser = async () => {
		const credentialCreationOptions = await pb.send('/api/webauthn/register/begin/' + username, {});

		credentialCreationOptions.publicKey.challenge = bufferDecode(
			credentialCreationOptions.publicKey.challenge
		);
		credentialCreationOptions.publicKey.user.id = bufferDecode(
			credentialCreationOptions.publicKey.user.id
		);

		const credential = await navigator.credentials.create({
			publicKey: credentialCreationOptions.publicKey
		});
		if (credential != null) {
			const pkCred = credential as PublicKeyCredential;
			let attestationObject = (pkCred.response as AuthenticatorAttestationResponse)
				.attestationObject;
			let clientDataJSON = pkCred.response.clientDataJSON;
			let rawId = pkCred.rawId;

			await pb.send('/api/webauthn/register/finish/' + username, {
				body: {
					id: credential.id,
					rawId: bufferEncode(rawId),
					type: credential.type,
					response: {
						attestationObject: bufferEncode(attestationObject),
						clientDataJSON: bufferEncode(clientDataJSON)
					}
				},
				method: 'POST'
			});
		}
	};
	const loginUser = async () => {
		const credentialRequestOptions = await pb.send('/api/webauthn/login/begin/' + username, {});

		credentialRequestOptions.publicKey.challenge = bufferDecode(
			credentialRequestOptions.publicKey.challenge
		);
		credentialRequestOptions.publicKey.allowCredentials.forEach(function (listItem: any) {
			listItem.id = bufferDecode(listItem.id);
		});

		const credential = await navigator.credentials.get({
			publicKey: credentialRequestOptions.publicKey
		});

		if (credential != null) {
			const assertion = credential as PublicKeyCredential;
			const resp = assertion.response as AuthenticatorAssertionResponse;

			const authData = resp.authenticatorData;
			const clientDataJSON = resp.clientDataJSON;
			const rawId = assertion.rawId;
			const sig = resp.signature;
			const userHandle = resp.userHandle || new Uint8Array();

			const token = await pb.send('/api/webauthn/login/finish/' + username, {
				body: {
					id: assertion.id,
					rawId: bufferEncode(rawId),
					type: assertion.type,
					response: {
						authenticatorData: bufferEncode(authData),
						clientDataJSON: bufferEncode(clientDataJSON),
						signature: bufferEncode(sig),
						userHandle: bufferEncode(userHandle)
					}
				},
				method: 'POST'
			});
			console.log(token);
			pb.authStore.save(token.token, token.user);
		}
	};

	async function load() {
		if (!window.PublicKeyCredential) {
			alert('Error: this browser does not support WebAuthn');
			return;
		}
	}
	$: load();
</script>

<div class="p-4 space-y-4">
	Username:
	<br />
	<input
		bind:value={username}
		type="text"
		name="username"
		id="email"
		placeholder="i.e. foo@bar.com"
	/>
	<br />
	<br />
	<button on:click={registerUser}>Register</button>
	<button on:click={loginUser}>Login</button>
</div>
