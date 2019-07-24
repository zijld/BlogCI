const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
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
