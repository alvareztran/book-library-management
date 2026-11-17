import * as bookService from "../services/book.service.js";

export const createBook = async (req, res) => {
  const book = await bookService.createBook(req.body);
  return res.status(201).json({
    success: true,
    message: "Book created successfully.",
    data: book,
  });
};

export const getAllBooks = async (req, res) => {
  const books = await bookService.getAllBooks();
  return res.status(200).json({
    success: true,
    data: books,
  });
};

export const getBookById = async (req, res) => {
  const book = await bookService.getBookById(req.params.id);
  return res.status(200).json({
    success: true,
    data: book,
  });
};

export const updateBook = async (req, res) => {
  const updatedBook = await bookService.updateBook(req.params.id, req.body);
  return res.status(200).json({
    success: true,
    message: "Book updated successfully.",
    data: updatedBook,
  });
};

export const deleteBook = async (req, res) => {
  const deletedBook = await bookService.deleteBook(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
    data: deletedBook,
  });
};
