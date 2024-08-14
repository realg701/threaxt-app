"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const button_1 = require("../ui/button");
function CommunityCard({ id, name, username, imgUrl, bio, members }) {
    return (<article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        <link_1.default href={`/communities/${id}`} className="relative h-12 w-12">
          <image_1.default src={imgUrl} alt="community_logo" fill className="rounded-full object-cover"/>
        </link_1.default>

        <div>
          <link_1.default href={`/communities/${id}`}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          </link_1.default>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <link_1.default href={`/communities/${id}`}>
          <button_1.Button size="sm" className="community-card_btn">
            View
          </button_1.Button>
        </link_1.default>

        {members.length > 0 && (<div className="flex items-center">
            {members.map((member, index) => (<image_1.default key={index} src={member.image} alt={`user_${index}`} width={28} height={28} className={`${index !== 0 && "-ml-2"} rounded-full object-cover`}/>))}
            {members.length > 3 && (<p className="ml-1 text-subtle-medium text-gray-1">
                {members.length}+ Users
              </p>)}
          </div>)}
      </div>
    </article>);
}
exports.default = CommunityCard;
