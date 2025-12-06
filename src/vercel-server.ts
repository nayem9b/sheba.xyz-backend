import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import { prisma } from "./server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import config from "./config";
import router from "./routes/route";

// Create the Express app
const app = express();

// Define the async function for initialization
export default async function createServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the Apollo Server
  await server.start();

  // Middleware
  app.use("/api/v1", router);

  // Apply Apollo GraphQL middleware
  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, prisma }),
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.status(200).send("Welcome to Sheba.xyz");
  });

  return app;
}

// For Vercel or similar serverless environments
if (process.env.NODE_ENV !== "production") {
  const startDevServer = async () => {
    const app = await createServer();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  };

  startDevServer().catch(error => {
    console.error("Error starting server:", error);
  });
}