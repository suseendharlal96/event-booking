const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { user } = require("../../util/user");
const { transformEvent } = require("../../util/transformEvent");

const individualEvent = async (eventId) => {
  try {
    const event = await Event.findOne({ _id: eventId });
    if (!event) {
      throw new Error(`Event with ${eventId} not found `);
    }
    return transformEvent(event);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.BookingResolver = {
  // Query
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated to perform this operation");
    }
    try {
      const bookings = await Booking.find();
      if (bookings) {
        return bookings.map((booking) => {
          return {
            ...booking._doc,
            _id: booking._doc._id,
            user: user.bind(this, booking._doc.user),
            event: individualEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
          };
        });
      } else {
        throw new Error("No bookings found");
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  // Mutation
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated to perform this operation");
    }
    try {
      const event = await Event.findById({ _id: eventId });
      const a = { ...event, bookedBy: event.bookedBy.push(req.userId) };
      console.log("e", event);
      if (!event) {
        throw new Error("No event");
      }
      const booking = new Booking({
        user: req.userId,
        event,
      });
      const result = await booking.save();
      await event.save();
      return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, booking._doc.user),
        event: individualEvent.bind(this, booking._doc.event.id),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  cancelBooking: async ({ bookingId, eventId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated to perform this operation");
    }
    try {
      const booking = await Booking.findById({ _id: bookingId }).populate(
        "event"
      );
      const a = await Event.findById(eventId);
      const bIndex = a.bookedBy.findIndex((evt) => evt === req.userId);
      a.bookedBy.splice(bIndex, 1);
      await a.save();
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
