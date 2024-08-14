"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
const nextjs_1 = require("@clerk/nextjs");
require("../globals.css");
const TopBar_1 = __importDefault(require("@/components/shared/TopBar"));
const BottomBar_1 = __importDefault(require("@/components/shared/BottomBar"));
const LeftSideBar_1 = __importDefault(require("@/components/shared/LeftSideBar"));
const RightSideBar_1 = __importDefault(require("@/components/shared/RightSideBar"));
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "ThreaXt App",
    description: "A NextJS ThreaXt App",
};
function RootLayout({ children, }) {
    return (<nextjs_1.ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar_1.default />
          <main className="flex flex-row">
            <LeftSideBar_1.default />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSideBar_1.default />
          </main>
          <BottomBar_1.default />
        </body>
      </html>
    </nextjs_1.ClerkProvider>);
}
