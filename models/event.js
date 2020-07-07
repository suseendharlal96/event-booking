const { model, Schema } = require("mongoose");

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  bookedBy: [{ type: String }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Event", eventSchema);
