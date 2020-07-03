const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("../../util/transformEvent");

exports.EventResolver = {
  // Query
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  // Mutation
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: "5efde2469e2c761bd8236cfb",
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const existingUser = await User.findById("5efde2469e2c761bd8236cfb");
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
