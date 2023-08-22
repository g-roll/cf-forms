import { html as signupBody } from '../emails/signup';
import { html as submissionBody } from '../emails/submission';

/**
 * Submits a form and sends an email to the recipient with the submitted form
 * data.
 *
 * @param endpoint - Unique endpoint of the form.
 * @param request - Request object containing the submitted form data.
 * @returns Response object indicating the success or failure.
 * @see https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
 */
export async function formSubmit(endpoint: string, request: Request) {
	const email = await KV.get(endpoint);
	const formData = await request.formData();
	const redirect = formData.get('$location');

	if (!email) return new Response('Endpoint not found.', { status: 404 });

	//@ts-expect-error strings filtered
	const rows: [key: string, value: string][] = [...formData.entries()].filter(
		([key]) => typeof key === 'string' && !key.startsWith('$')
	);

	const message = {
		personalizations: [
			{
				to: [{ email }],
			},
		],
		from: {
			email: 'forms@garethroll.com',
			name: 'Form endpoint',
		},
		subject: 'New form submission!',
		content: [
			{
				type: 'text/html',
				value: submissionBody({ rows, endpoint }),
			},
		],
	};

	await fetch('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(message),
	});

	// Redirect to a given URL.
	if (typeof redirect === 'string') {
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirect,
			},
		});
	}

	// Otherwise redirect to a static URL.
	else
		return new Response(null, {
			status: 302,
			headers: {
				Location: 'https://garethroll.com/thankyou',
			},
		});
}

/**
 * Submits a form and sends an email to the recipient with the submitted form
 * data.
 *
 * @param endpoint - Unique endpoint of the form.
 * @param req - Request object containing the submitted form data.
 * @returns Response object indicating the success or failure.
 */
export async function signup(req: Request) {
	const email = (await req.formData()).get('email');
	const endpoint = crypto.randomUUID();

	await KV.put(endpoint, email);

	//@ts-expect-error intended exception
	const response = await sendConfirmation(email, endpoint);

	if (response.ok) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: 'https://garethroll.com/thankyou',
			},
		});
	} else
		return new Response(null, {
			status: 500,
		});
}

async function sendConfirmation(email: string, endpoint: string) {
	const request = new Request('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			personalizations: [
				{
					to: [{ email }],
				},
			],
			from: {
				email: 'forms@garethroll.com',
				name: 'Forms by Gareth Roll',
			},
			subject: `Your form endpoint: ${endpoint}`,
			content: [
				{
					type: 'text/html',
					value: signupBody({ endpoint }),
				},
			],
		}),
	});

	return await fetch(request);
}
