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
const image_1 = __importDefault(require("next/image"));
const server_1 = require("@clerk/nextjs/server");
const user_actions_1 = require("@/lib/actions/user.actions");
const ProfileHeader_1 = __importDefault(require("@/components/shared/ProfileHeader"));
const tabs_1 = require("@/components/ui/tabs");
const constants_1 = require("@/constants");
const ThreadsTab_1 = __importDefault(require("@/components/shared/ThreadsTab"));
function Page(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        const user = yield (0, server_1.currentUser)();
        if (!user)
            return null;
        const userInfo = yield (0, user_actions_1.fetchUser)(params.id);
        if (!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.onboarded))
            (0, navigation_1.redirect)("/onboarding");
        return (<section>
      <ProfileHeader_1.default accountId={userInfo.id} authUserId={user.id} name={userInfo.name} username={userInfo.username} imgUrl={userInfo.image} bio={userInfo.bio}/>
      <div className="mt-9">
        <tabs_1.Tabs defaultValue="threads" className="w-full">
          <tabs_1.TabsList className="tab">
            {constants_1.profileTabs.map((tab) => {
                var _a;
                return (<tabs_1.TabsTrigger key={tab.label} value={tab.value} className="tab">
                <image_1.default src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain"/>
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {(_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.threads) === null || _a === void 0 ? void 0 : _a.length}
                  </p>)}
              </tabs_1.TabsTrigger>);
            })}
          </tabs_1.TabsList>
          {constants_1.profileTabs.map((tab) => (<tabs_1.TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab_1.default currentUserId={user.id} accountId={userInfo.id} accountType="User"/>
            </tabs_1.TabsContent>))}
        </tabs_1.Tabs>
      </div>
    </section>);
    });
}
