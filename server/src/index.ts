import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { typeDefs } from "./graphql/tyeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./static-middleware.js";
import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';
import path from "path";

// configurar los archivos estaticos, uni privado y otro publico

try {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect("mongodb://localhost:27017/aidb");
  console.log(`MongoDB Connected: ${conn.connection.name}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);

app.use('/public', express.static(path.join('static/public')));
app.use('/private', authMiddleware, express.static(path.join('static/private')));


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
  context: async ({ req }) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { user: null };
  }
  const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, "some-key-key-key");
      console.log("todo ok")
      return { user: decodedToken };
    } catch (error) {
      console.error('Token verification failed:', error.message);
      console.log("no ok")
      return { user: null };
    }
  },
}));

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);

