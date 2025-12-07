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
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const server_2 = require("./server");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const config_1 = __importDefault(require("./config"));
const route_1 = __importDefault(require("./routes/route"));
// Create the Express app
const app = (0, express_1.default)();
// Define the async function for initialization
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Apollo Server
        const server = new server_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        // Start the Apollo Server
        yield server.start();
        // Middleware
        app.use("/api/v1", route_1.default);
        // Apply Apollo GraphQL middleware
        app.use("/graphql", (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () { return ({ req, res, prisma: server_2.prisma }); }),
        }));
        // Health check endpoint
        app.get("/health", (req, res) => {
            res.status(200).send("Server is healthy");
        });
        // Root endpoint
        app.get("/", (req, res) => {
            res.status(200).send("Welcome to Sheba.xyz");
        });
        return app;
    });
}
exports.default = createServer;
// For Vercel or similar serverless environments
if (process.env.NODE_ENV !== "production") {
    const startDevServer = () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield createServer();
        app.listen(config_1.default.port, () => {
            console.log(`Server is running on port ${config_1.default.port}`);
        });
    });
    startDevServer().catch(error => {
        console.error("Error starting server:", error);
    });
}
