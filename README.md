# Cloudflare Worker form endpoint

Spam-free and simple form endpoint that generates email address-related endpoints on demand and sends its input via email. Free alternative to [Formcarry](https://formcarry.com) and [Getform](https://getform.io).

Pretty HTML emails powered by [react email](https://github.com/resendlabs/react-email).

[👉 Live demo](https://garethroll.com/forms)

## Quickstart

To get started, first install the necessary dependencies:

```sh
npm install
```

Optional, authenticate your wrangler instance:

```sh
npx wrangler login
```

Then, create a KV namespace:

```sh
npx wrangler kv:namespace create KV

# add the --preview flag for development
```

Copy the KV ID and update `wrangler.toml` and `src/main.ts` according to your requirements.

Publish your worker:

```sh
npx wrangler deploy
```

Finally, setup a TXT record according to this [Mailchannels post](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown-).

## Usage

### Generate form endpoints

To generate form endpoints, create a simple HTML form with the pathname `/signup` in the `action` attribute. Do not forget to add `method="POST"`.

```html
<form action="https://forms.garethroll.com/signup" method="POST">
	<input type="email" name="email" />
	<button type="submit">Get endpoint</button>
</form>
```

### Recieve form submissions

To receive form submissions, generate your endpoint and insert it into your form. All input fields are sent by email in a two-column table as key-value pairs.

```html
<form action="https://forms.garethroll.com/{endpoint}" method="POST">
	<input type="email" name="email" />
	<button type="submit">Subscribe</button>
</form>
```

### Custom redirections

To redirect your users after submission, add a hidden URL input element with the `name="$location"` attribute. The value attribute should be set to the redirect target.

```html
<input
	type="url"
	name="$location"
	value="https://garethroll.com/thankyou"
	hidden />
```

### Send data with JS

You can also send the FormData with native JS.

```html
<form
	method="POST"
	action="https://forms.garethroll.com/{endpoint}"
	onsubmit="send(event, this)">
	<input name="email" />
	<button type="submit">Subscribe</button>
</form>

<script>
	function send(e, form) {
		fetch(form.action, {
			method: 'POST',
			body: new FormData(form),
		}).then((e) => {
			if (e.ok) {
				form.insertAdjacentText('beforeend', 'Success');
			} else form.insertAdjacentText('beforeend', 'Fail');
		});

		e.preventDefault(); // Prevents default formaction redirection
	}
</script>
```

## Notes

At times I add a file upload feature.

Needless to say, this form endpoint is experimental. Therefore, do not use it in production.

Inspired by this [Cloudflare blogpost](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/).

## Licence

MIT
