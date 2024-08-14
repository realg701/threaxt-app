"use strict";
"use server";
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
exports.fetchPosts = fetchPosts;
exports.createThread = createThread;
exports.deleteThread = deleteThread;
exports.fetchThreadById = fetchThreadById;
exports.addCommentToThread = addCommentToThread;
const mongoose_1 = require("../mongoose");
const cache_1 = require("next/cache");
const user_model_1 = __importDefault(require("../models/user.model"));
const thread_model_1 = __importDefault(require("../models/thread.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
function fetchPosts() {
    return __awaiter(this, arguments, void 0, function* (pageNumber = 1, pageSize = 20) {
        (0, mongoose_1.connectToDB)();
        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;
        // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
        const postsQuery = thread_model_1.default.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
            path: "author",
            model: user_model_1.default,
        })
            .populate({
            path: "community",
            model: community_model_1.default,
        })
            .populate({
            path: "children", // Populate the children field
            populate: {
                path: "author", // Populate the author field within children
                model: user_model_1.default,
                select: "_id name parentId image", // Select only _id and username fields of the author
            },
        });
        // Count the total number of top-level posts (threads) i.e., threads that are not comments.
        const totalPostsCount = yield thread_model_1.default.countDocuments({
            parentId: { $in: [null, undefined] },
        }); // Get the total count of posts
        const posts = yield postsQuery.exec();
        const isNext = totalPostsCount > skipAmount + posts.length;
        return { posts, isNext };
    });
}
function createThread(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, author, communityId, path, }) {
        try {
            (0, mongoose_1.connectToDB)();
            const communityIdObject = yield community_model_1.default.findOne({ id: communityId }, { _id: 1 });
            const createdThread = yield thread_model_1.default.create({
                text,
                author,
                community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
            });
            // Update User model
            yield user_model_1.default.findByIdAndUpdate(author, {
                $push: { threads: createdThread._id },
            });
            if (communityIdObject) {
                // Update Community model
                yield community_model_1.default.findByIdAndUpdate(communityIdObject, {
                    $push: { threads: createdThread._id },
                });
            }
            (0, cache_1.revalidatePath)(path);
        }
        catch (error) {
            throw new Error(`Failed to create thread: ${error.message}`);
        }
    });
}
function fetchAllChildThreads(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        const childThreads = yield thread_model_1.default.find({ parentId: threadId });
        const descendantThreads = [];
        for (const childThread of childThreads) {
            const descendants = yield fetchAllChildThreads(childThread._id);
            descendantThreads.push(childThread, ...descendants);
        }
        return descendantThreads;
    });
}
function deleteThread(id, path) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            (0, mongoose_1.connectToDB)();
            // Find the thread to be deleted (the main thread)
            const mainThread = yield thread_model_1.default.findById(id).populate("author community");
            if (!mainThread) {
                throw new Error("Thread not found");
            }
            // Fetch all child threads and their descendants recursively
            const descendantThreads = yield fetchAllChildThreads(id);
            // Get all descendant thread IDs including the main thread ID and child thread IDs
            const descendantThreadIds = [
                id,
                ...descendantThreads.map((thread) => thread._id),
            ];
            // Extract the authorIds and communityIds to update User and Community models respectively
            const uniqueAuthorIds = new Set([
                ...descendantThreads.map((thread) => { var _a, _b; return (_b = (_a = thread.author) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(); }), // Use optional chaining to handle possible undefined values
                (_b = (_a = mainThread.author) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
            ].filter((id) => id !== undefined));
            const uniqueCommunityIds = new Set([
                ...descendantThreads.map((thread) => { var _a, _b; return (_b = (_a = thread.community) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(); }), // Use optional chaining to handle possible undefined values
                (_d = (_c = mainThread.community) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString(),
            ].filter((id) => id !== undefined));
            // Recursively delete child threads and their descendants
            yield thread_model_1.default.deleteMany({ _id: { $in: descendantThreadIds } });
            // Update User model
            yield user_model_1.default.updateMany({ _id: { $in: Array.from(uniqueAuthorIds) } }, { $pull: { threads: { $in: descendantThreadIds } } });
            // Update Community model
            yield community_model_1.default.updateMany({ _id: { $in: Array.from(uniqueCommunityIds) } }, { $pull: { threads: { $in: descendantThreadIds } } });
            (0, cache_1.revalidatePath)(path);
        }
        catch (error) {
            throw new Error(`Failed to delete thread: ${error.message}`);
        }
    });
}
function fetchThreadById(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, mongoose_1.connectToDB)();
        try {
            const thread = yield thread_model_1.default.findById(threadId)
                .populate({
                path: "author",
                model: user_model_1.default,
                select: "_id id name image",
            }) // Populate the author field with _id and username
                .populate({
                path: "community",
                model: community_model_1.default,
                select: "_id id name image",
            }) // Populate the community field with _id and name
                .populate({
                path: "children", // Populate the children field
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: user_model_1.default,
                        select: "_id id name parentId image", // Select only _id and username fields of the author
                    },
                    {
                        path: "children", // Populate the children field within children
                        model: thread_model_1.default, // The model of the nested children (assuming it's the same "Thread" model)
                        populate: {
                            path: "author", // Populate the author field within nested children
                            model: user_model_1.default,
                            select: "_id id name parentId image", // Select only _id and username fields of the author
                        },
                    },
                ],
            })
                .exec();
            return thread;
        }
        catch (err) {
            console.error("Error while fetching thread:", err);
            throw new Error("Unable to fetch thread");
        }
    });
}
function addCommentToThread(threadId, commentText, userId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, mongoose_1.connectToDB)();
        try {
            // Find the original thread by its ID
            const originalThread = yield thread_model_1.default.findById(threadId);
            if (!originalThread) {
                throw new Error("Thread not found");
            }
            // Create the new comment thread
            const commentThread = new thread_model_1.default({
                text: commentText,
                author: userId,
                parentId: threadId, // Set the parentId to the original thread's ID
            });
            // Save the comment thread to the database
            const savedCommentThread = yield commentThread.save();
            // Add the comment thread's ID to the original thread's children array
            originalThread.children.push(savedCommentThread._id);
            // Save the updated original thread to the database
            yield originalThread.save();
            (0, cache_1.revalidatePath)(path);
        }
        catch (err) {
            console.error("Error while adding comment:", err);
            throw new Error("Unable to add comment");
        }
    });
}
