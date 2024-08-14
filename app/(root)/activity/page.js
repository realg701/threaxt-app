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
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
function Page() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, server_1.currentUser)();
        if (!user)
            return null;
        const userInfo = yield (0, user_actions_1.fetchUser)(user.id);
        if (!(userInfo === null || userInfo === void 0 ? void 0 : userInfo.onboarded))
            (0, navigation_1.redirect)("/onboarding");
        //getActivity
        const activity = yield (0, user_actions_1.getActivity)(userInfo._id);
        return (<section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="flex flex-col mt-10 gap-5">
        {activity.length > 0 ? (<>
            {activity.map((activity) => (<link_1.default href={`/thread/${activity.parentId}`} key={activity._id}>
                <article className="activity-card">
                  <image_1.default src={activity.author.image} alt="Profile Picture" width={20} height={20} className="rounded-full object-cover"/>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </link_1.default>))}
          </>) : (<p className="!text-base-regular text-light-3">No activity</p>)}
      </section>
    </section>);
    });
}
