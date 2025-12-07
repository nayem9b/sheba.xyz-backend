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
exports.prisma = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = require("body-parser");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const client_1 = require("@prisma/client");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
exports.prisma = new client_1.PrismaClient();
// For Apollo Server to work with Express in serverless environments
let apolloServer = null;
function initializeApollo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!apolloServer) {
            apolloServer = new server_1.ApolloServer({
                typeDefs: schema_1.typeDefs,
                resolvers: resolvers_1.resolvers,
            });
            yield apolloServer.start();
        }
        return apolloServer;
    });
}
// Add GraphQL middleware to the Express app
initializeApollo()
    .then(server => {
    // Apply Apollo GraphQL middleware to the Express app
    app_1.default.use("/graphql", (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: () => __awaiter(void 0, void 0, void 0, function* () {
            return { prisma: exports.prisma };
        }),
    }));
})
    .catch(error => {
    console.error("Error initializing Apollo Server:", error);
});
// For serverless environments like Vercel
exports.default = app_1.default;
// For local development and traditional deployments
if (require.main === module) {
    app_1.default.listen(config_1.default.port, () => {
        console.log(`Server is running on port ${config_1.default.port} `);
    });
}
