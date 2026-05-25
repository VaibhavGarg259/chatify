import Chat from "../models/chat.js";

export const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 users required for group chat" });
  }

  users.push(req.user.id);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Private chat
export const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId required" });
  }

  try {
    // 🔍 check existing chat
    const chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    }).populate("users", "-password");

    if (chat) return res.json(chat);

    // ✅ FIXED HERE
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password",
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.log("CREATE CHAT ERROR:", error); // 👈 debug
    res.status(500).json({ message: error.message });
  }
};

// ====Rename Group==========
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(updatedChat);
};

// ==========Add User to Group=========
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(added);
};

// ============Remove User from Group=========
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(removed);
};

/*===============FETCH USER CHATS=================*/
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.user._id] },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
