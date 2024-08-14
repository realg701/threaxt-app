"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadValidation = exports.UserValidation = void 0;
const zod_1 = require("zod");
exports.UserValidation = zod_1.z.object({
    profile_photo: zod_1.z.string().url().min(1),
    name: zod_1.z.string().min(3).max(30),
    username: zod_1.z.string().min(3).max(30),
    bio: zod_1.z.string().min(3).max(1000),
});
exports.threadValidation = zod_1.z.object({
    profile_photo: zod_1.z.string().url().min(1),
    name: zod_1.z.string().min(3).max(30),
    username: zod_1.z.string().min(3).max(30),
    bio: zod_1.z.string().min(3).max(1000),
});
