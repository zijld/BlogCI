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

afterAll(async () => {
  await mongoose.disconnect();
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

describe('when logged in', () => {
  beforeEach(async done => {
    await page.login();
    await page.click('a.btn-floating');
    done();
  });

  test('can see blog create form', async done => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
    done();
  });

  describe('And using valid inputs', () => {
    beforeEach(async done => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button[type="submit"]');
      done();
    });

    test('submitting takes user to review screen', async done => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
      done();
    });

    test('submitting then saving adds blog to index page', async done => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
      done();
    });
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button[type="submit"]');
    });

    test('the form shows an error message', async done => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
      done();
    });
  });
});

describe('User is not logged in', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My Title',
        content: 'My Content'
      }
    }
  ];

  test('Blog related actions are prohibited', async done => {
    const results = await page.execRequest(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
      done();
    }
  });
});
