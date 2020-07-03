const { user } = require("./user");

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator),
  };
};

exports.transformEvent = transformEvent;
