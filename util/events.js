const Event = require("../models/event");
const { transformEvent } = require("./transformEvent");

const events = async (eventIds) => {
  try {
    const fetchedEvents = await Event.find({ _id: { $in: eventIds } });
    return fetchedEvents.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.events = events;
