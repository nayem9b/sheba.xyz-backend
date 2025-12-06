"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const client_1 = require("@prisma/client");
const schema_1 = require("./src/schema");
const resolvers_1 = require("./src/resolvers");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const prisma = new client_1.PrismaClient();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // Setup CORS and JSON parsing
        app.use((0, cors_1.default)());
        app.use((0, body_parser_1.json)());
        // Create Apollo Server
        const server = new server_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        // Start the server
        const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: 4000 },
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    prisma,
                    req,
                    res,
                });
            }),
        });
        // Test route similar to the one in route.ts
        app.get("/api/test/health", (req, res) => {
            res.status(200).json({ status: "GraphQL service is healthy" });
        });
        // Test GraphQL query via REST endpoint
        app.get("/api/test/me", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield server.executeOperation({
                    query: `
          query {
            me {
              id
              name
              email
            }
          }
        `,
                });
                if (result.body.kind === 'single' && result.body.singleResult.errors) {
                    return res.status(400).json({
                        errors: result.body.singleResult.errors
                    });
                }
                res.json(result.body.singleResult.data);
            }
            catch (error) {
                console.error('Error executing test query:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }));
        console.log(`🚀 GraphQL server ready at ${url}`);
        console.log(`🛠️  Test REST endpoints available at http://localhost:4000/api/test/*`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start GraphQL server:', error);
    process.exit(1);
});
