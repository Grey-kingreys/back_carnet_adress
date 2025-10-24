const Message = require('../models/message');
const User = require('../models/user');
const catchAsync = require('../helpers/watchAsync');
const { StatusCodes } = require('http-status-codes');

const sendMessage = catchAsync(async (req, res) => {
  const sender = req.user;
  const { toEmail, subject, body } = req.body;

  if (!toEmail || !body) {
    return res.status(StatusCodes.BAD_REQUEST).json({ status: 'error', message: 'toEmail and body are required' });
  }

  const recipient = await User.findOne({ email: toEmail.toLowerCase().trim() });
  if (!recipient) {
    return res.status(StatusCodes.NOT_FOUND).json({ status: 'error', message: 'Recipient not found' });
  }

  const message = new Message({
    from: sender._id,
    to: recipient._id,
    toEmail: recipient.email,
    subject: subject || '',
    body: body.trim()
  });

  await message.save();

  // Retourne le message créé
  res.status(StatusCodes.CREATED).json({ status: 'success', data: message });
});

const getConversationWith = catchAsync(async (req, res) => {
  const user = req.user;
  const otherEmail = req.params.email;
  if (!otherEmail) return res.status(StatusCodes.BAD_REQUEST).json({ status:'error', message:'Email required' });

  const other = await User.findOne({ email: otherEmail.toLowerCase().trim() });
  if (!other) return res.status(StatusCodes.NOT_FOUND).json({ status:'error', message:'User not found' });

  const messages = await Message.find({
    $or: [
      { from: user._id, to: other._id },
      { from: other._id, to: user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json({ status: 'success', data: messages });
});

const markAsRead = catchAsync(async (req, res) => {
  const user = req.user;
  const messageId = req.params.id;
  const message = await Message.findOne({ _id: messageId, to: user._id });
  if (!message) return res.status(StatusCodes.NOT_FOUND).json({ status:'error', message:'Message not found' });
  message.read = true;
  await message.save();
  res.json({ status: 'success', data: message });
});

module.exports = { sendMessage, getConversationWith, markAsRead };
