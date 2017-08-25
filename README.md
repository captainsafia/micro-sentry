# micro-sentry

`micro-sentry` allows you to send `micro` errors to [Sentry](https://sentry.io).

### Installation

```
$ npm install --save micro-sentry
```

OR

```
$ yarn add micro-sentry
```

### Example

```
const sendToSentry = require('micro-sentry');
const url = 'https://<key>:<secret>@sentry.io/<project>';

module.exports = sendToSentry(url)(async (request, response) => {
    throw Error('This will be sent to Sentry!');
});

```

### Development

```
$ git clone https://github.com/tanmulabs/micro-sentry.git
$ cd micro-sentry
$ npm install
$ npm test
```
