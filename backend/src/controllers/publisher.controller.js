import * as publisherService from "../services/publisher.service.js";

export const createPublisher = async (req, res) => {
  const publisher = await publisherService.createPublisher(req.body);
  return res.status(201).json({
    success: true,
    message: "Publisher created successfully.",
    data: publisher,
  });
};

export const getAllPublishers = async (req, res) => {
  const publishers = await publisherService.getAllPublishers();
  return res.status(200).json({
    success: true,
    data: publishers,
  });
};

export const getPublisherById = async (req, res) => {
  const publisher = await publisherService.getPublisherById(req.params.id);
  return res.status(200).json({
    success: true,
    data: publisher,
  });
};

export const updatePublisher = async (req, res) => {
  const updatedPublisher = await publisherService.updatePublisher(
    req.params.id,
    req.body,
  );
  return res.status(200).json({
    success: true,
    message: "Publisher updated successfully.",
    data: updatedPublisher,
  });
};

export const deletePublisher = async (req, res) => {
  const deletedPublisher = await publisherService.deletePublisher(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Publisher deleted successfully.",
    data: deletedPublisher,
  });
};
