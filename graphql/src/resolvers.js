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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.resolvers = {
    Query: {
        me: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            // Implement your authentication logic here
            return null;
        }),
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findMany();
        }),
        user: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: { id },
            });
        }),
    },
    Mutation: {
        signup: (_, { name, email, password, bio }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    bio,
                },
            });
            const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, JWT_SECRET);
            return {
                token,
                user,
            };
        }),
        signin: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error('No such user found');
            }
            // In a real app, verify the password hash
            const valid = true; // Replace with actual password verification
            if (!valid) {
                throw new Error('Invalid password');
            }
            const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, JWT_SECRET);
            return {
                token,
                user,
            };
        }),
    },
};
