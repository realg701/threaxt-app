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
exports.createCommunity = createCommunity;
exports.fetchCommunityDetails = fetchCommunityDetails;
exports.fetchCommunityPosts = fetchCommunityPosts;
exports.fetchCommunities = fetchCommunities;
exports.addMemberToCommunity = addMemberToCommunity;
exports.removeUserFromCommunity = removeUserFromCommunity;
exports.updateCommunityInfo = updateCommunityInfo;
exports.deleteCommunity = deleteCommunity;
const community_model_1 = __importDefault(require("../models/community.model"));
const thread_model_1 = __importDefault(require("../models/thread.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = require("../mongoose");
function createCommunity(id, name, username, image, bio, createdById // Change the parameter name to reflect it's an id
) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find the user with the provided unique id
            const user = yield user_model_1.default.findOne({ id: createdById });
            if (!user) {
                throw new Error("User not found"); // Handle the case if the user with the id is not found
            }
            const newCommunity = new community_model_1.default({
                id,
                name,
                username,
                image,
                bio,
                createdBy: user._id, // Use the mongoose ID of the user
            });
            const createdCommunity = yield newCommunity.save();
            // Update User model
            user.communities.push(createdCommunity._id);
            yield user.save();
            return createdCommunity;
        }
        catch (error) {
            // Handle any errors
            console.error("Error creating community:", error);
            throw error;
        }
    });
}
function fetchCommunityDetails(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            const communityDetails = yield community_model_1.default.findOne({ id }).populate([
                "createdBy",
                {
                    path: "members",
                    model: user_model_1.default,
                    select: "name username image _id id",
                },
            ]);
            return communityDetails;
        }
        catch (error) {
            // Handle any errors
            console.error("Error fetching community details:", error);
            throw error;
        }
    });
}
function fetchCommunityPosts(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            const communityPosts = yield community_model_1.default.findById(id).populate({
                path: "threads",
                model: thread_model_1.default,
                populate: [
                    {
                        path: "author",
                        model: user_model_1.default,
                        select: "name image id", // Select the "name" and "_id" fields from the "User" model
                    },
                    {
                        path: "children",
                        model: thread_model_1.default,
                        populate: {
                            path: "author",
                            model: user_model_1.default,
                            select: "image _id", // Select the "name" and "_id" fields from the "User" model
                        },
                    },
                ],
            });
            return communityPosts;
        }
        catch (error) {
            // Handle any errors
            console.error("Error fetching community posts:", error);
            throw error;
        }
    });
}
function fetchCommunities(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc", }) {
        try {
            (0, mongoose_1.connectToDB)();
            // Calculate the number of communities to skip based on the page number and page size.
            const skipAmount = (pageNumber - 1) * pageSize;
            // Create a case-insensitive regular expression for the provided search string.
            const regex = new RegExp(searchString, "i");
            // Create an initial query object to filter communities.
            const query = {};
            // If the search string is not empty, add the $or operator to match either username or name fields.
            if (searchString.trim() !== "") {
                query.$or = [
                    { username: { $regex: regex } },
                    { name: { $regex: regex } },
                ];
            }
            // Define the sort options for the fetched communities based on createdAt field and provided sort order.
            const sortOptions = { createdAt: sortBy };
            // Create a query to fetch the communities based on the search and sort criteria.
            const communitiesQuery = community_model_1.default.find(query)
                .sort(sortOptions)
                .skip(skipAmount)
                .limit(pageSize)
                .populate("members");
            // Count the total number of communities that match the search criteria (without pagination).
            const totalCommunitiesCount = yield community_model_1.default.countDocuments(query);
            const communities = yield communitiesQuery.exec();
            // Check if there are more communities beyond the current page.
            const isNext = totalCommunitiesCount > skipAmount + communities.length;
            return { communities, isNext };
        }
        catch (error) {
            console.error("Error fetching communities:", error);
            throw error;
        }
    });
}
function addMemberToCommunity(communityId, memberId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find the community by its unique id
            const community = yield community_model_1.default.findOne({ id: communityId });
            if (!community) {
                throw new Error("Community not found");
            }
            // Find the user by their unique id
            const user = yield user_model_1.default.findOne({ id: memberId });
            if (!user) {
                throw new Error("User not found");
            }
            // Check if the user is already a member of the community
            if (community.members.includes(user._id)) {
                throw new Error("User is already a member of the community");
            }
            // Add the user's _id to the members array in the community
            community.members.push(user._id);
            yield community.save();
            // Add the community's _id to the communities array in the user
            user.communities.push(community._id);
            yield user.save();
            return community;
        }
        catch (error) {
            // Handle any errors
            console.error("Error adding member to community:", error);
            throw error;
        }
    });
}
function removeUserFromCommunity(userId, communityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            const userIdObject = yield user_model_1.default.findOne({ id: userId }, { _id: 1 });
            const communityIdObject = yield community_model_1.default.findOne({ id: communityId }, { _id: 1 });
            if (!userIdObject) {
                throw new Error("User not found");
            }
            if (!communityIdObject) {
                throw new Error("Community not found");
            }
            // Remove the user's _id from the members array in the community
            yield community_model_1.default.updateOne({ _id: communityIdObject._id }, { $pull: { members: userIdObject._id } });
            // Remove the community's _id from the communities array in the user
            yield user_model_1.default.updateOne({ _id: userIdObject._id }, { $pull: { communities: communityIdObject._id } });
            return { success: true };
        }
        catch (error) {
            // Handle any errors
            console.error("Error removing user from community:", error);
            throw error;
        }
    });
}
function updateCommunityInfo(communityId, name, username, image) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find the community by its _id and update the information
            const updatedCommunity = yield community_model_1.default.findOneAndUpdate({ id: communityId }, { name, username, image });
            if (!updatedCommunity) {
                throw new Error("Community not found");
            }
            return updatedCommunity;
        }
        catch (error) {
            // Handle any errors
            console.error("Error updating community information:", error);
            throw error;
        }
    });
}
function deleteCommunity(communityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, mongoose_1.connectToDB)();
            // Find the community by its ID and delete it
            const deletedCommunity = yield community_model_1.default.findOneAndDelete({
                id: communityId,
            });
            if (!deletedCommunity) {
                throw new Error("Community not found");
            }
            // Delete all threads associated with the community
            yield thread_model_1.default.deleteMany({ community: communityId });
            // Find all users who are part of the community
            const communityUsers = yield user_model_1.default.find({ communities: communityId });
            // Remove the community from the 'communities' array for each user
            const updateUserPromises = communityUsers.map((user) => {
                user.communities.pull(communityId);
                return user.save();
            });
            yield Promise.all(updateUserPromises);
            return deletedCommunity;
        }
        catch (error) {
            console.error("Error deleting community: ", error);
            throw error;
        }
    });
}
