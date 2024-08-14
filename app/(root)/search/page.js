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
const UserCard_1 = __importDefault(require("@/components/cards/UserCard"));
function Page() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, server_1.currentUser)();
        if (!user)
            return null;
        const userInfo = yield (0, user_actions_1.fetchUser)(user.id);
        if (!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.onboarded))
            (0, navigation_1.redirect)("/onboarding");
        // Fetch Users
        const result = yield (0, user_actions_1.fetchUsers)({
            userId: user.id,
            searchString: "",
            pageNumber: 1,
            pageSize: 25,
        });
        return (<section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}
      <div className="flex flex-col mt-14 gap-9">
        {result.users.length === 0 ? (<p className="no-result">No users found</p>) : (<>
            {result.users.map((person) => (<UserCard_1.default key={person.id} id={person.id} name={person.name} username={person.username} imgUrl={person.image} personType="User"/>))}
          </>)}
      </div>
    </section>);
    });
}
