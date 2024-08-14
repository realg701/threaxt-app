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
exports.default = Home;
const thread_actions_1 = require("@/lib/actions/thread.actions");
const server_1 = require("@clerk/nextjs/server");
const ThreadCard_1 = __importDefault(require("@/components/cards/ThreadCard"));
function Home() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, thread_actions_1.fetchPosts)(1, 30);
        const user = yield (0, server_1.currentUser)();
        return (<>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col mt-9 gap-10">
        {result.posts.length === 0 ? (<p className="no-result">No threads found</p>) : (<>
            {result.posts.map((post) => (<ThreadCard_1.default key={post._id} id={post._id} currentUserId={(user === null || user === void 0 ? void 0 : user.id) || ""} parentId={post.parentId} content={post.text} author={post.author} community={post.community} createdAt={post.createdAt} comments={post.children}/>))}
          </>)}
      </section>
    </>);
    });
}
