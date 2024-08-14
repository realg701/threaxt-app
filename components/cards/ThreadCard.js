"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const utils_1 = require("@/lib/utils");
const ThreadCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment, }) => {
    return (<article className={`flex flex-col w-full rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"} `}>
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-row w-full gap-4">
          <div className="flex flex-col items-center">
            <link_1.default href={`/profile/${author.id}`} className="relative h-11 w-11">
              <image_1.default className="cursor-pointer rounded-full" src={author.image} alt={author.name + "'s profile iamge"} fill/>
            </link_1.default>
            <div className="thread-card_bar"/>
          </div>
          <div className="flex w-full flex-col">
            <link_1.default href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </link_1.default>
            <p className="text-small-regular text-light-2 mt-2">{content}</p>
            <div className={`${isComment && "mb-10"} flex flex-col gap-3 mt-5 `}>
              <div className="flex gap-3.5">
                <image_1.default src="/assets/heart-gray.svg" alt="like" width={28} height={28} className="cursor-pointer object-contain"/>
                <link_1.default href={`/thread/${id}`}>
                  <image_1.default src="/assets/reply.svg" alt="reply" width={28} height={28} className="cursor-pointer object-contain"/>
                </link_1.default>

                <image_1.default src="/assets/repost.svg" alt="repost" width={28} height={28} className="cursor-pointer object-contain"/>
                <image_1.default src="/assets/share.svg" alt="share" width={28} height={28} className="cursor-pointer object-contain"/>
              </div>
              {isComment && comments.length > 0 && (<link_1.default href={`/thread/${id}`}>
                  <p className="text-subtle-medium text-gray-1 mt-1">
                    {comments.length} replies
                  </p>
                </link_1.default>)}
            </div>
          </div>
        </div>

        {/* TODO: Delete thread */}
        {/* TODO: Show replies profile picture */}
      </div>
      {!isComment && community && (<link_1.default href={`/communities/${community.id}`} className="flex items-center mt-5">
          <p className="text-subtle-medium text-gray-1">
            {(0, utils_1.formatDateString)(createdAt)}
            {" - "}
            {community.name} Community
          </p>
          <image_1.default src={community.image} alt={community.name} width={14} height={14} className="rounded-full object-cover ml-1"/>
        </link_1.default>)}
    </article>);
};
exports.default = ThreadCard;
