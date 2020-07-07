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
      // console.log(bookings);
      if (bookings) {
        return bookings.map((booking) => {
          console.log(1, booking);
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
      console.log("e", event);
      if (!event) {
        throw new Error("No event");
      }
      const a = { ...event, bookedBy: event.bookedBy.push(req.userId) };
      const booking = new Booking({
        user: req.userId,
        event,
      });
      const result = await booking.save();
      const eventResult = await event.save();
      console.log(eventResult);
      console.log(result);
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

  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated to perform this operation");
    }
    try {
      const booking = await Booking.findById({ _id: bookingId }).populate(
        "event"
      );
      console.log(2, booking);
      console.log(3, booking.event._doc);
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
