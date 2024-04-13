const Item = require("../models/itemModel");
const Transaction = require("../models/transactionModel");
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

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
    if (req.body.itemPrice) {
      const transactions = await Transaction.find({
        itemId: req.params.itemId,
      });
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const updatedTransaction = await Transaction.findByIdAndUpdate(
            transaction._id,
            { price: req.body.itemPrice },
            { new: true }
          );
        })
      );
    }
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

exports.requestItem = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(token);
    const username = decoded.username;
    const user = await User.findOne({
      username,
    });
    const student = await Student.findOne({
      userId: user._id,
    });
    const studentId = student._id;
    const { itemId, price } = req.body;
    const transaction = await Transaction.create({
      itemId,
      studentId,
      price,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { courseId } = req.params.courseId;
    const items = await Item.find({ courseId });
    const itemIds = items.map((item) => item._id);
    const transactions = await Transaction.find({ itemId: { $in: itemIds } });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    const studentId = transaction.studentId;
    const student = await Student.findOne({ _id: studentId });
    if (
      transaction.status === "Approval" &&
      (req.body.status === "Reject" || req.body.status === "Awaiting")
    ) {
      student.currentCurrency += transaction.price;
      await student.save();
    }
    transaction.status = req.body.status;
    transaction.save();
    if (transaction.status === "Approval") {
      const difference = student.currentCurrency - transaction.price;
      if (difference < 0) {
        transaction.status = "Reject";
      } else {
        student.currentCurrency = difference;
        await student.save();
      }
      res.status(200).json(updatedTransaction);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactionByItemByStudent = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.jwt;
    const decoded = JWT.decode(token);
    const username = decoded.username;
    const user = await User.findOne({
      username,
    });
    const student = await Student.findOne({
      userId: user._id,
    });
    const studentId = student._id;
    const { itemId } = req.params;
    const transaction = await Transaction.findOne({ itemId, studentId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    } else {
      res.status(200).json(transaction);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactionByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const transactions = await Transaction.find({ itemId });
    const transactionsWithUsername = await Promise.all(
      transactions.map(async (transaction) => {
        const studentId = transaction.studentId;
        const studentPromise = Student.findOne({ _id: studentId });
        const student = await studentPromise;
        const userPromise = User.findOne({ _id: student.userId });
        const user = await userPromise;
        const username = user.username;
        const transactionWithUsername = {
          ...transaction.toObject(),
          username,
        };
        return transactionWithUsername;
      })
    );
    res.status(200).json(transactionsWithUsername);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
