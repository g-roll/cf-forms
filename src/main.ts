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
	//@ts-expect-error Anyone have an elegant fix?
	const email = await KV.get(endpoint);
	const formData = await request.formData();
	const redirect = formData.get('$location');

	if (!email) return new Response('Endpoint not found.', { status: 404 });

	const tableRows = [...formData.entries()]
		.filter(([key]) => typeof key === 'string' && !key.startsWith('$'))
		.map(
			([key, value]) =>
				`<tr>
                    <td align="left">
                        ${key}
                    </td>
                    <td align="left">
                        ${value}
                    </td>
                </tr>`
		)
		.join('');

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
				value: `<p>Hi,</p>
                <br />
                <p>You have received a new form submission.</p>
                <br />
                <table
                    border="1"
                    cellspacing="5"
                    width="100%">
                    <tr>
                        <th align="left">Field</th>
                        <th align="left">Input</th>
                    </tr>
                    ${tableRows}
                </table>
                <br />
                <p>Endpoint: ${endpoint}</p>
                <br />
                <strong>
                    <p>
						Brought you by
						<a href="https://garethroll.com/forms">Gareth Roll</a>
					</p>
                </strong>`,
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

	//@ts-expect-error Anyone have an elegant fix?
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
					value: `<p>Hi,</p>
                        <p>Your endpoint is: <strong>${endpoint}</strong></p>
                        <br />
                        <p>Greetings,</p>
                        <p>Gareth</p>`,
				},
			],
		}),
	});

	return await fetch(request);
}
