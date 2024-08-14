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
exports.default = ThreadsTab;
const user_actions_1 = require("@/lib/actions/user.actions");
const navigation_1 = require("next/navigation");
const ThreadCard_1 = __importDefault(require("../cards/ThreadCard"));
const community_actions_1 = require("@/lib/actions/community.actions");
function ThreadsTab(_a) {
    return __awaiter(this, arguments, void 0, function* ({ currentUserId, accountId, accountType, }) {
        let result;
        if (accountType === "Community") {
            result = yield (0, community_actions_1.fetchCommunityPosts)(accountId);
        }
        else {
            result = yield (0, user_actions_1.fetchUserPosts)(accountId);
        }
        if (!result)
            (0, navigation_1.redirect)("/");
        return (<section className="flex flex-col mt-9 gap-10">
      {result.threads.map((thread) => (<ThreadCard_1.default key={thread._id} id={thread._id} currentUserId={currentUserId} parentId={thread.parentId} content={thread.text} author={accountType === "User"
                    ? { name: result.name, image: result.image, id: result.id }
                    : {
                        name: thread.author.name,
                        image: thread.author.image,
                        id: thread.author.id,
                    }} // TODO:
             community={thread.community} //TODO:
             createdAt={thread.createdAt} comments={thread.children}/>))}
    </section>);
    });
}
