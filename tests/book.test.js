const request = require('supertest');
const app = require('../src/app');
const setupTestDatabase = require('./fixtures/database.fixture');
const { Book } = require('../src/models');
const { bookOne, bookTwo, insertBooks } = require('./fixtures/book.fixture');

setupTestDatabase();

let newBook;

beforeEach(() => {
  newBook = {
    title: 'newBook',
    description: 'description',
  };
});

test('Should create a book', async () => {
  const res = await request(app).post('/books').send(newBook).expect(201);
  expect(res.body).toMatchObject(newBook);

  const dbBook = await Book.findById(res.body._id);
  expect(dbBook).toMatchObject(newBook);
});

test('Should read books', async () => {
  const booksToInsert = [bookOne, bookTwo];
  await insertBooks(booksToInsert);

  const res = await request(app).get('/books').send().expect(200);
  expect(res.body.length).toEqual(booksToInsert.length);
  expect(res.body).toMatchObject(booksToInsert);
});

test('Should read a book with id provided', async () => {
  await insertBooks(bookOne);

  const res = await request(app).get(`/books/${bookOne._id}`).send().expect(200);
  expect(res.body).toMatchObject(bookOne);
});

test('Should return 404 with a non-existing id provided while reading', async () => {
  await insertBooks(bookOne);

  const res = await request(app).get(`/books/${bookTwo._id}`).send().expect(404);
});

test('Should update a book with id provided', async () => {
  await insertBooks(bookOne);

  newBook = {
    title: 'newTitle',
    description: 'newDescription',
  };

  const res = await request(app).patch(`/books/${bookOne._id}`).send(newBook).expect(200);
  expect(res.body).toMatchObject(newBook);

  const dbBook = await Book.findById(bookOne._id);
  expect(dbBook).toMatchObject(newBook);
});

test('Should return 404 with a non-existing id provided while updating', async () => {
  await insertBooks(bookOne);

  const res = await request(app).patch(`/books/${bookTwo._id}`).send().expect(404);
});

test('Should delete a book with id provided', async () => {
  await insertBooks(bookOne);

  const res = await request(app).delete(`/books/${bookOne._id}`).send().expect(200);
  expect(res.body).toMatchObject(bookOne);

  const dbBook = await Book.findById(bookOne._id);
  expect(dbBook).toBeNull();
});

test('Should return 404 with a non-existing id provided while deleting', async () => {
  await insertBooks(bookOne);

  const res = await request(app).delete(`/books/${bookTwo._id}`).send().expect(404);
});
