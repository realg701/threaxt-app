"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserCard;
const image_1 = __importDefault(require("next/image"));
const button_1 = require("../ui/button");
const navigation_1 = require("next/navigation");
function UserCard({ id, name, username, imgUrl, personType, }) {
    const router = (0, navigation_1.useRouter)();
    return (<article className="user-card">
      <div className="user-card_avatar">
        <image_1.default src={imgUrl} alt="avatar" width={48} height={48} className="rounded-full"/>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <button_1.Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
        View
      </button_1.Button>
    </article>);
}
