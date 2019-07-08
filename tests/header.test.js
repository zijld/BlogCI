const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });

  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  // await browser.close();
});

test('The header has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only('When signed in, shows logout button', async () => {
  const id = '5d11221210fc043ef3c312ef';

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
  );

  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  const fakeCookie = [
    { name: 'express:sess', value: sessionString },
    { name: 'express:sess.sig', value: sig }
  ];
  await page.setCookie(...fakeCookie);

  // await page.goto('localhost:3000');
});
