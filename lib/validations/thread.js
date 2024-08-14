"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = exports.ThreadValidation = void 0;
const zod_1 = require("zod");
exports.ThreadValidation = zod_1.z.object({
    thread: zod_1.z.string().min(3, { message: "Minimum 3 characters" }),
    accountid: zod_1.z.string(),
});
exports.CommentValidation = zod_1.z.object({
    thread: zod_1.z.string().min(3, { message: "Minimum 3 characters" }),
});
