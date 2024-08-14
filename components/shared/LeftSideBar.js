"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeftSideBar;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
const nextjs_1 = require("@clerk/nextjs");
const constants_1 = require("@/constants");
function LeftSideBar() {
    const pathname = (0, navigation_1.usePathname)();
    const { userId } = (0, nextjs_1.useAuth)();
    return (<section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {constants_1.sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;
            if (link.route === "/profile")
                link.route = `${link.route}/${userId}`;
            return (<link_1.default href={link.route} key={link.label} className={`leftsidebar_link ${isActive && "bg-primary-500"}`}>
              <image_1.default src={link.imgURL} alt={link.label} width={24} height={24}/>
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </link_1.default>);
        })}
      </div>
      <div className="mt-10 px-6">
        <nextjs_1.SignedIn>
          <nextjs_1.SignOutButton redirectUrl={"/sign-in"}>
            <div className="flex cursor-pointer gap-4 p-4">
              <image_1.default src="/assets/logout.svg" width={24} height={24} alt="logout"/>
              <p className="text-light-2 max-lg:hidden">Sign Out</p>
            </div>
          </nextjs_1.SignOutButton>
        </nextjs_1.SignedIn>
      </div>
    </section>);
}
