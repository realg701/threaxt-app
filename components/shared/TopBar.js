"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopBar;
const nextjs_1 = require("@clerk/nextjs");
const themes_1 = require("@clerk/themes");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
function TopBar() {
    return (<nav className="topbar">
      <link_1.default href="/" className="flex itmes-center gap-4">
        <image_1.default src="/assets/logo.svg" alt="logo" width={28} height={28}/>
        <p className="text-heading3-bold text-light-1 max-xs:hidden">ThreaXt</p>
      </link_1.default>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <nextjs_1.SignedIn>
            <nextjs_1.SignOutButton>
              <div className="flex cursor-pointer">
                <image_1.default src="/assets/logout.svg" width={24} height={24} alt="logout"/>
              </div>
            </nextjs_1.SignOutButton>
          </nextjs_1.SignedIn>
        </div>
        <nextjs_1.OrganizationSwitcher appearance={{
            baseTheme: themes_1.dark,
            elements: {
                organizationSwitcherTrigger: "py-2 px-4",
            },
        }}/>
      </div>
    </nav>);
}
