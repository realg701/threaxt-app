import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result = await fetchUserPosts(accountId);
  if (!result) redirect("/");
  return <section>ThreadsTab</section>;
}
