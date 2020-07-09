const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

exports.UserResolver = {
  // Query
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const passIsEqual = await bcrypt.compare(password, user.password);
      if (!passIsEqual) {
        throw new Error("Password is incorrect");
      }
      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email },
        "verysecretkey",
        { expiresIn: "1h" }
      );
      return {
        email,
        userId: user.id,
        token: jwtToken,
        expirationTime: 1,
      };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
  // Mutation
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
        const jwtToken = jwt.sign(
          { userId: result.id, email: result._doc.email },
          "verysecretkey",
          { expiresIn: "1h" }
        );
        if (result) {
          return {
            ...result._doc,
            token: jwtToken,
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
