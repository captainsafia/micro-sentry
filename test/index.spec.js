/**
 * @jest-environment node
 */

jest.unmock('raven');
const Raven = require.requireActual('raven');
const listen = require('test-listen');
const fetch = require('isomorphic-fetch');
const micro = require('micro');

const sentry = require('../src');

test('throw error if Sentry DSN not provided', () => {
  expect(() => sentry()())
    .toThrow('micro-sentry must be initialized with a Sentry DSN.');
});

test('throw error if function is not passed', () => {
  expect(() => sentry('test-dsn')())
    .toThrow('micro-sentry must be passed a function.');
}); 

test('send error to Sentry if configured properly', async () => {
  const service = async (request, response) => {
    throw Error('This is a test error. No alarm necessary!');
  };
  
  const dsn = 'https://key:secret@sentry.io/micro-test';
  const server = micro(sentry(dsn)(service));
  const url = await listen(server);

  Raven.captureException = jest.fn();

  const response = await fetch(url);

  expect(Raven.captureException).toBeCalled();

  await server.close();
});

test('do not send to Sentry if no error raised', async () => {
  const service = async (request, response) => {
    return { status: 'All good in the neighborhood!' };
  };
  const dsn = 'https://key:secret@sentry.io/micro-test';
  const server = micro(sentry(dsn)(service));
  const url = await listen(server);

  Raven.captureException = jest.fn();

  const response = await fetch(url);
  const body = await response.json();

  expect(body.status).toBe('All good in the neighborhood!');

  await server.close();
});
