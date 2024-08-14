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
exports.default = Page;
const navigation_1 = require("next/navigation");
const server_1 = require("@clerk/nextjs/server");
const user_actions_1 = require("@/lib/actions/user.actions");
const thread_actions_1 = require("@/lib/actions/thread.actions");
const ThreadCard_1 = __importDefault(require("@/components/cards/ThreadCard"));
const Comment_1 = __importDefault(require("@/components/forms/Comment"));
function Page(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        if (!params.id)
            return null;
        const user = yield (0, server_1.currentUser)();
        if (!user)
            return null;
        const userInfo = yield (0, user_actions_1.fetchUser)(user.id);
        if (!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.onboarded))
            (0, navigation_1.redirect)("/onboarding");
        const thread = yield (0, thread_actions_1.fetchThreadById)(params.id);
        return (<section className="relative">
      <div>
        <ThreadCard_1.default key={thread._id} id={thread._id} currentUserId={(user === null || user === void 0 ? void 0 : user.id) || ""} parentId={thread.parentId} content={thread.text} author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={thread.children}/>
      </div>
      <div className="mt-7">
        <Comment_1.default threadId={thread.id} currentUserImage={userInfo.image} currentUserId={JSON.stringify(userInfo._id)}/>
      </div>
      <div className="mt-10">
        {thread.children.map((childThread) => (<ThreadCard_1.default key={childThread._id} id={childThread._id || ""} currentUserId={childThread.id || ""} parentId={childThread.parentId} content={childThread.text} author={childThread.author} community={childThread.community} createdAt={childThread.createdAt} comments={childThread.children} isComment/>))}
      </div>
    </section>);
    });
}
