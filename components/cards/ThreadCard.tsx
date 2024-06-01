import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";

interface Props {
  user: {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
      id: string;
      name: string;
      image: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    comments: {
      author: {
        image: string;
      };
    }[];
    isComment?: boolean;
  };
  btnTitle: string;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex flex-col w-full rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      } `}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-row w-full gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                className="cursor-pointer rounded-full"
                src={author.image}
                alt={author.name + "'s profile iamge"}
                fill
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="text-small-regular text-light-2 mt-2">{content}</p>
            <div
              className={`${isComment && "mb-10"} flex flex-col gap-3 mt-5 `}
            >
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="like"
                  width={28}
                  height={28}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={28}
                    height={28}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={28}
                  height={28}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={28}
                  height={28}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="text-subtle-medium text-gray-1 mt-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TODO: Delete thread */}
        {/* TODO: Show replies profile picture */}
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="flex items-center mt-5"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {" - "}
            {community.name} Community
          </p>
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="rounded-full object-cover ml-1"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
