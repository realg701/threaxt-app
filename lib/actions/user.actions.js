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
exports.fetchUser = fetchUser;
exports.updateUser = updateUser;
exports.fetchUserPosts = fetchUserPosts;
exports.fetchUsers = fetchUsers;
exports.getActivity = getActivity;
const cache_1 = require("next/cache");
const community_model_1 = __importDefault(require("../models/community.model"));
const thread_model_1 = __importDefault(require("../models/thread.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = require("../mongoose");
function fetchUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            return yield user_model_1.default.findOne({ id: userId }).populate({
                path: "communities",
                model: community_model_1.default,
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    });
}
function updateUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, bio, name, path, username, image, }) {
        try {
            (0, mongoose_1.connectToDB)();
            yield user_model_1.default.findOneAndUpdate({ id: userId }, {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            }, { upsert: true });
            if (path === "/profile/edit") {
                (0, cache_1.revalidatePath)(path);
            }
        }
        catch (error) {
            throw new Error(`Failed to create/update user: ${error.message}`);
        }
    });
}
function fetchUserPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find all threads authored by the user with the given userId
            const threads = yield user_model_1.default.findOne({ id: userId }).populate({
                path: "threads",
                model: thread_model_1.default,
                populate: [
                    {
                        path: "community",
                        model: community_model_1.default,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: "children",
                        model: thread_model_1.default,
                        populate: {
                            path: "author",
                            model: user_model_1.default,
                            select: "name image id", // Select the "name" and "_id" fields from the "User" model
                        },
                    },
                ],
            });
            return threads;
        }
        catch (error) {
            console.error("Error fetching user threads:", error);
            throw error;
        }
    });
}
// Almost similar to Thead (search + pagination) and Community (search + pagination)
function fetchUsers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc", }) {
        try {
            (0, mongoose_1.connectToDB)();
            // Calculate the number of users to skip based on the page number and page size.
            const skipAmount = (pageNumber - 1) * pageSize;
            // Create a case-insensitive regular expression for the provided search string.
            const regex = new RegExp(searchString, "i");
            // Create an initial query object to filter users.
            const query = {
                id: { $ne: userId }, // Exclude the current user from the results.
            };
            // If the search string is not empty, add the $or operator to match either username or name fields.
            if (searchString.trim() !== "") {
                query.$or = [
                    { username: { $regex: regex } },
                    { name: { $regex: regex } },
                ];
            }
            // Define the sort options for the fetched users based on createdAt field and provided sort order.
            const sortOptions = { createdAt: sortBy };
            const usersQuery = user_model_1.default.find(query)
                .sort(sortOptions)
                .skip(skipAmount)
                .limit(pageSize);
            // Count the total number of users that match the search criteria (without pagination).
            const totalUsersCount = yield user_model_1.default.countDocuments(query);
            const users = yield usersQuery.exec();
            // Check if there are more users beyond the current page.
            const isNext = totalUsersCount > skipAmount + users.length;
            return { users, isNext };
        }
        catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    });
}
function getActivity(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find all threads created by the user
            const userThreads = yield thread_model_1.default.find({ author: userId });
            // Collect all the child thread ids (replies) from the 'children' field of each user thread
            const childThreadIds = userThreads.reduce((acc, userThread) => {
                return acc.concat(userThread.children);
            }, []);
            // Find and return the child threads (replies) excluding the ones created by the same user
            const replies = yield thread_model_1.default.find({
                _id: { $in: childThreadIds },
                author: { $ne: userId }, // Exclude threads authored by the same user
            }).populate({
                path: "author",
                model: user_model_1.default,
                select: "name image _id",
            });
            return replies;
        }
        catch (error) {
            console.error("Error fetching replies: ", error);
            throw error;
        }
    });
}
