const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("../../util/transformEvent");

exports.EventResolver = {
  // Query
  events: async () => {
    try {
      const events = await Event.find().sort({ date: "asc" });
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  // Mutation
  createEvent: async (
    { eventInput: { title, description, price, date } },
    req
  ) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated to perform this operation");
    }
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const existingUser = await User.findById(req.userId);
      if (!existingUser) {
        throw new Error("User not found");
      }
      existingUser.createdEvents.push(event);
      const userSavedResult = await existingUser.save();
      if (userSavedResult) {
        return createdEvent;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
