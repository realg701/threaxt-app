"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const next_1 = require("uploadthing/next");
const core_1 = require("./core");
// Export routes for Next App Router
_a = (0, next_1.createRouteHandler)({
    router: core_1.ourFileRouter,
    // Apply an (optional) custom config:
    // config: { ... },
}), exports.GET = _a.GET, exports.POST = _a.POST;
