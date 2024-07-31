import Image from "../models/images.js";
import User from "../models/users.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    publicImages: async (_, { page = 1, limit = 10, searchParam = "" }) => {
      try {
        const skip = (page - 1) * limit;
        const searchFilter = searchParam
          ? { prompt: { $regex: searchParam, $options: "i" } }
          : {};
        const filter = { isPublic: true, ...searchFilter };

        const images = await Image.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

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
		image: async (_, { _id }) => {
			return await Image.findById(_id);
		},
    userImages: async (_, { page = 1, limit = 10, searchParam = "" }, context) => {
      console.log(context)
      const { user } = context;
      if (!user) {
        throw new Error("You must be logged in to create an image.");
      }
      try {
        const skip = (page - 1) * limit;
        const searchFilter = searchParam
          ? { prompt: { $regex: searchParam, $options: "i" } }
          : {};
        const filter = { ...searchFilter, userId: user._id };

        const images = await Image.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

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
      const token = jwt.sign({ _id: user._id }, "some-key-key-key");
      return { token, _id: user._id };
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
    generateImage: async (_, { prompt, isPublic }, context) => {
      const { user } = context;
      if (!user) {
        throw new Error("You must be logged in to create an image.");
      }
      /*
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
      */

      const image = new Image({
        prompt,
        isPublic,
        userId: user._id,
        path: "/private/2024-07-31_11-56-52_2342.png",
      });
      await image.save();
      return image;
    },
    updateImage: async (_, { _id, isPublic }) => {
      const image = await Image.findById(_id);
      if (!image) {
        throw new Error("Image not found.");
      }
      image.isPublic = isPublic;
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
