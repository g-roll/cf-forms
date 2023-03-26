import { formSubmit, signup } from './main';
export {};

addEventListener('fetch', (event) => {
	event.respondWith(handleEvent(event));
});

async function handleEvent(event: FetchEvent) {
	const { request } = event;
	const endpoint = new URL(request.url).pathname.split('/')[1];

	if (endpoint == 'signup') {
		return await signup(request);
	} else return await formSubmit(endpoint, request);
}
