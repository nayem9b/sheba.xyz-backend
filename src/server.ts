import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import app from "./app";
import config from "./config";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

export const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

// For Apollo Server to work with Express in serverless environments
let apolloServer: ApolloServer<{ prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> }> | null = null;

async function initializeApollo() {
  if (!apolloServer) {
    apolloServer = new ApolloServer<{ prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> }>({
      typeDefs,
      resolvers,
    });
    await apolloServer.start();
  }
  return apolloServer;
}

// Add GraphQL middleware to the Express app
initializeApollo()
  .then(server => {
    // Apply Apollo GraphQL middleware to the Express app
    app.use(
      "/graphql",
      json(),
      expressMiddleware(server, {
        context: async (): Promise<Context> => {
          return { prisma };
        },
      })
    );
  })
  .catch(error => {
    console.error("Error initializing Apollo Server:", error);
  });

// For serverless environments like Vercel
export default app;

// For local development and traditional deployments
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} `);
  });
}
