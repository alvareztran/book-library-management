import Book from "../models/book.model.js";
import NhaXuatBan from "../models/publisher.model.js";
import ApiError from "../utils/api-error.js";
import { assertValidObjectId } from "../utils/object-id.util.js";

export const createBook = async (data) => {
  const {
    TenSach,
    DonGia,
    SoLuong,
    NamXuatBan,
    MaNXB,
    TenTacGia,
    imageUrl,
    categories,
  } = data;
  if (
    !TenSach ||
    DonGia == null ||
    SoLuong == null ||
    NamXuatBan == null ||
    !MaNXB ||
    !TenTacGia
  ) {
    throw new ApiError(400, "Missing required fields.");
  }
  assertValidObjectId(MaNXB, "Publisher id is invalid.");
  const publisherExists = await NhaXuatBan.findById(MaNXB);
  if (!publisherExists) {
    throw new ApiError(400, "Publisher does not exist.");
  }
  const newBook = new Book({
    TenSach,
    MaNXB,
    DonGia,
    SoLuong,
    NamXuatBan,
    TenTacGia,
    imageUrl,
    categories,
  });
  const savedBook = await newBook.save();
  return savedBook;
};

export const getAllBooks = async () => {
  const books = await Book.find();
  return books;
};

export const getBookById = async (id) => {
  assertValidObjectId(id, "Book id is invalid.");
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, "Book not found.");
  }
  return book;
};

export const updateBook = async (id, data) => {
  const {
    TenSach,
    DonGia,
    SoLuong,
    NamXuatBan,
    MaNXB,
    TenTacGia,
    imageUrl,
    categories,
  } = data;
  assertValidObjectId(id, "Book id is invalid.");
  if (MaNXB != null) {
    assertValidObjectId(MaNXB, "Publisher id is invalid.");
    const publisherExists = await NhaXuatBan.findById(MaNXB);
    if (!publisherExists) {
      throw new ApiError(400, "Publisher does not exist.");
    }
  }
  const updatedBook = await Book.findByIdAndUpdate(
    id,
    {
      TenSach,
      DonGia,
      SoLuong,
      NamXuatBan,
      MaNXB,
      TenTacGia,
      imageUrl,
      categories,
    },
    { new: true },
  );
  if (!updatedBook) {
    throw new ApiError(404, "Book not found.");
  }
  return updatedBook;
};

export const deleteBook = async (id) => {
  assertValidObjectId(id, "Book id is invalid.");
  const deletedBook = await Book.findByIdAndDelete(id);
  if (!deletedBook) {
    throw new ApiError(404, "Book not found.");
  }
  return deletedBook;
};
