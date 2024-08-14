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
const AccountProfile_1 = __importDefault(require("@/components/forms/AccountProfile"));
const user_actions_1 = require("@/lib/actions/user.actions");
const server_1 = require("@clerk/nextjs/server");
const navigation_1 = require("next/navigation");
function Page() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, server_1.currentUser)();
        if (!user)
            return null;
        const userInfo = yield (0, user_actions_1.fetchUser)(user.id);
        if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.onboarded)
            (0, navigation_1.redirect)("/");
        const userData = {
            id: user === null || user === void 0 ? void 0 : user.id,
            objectId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id,
            username: userInfo ? userInfo === null || userInfo === void 0 ? void 0 : userInfo.username : user === null || user === void 0 ? void 0 : user.username,
            name: userInfo ? userInfo === null || userInfo === void 0 ? void 0 : userInfo.name : (user === null || user === void 0 ? void 0 : user.firstName) || "",
            bio: userInfo ? userInfo === null || userInfo === void 0 ? void 0 : userInfo.bio : "",
            image: userInfo ? userInfo === null || userInfo === void 0 ? void 0 : userInfo.image : user === null || user === void 0 ? void 0 : user.imageUrl,
        };
        return (<main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text text-light-2">OnBoarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete you profile now to use ThreaXt.
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile_1.default user={userData} btnTitle="Continue"/>
      </section>
    </main>);
    });
}
