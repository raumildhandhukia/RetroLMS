const Item = require("../models/itemModel");

exports.createItem = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Empty Body" });
    }
    const { itemName, itemDescription, itemPrice, itemExpiry, courseId } =
      req.body;
    const newItem = new Item({
      itemName,
      itemDescription,
      itemPrice,
      itemExpiry,
      courseId,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getItemsByCourse = async (req, res) => {
  try {
    const items = await Item.find({ courseId: req.params.courseId });
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // Add additional logic here to filter by course ID if necessary
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
