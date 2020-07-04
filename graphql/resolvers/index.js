const { EventResolver } = require("./events");
const { UserResolver } = require("./user");
const { BookingResolver } = require("./booking");

module.exports = {
  // Query
  // Get All events
  events: EventResolver.events,
  // Get all Bookings
  bookings: BookingResolver.bookings,
  // Login
  login: UserResolver.login,

  // Mutations
  // Create an Event
  createEvent: EventResolver.createEvent,
  // Create an User
  createUser: UserResolver.createUser,
  // Create a booking
  bookEvent: BookingResolver.bookEvent,
  // Cancel a booking
  cancelBooking: BookingResolver.cancelBooking,
};
