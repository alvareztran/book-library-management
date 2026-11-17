import * as readerService from "../services/reader.service.js";

export const createReader = async (req, res) => {
  const reader = await readerService.createReader(req.body);
  return res.status(201).json({
    success: true,
    message: "Reader created successfully.",
    data: reader,
  });
};

export const getAllReaders = async (req, res) => {
  const readers = await readerService.getAllReaders();
  return res.status(200).json({
    success: true,
    data: readers,
  });
};

export const getReaderById = async (req, res) => {
  const reader = await readerService.getReaderById(req.params.id);
  return res.status(200).json({
    success: true,
    data: reader,
  });
};

export const updateReader = async (req, res) => {
  const updatedReader = await readerService.updateReader(
    req.params.id,
    req.body,
  );
  return res.status(200).json({
    success: true,
    message: "Reader updated successfully.",
    data: updatedReader,
  });
};

export const deleteReader = async (req, res) => {
  const deletedReader = await readerService.deleteReader(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Reader deleted successfully.",
    data: deletedReader,
  });
};
