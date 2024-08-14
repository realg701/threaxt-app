"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileHeader;
const image_1 = __importDefault(require("next/image"));
function ProfileHeader({ accountId, authUserId, name, username, imgUrl, bio, type, }) {
    return (<div className="flex flex-col w-full justifuy-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <image_1.default src={imgUrl} alt="avatar" fill className="rounded-full object-cover shadow-2xl"/>
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      {/* TODO: Community */}

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h0.5 w-full bg-dark-3"/>
    </div>);
}
