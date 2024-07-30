import Image from "../models/images.js";
import User from "../models/users.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    hello: () => "Hello world!",
    publicImages: async (_, { page = 1, limit = 10, searchParam = "" }) => {
      try {
        const skip = (page - 1) * limit;
        const searchFilter = searchParam
          ? { prompt: { $regex: searchParam, $options: "i" } }
          : {};
        const filter = { isPublic: true, ...searchFilter };

        const images = await Image.find(filter).skip(skip).limit(limit);

        const totalImages = await Image.countDocuments(filter);
        const totalPages = Math.ceil(totalImages / limit);

        return {
          images,
          pageInfo: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      } catch (error) {
        console.log("errorwiwiwiwi", error)
        throw new Error("Failed to fetch public images");
      }
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User does not exist.");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Incorrect password.");
      }
      const token = jwt.sign({ _id: user._id }, "some-key");
      return { token };
    },
    register: async (_, { username, password }) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userExists = await User.findOne({ username });
      if (userExists) {
        throw new Error("User already exists.");
      }

      const user = new User({
        username,
        password: hashedPassword,
      });
      await user.save();
      return user;
    },
    createImage: async (_, { prompt, isPublic }, context) => {
      const { user } = context;
      if (!user) {
        throw new Error("You must be logged in to create an image.");
      }
      var path: string;
      try {
        const respuesta = await axios.post("http://localhost:42069/entry", {
          prompt,
          is_public: isPublic,
        });
        path = respuesta.data;
      } catch (error) {
        console.log("el error", error);
        throw new Error("Error generating image.");
      }

      console.log("the path", path);

      const image = new Image({
        prompt,
        isPublic,
        userId: user._id,
        path,
      });
      await image.save();
      return image;
    },
  },
  User: {
    images: async (parent) => {
      return await Image.find({ userId: parent._id });
    },
  },
  Image: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
};
