import { ClerkProvider, UserButton } from "@clerk/nextjs";

export default function Home() {
  console.log(<UserButton />);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <div>{/* <UserButton afterSignOutUrl="/" />*/}</div>
    </>
  );
}
