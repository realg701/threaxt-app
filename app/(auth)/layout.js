"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const nextjs_1 = require("@clerk/nextjs");
const google_1 = require("next/font/google");
require("../globals.css");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "ThreaXt App",
    description: "A NextJS ThreaXt App",
};
function RootLayout({ children, }) {
    return (<nextjs_1.ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="flex justify-center items-center w-full min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </nextjs_1.ClerkProvider>);
}
