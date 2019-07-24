require('../models/User');

const Page = require('./helpers/page');
const keys = require('../config/keys');
const mongoose = require('mongoose');

let page;

beforeAll(async () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
  });
});

afterAll(async done => {
  await mongoose.disconnect();
  done();
});

beforeEach(async done => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
  done();
});

afterEach(async done => {
  await page.close();
  done();
});

test('The header has the correct text', async done => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
  done();
});

test('clicking login starts oauth flow', async done => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
  done();
});

test('When signed in, shows logout button', async done => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
  done();
});
