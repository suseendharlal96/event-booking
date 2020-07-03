const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const individualEvent = async (eventId) => {
  try {
    const event = await Event.findById({ _id: eventId });
    if (!event) {
      throw new Error(`Event with ${eventId} not found `);
    }
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event._doc.creator),
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = {
  // Query
  // Get All events
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  // Get all Bookings
  bookings: async () => {
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

  // Mutations
  // Create an Event
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
      createdEvent = {
        ...result._doc,
        _id: result.id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
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
  // Create an User
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("user exists already");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      if (hashedPassword) {
        const newUser = new User({
          email,
          password: hashedPassword,
        });
        const result = await newUser.save();
        if (result) {
          return {
            ...result._doc,
            _id: result.id,
          };
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  // Create a booking
  bookEvent: async ({ eventId }) => {
    // console.log(object);
    try {
      const event = await Event.findById({ _id: eventId });
      console.log("e", event);
      if (!event) {
        throw new Error("No event");
      }
      const booking = new Booking({
        user: "5efde2469e2c761bd8236cfb",
        event,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, booking._doc.user),
        event: individualEvent.bind(this, booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },

  // Cancel a booking
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById({ _id: bookingId }).populate(
        "event"
      );
      console.log(2, booking);
      console.log(3, booking.event._doc);
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        date: new Date(booking.event._doc.date).toISOString(),
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
