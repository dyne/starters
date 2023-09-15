import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();
    const data = req.data
    const response = await fetch('https://did.dyne.org:443/api/v1/sandbox/pubkeys-deactivate.chain', {
			method: 'POST',
			body: JSON.stringify({ data: data }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
        
        return json(response)
};