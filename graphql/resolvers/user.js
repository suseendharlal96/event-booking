const bcrypt = require("bcryptjs");

const User = require("../../models/user");

exports.UserResolver = {
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
};
