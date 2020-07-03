const User = require("../models/user");
const { events } = require("./events");

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.user = user;
