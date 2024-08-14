"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const communitySchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    threads: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Thread" }],
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
});
const Community = mongoose_1.default.models.Community || mongoose_1.default.model("Community", communitySchema);
exports.default = Community;
