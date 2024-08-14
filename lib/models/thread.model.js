"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const threadSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true, },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true, },
    community: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Community" },
    createdAt: { type: Date, default: Date.now, },
    parentId: { type: String, },
    children: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Thread" }],
});
const Thread = mongoose_1.default.models.Thread || mongoose_1.default.model("Thread", threadSchema);
exports.default = Thread;
