# FTQueue [![npm version](https://img.shields.io/npm/v/ftqueue?style=flat-square)](https://www.npmjs.com/package/ftqueue)

> FTQueue – A queue, listed File uploader Javascript Library.

### <font color="blue">Notice</font>
#### <font color="red">Released 1.0.0 Alpha version</font>

We inform that no user should implement it in personal project. Because this is the alpha version <mark>1.0.0-a</mark> of FTQueue, it may have bugs.

But the app can be added to this normal project or its methods can be checked. If you feel that something needs to be improved then you can raise an issue on github. Your advice will be precious to me.

If you feel that this library is perfect for your project or application then you can add it to your project without worrying that it. will prove effective for your project or application.

## npm install
```bash
# install locally (recomended)
npm install ftqueue --save
```

## configuration
```js
const ftqueue = new FTQueue();
ftqueue.add({
	url: "http://example.com",
	accept: "image/*, video/mp4",
	beforeSend: ƒ callback()
	username: "",
	password: "",
	timeout: 5000,
	headers: {},
	mimeType: ,
	data: {},
	sync: true,
	async: true,
	files: {FileList {}},
	loadstart: ƒ start(),
	success: ƒ success(),
	error: ƒ error(),
	loadend: ƒ end(),
	loaded: ƒ loaded(),
	progress: ƒ progress(),
	complete: ƒ complete()
});
```

## (Recomended) properties
```js
ftqueue.add({
	url: "http://example.com",
	beforeSend: ƒ callback()
	data: {},
	files: {FileList {}},
	loadstart: ƒ start(),
	success: ƒ success(),
	error: ƒ error(),
	loadend: ƒ end(),
	loaded: ƒ loaded(),
	progress: ƒ progress()
});
```

### Required properties
```js
ftqueue.add({
	url: "http://example.com",
	files: {FileList {}},
	progress: ƒ progress(),
	error: ƒ error(),
	success: ƒ success(),
});
```

- `url` – A string or any other object with a <a href="https://developer.mozilla.org/en-US/docs/Glossary/Stringifier">stringifier</a> — including a <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL">`URL`</a> object — that provides the URL of the resource to send the request to.
- `accept` – The accept method value is a string that defines the file types the file input should accept.
- `beforeSend` – Will fire before sending the request.
- `username` – The optional user name to use for authentication purposes; by default, this is the `null` value.
- `password` – The optional password to use for authentication purposes; by default, this is the `null` value.
- `timeout` – The timeout event is fired when progression is terminated due to preset time expiring.
- `headers` –
- `mimeType` – A string specifying the MIME type to use instead of the one specified by the server. If the server doesn't specify a type, XMLHttpRequest assumes <mark>"video/mp4"</mark>.
- `data` – A plain `html` or `json` data Like `user=foo&email=emaple@gmail.com` or `{user: "foo", email: "example@gmail.com"}`
- `sync` – An optional Boolean parameter, defaulting to true,
- `async` – An optional Boolean parameter, defaulting to true, indicating whether or not to perform the operation asynchronously. If this value is false, the send() method does not return until the response is received. If true.
- `files` – A valid FileList object
- `loadstart` – The upload has begun.
- `success` – The upload, xhr completed successfully.
- `error` – The upload failed or xhr request failed due to an error.
- `loadend` – to this event, one of `load`, `error`, `abort`, or `timeout` will already have been delivered to indicate why the upload ended.
- `loaded` – The upload completed successfully.
- `progress` – Periodically delivered to indicate the amount of progress made so far.
- `complete` – The xhr Request completed successfully work as always.

## Download Free Demo Project

Download free demo project from github: <a href="https://github.com/jqrony/ftqueue/releases/tag/1.0.0">releases/tag/ftqueue-v1.0.0-demo.zip</a>