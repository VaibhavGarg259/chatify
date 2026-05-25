import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/User.js";

// =================SEND MESSAGE====================
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId)
    return res.status(400).json({ message: "Content & chatId required" });

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate("sender", "name email");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    //update last message
    await Chat.findByIdAndUpdate(chatId, {
      updatedAt: Date.now(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//===================Get All Messages======================
export const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
