"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    threads: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Thread" }],
    onboarded: { type: Boolean, default: false },
    communities: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Community" }],
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
