"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BottomBar;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
const constants_1 = require("@/constants");
function BottomBar() {
    const pathname = (0, navigation_1.usePathname)();
    return (<section className="bottombar">
      <div className="bottombar_container">
        {constants_1.sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;
            return (<link_1.default href={link.route} key={link.label} className={`bottombar_link ${isActive && "bg-primary-500"}`}>
              <image_1.default src={link.imgURL} alt={link.label} width={24} height={24}/>
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </link_1.default>);
        })}
      </div>
    </section>);
}
