"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const server_1 = require("@clerk/nextjs/server");
const isProtectedRoute = (0, server_1.createRouteMatcher)([
    {
        publicRoutes: ['/', '/pages/api/webhooks/clerk'],
        ignoredRoutes: ['/pages/api/webhooks/clerk']
    }
]);
exports.default = (0, server_1.clerkMiddleware)((auth, req) => {
    if (isProtectedRoute(req))
        auth().protect();
});
exports.config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
