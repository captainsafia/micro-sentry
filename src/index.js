const { sendError } = require('micro');
const Raven = require('raven');

module.exports = exports = url => fn => {
  if (!url)
    throw Error('micro-sentry must be initialized with a Sentry DSN.');

  if (!fn || typeof fn !== 'function')
    throw Error('micro-sentry must be passed a function.');

  Raven.config(url).install();
  return async function(request, response) {
    try {
      return await fn(request, response);
    } catch (error) {
      Raven.captureException(error);
      sendError(request, response, error);
    }
  }
};
