"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ourFileRouter = void 0;
const next_1 = require("uploadthing/next");
const server_1 = require("uploadthing/server");
const server_2 = require("@clerk/nextjs/server");
const f = (0, next_1.createUploadthing)();
const getUser = () => __awaiter(void 0, void 0, void 0, function* () { return yield { currentUser: server_2.currentUser }; });
// FileRouter for your app, can contain multiple FileRoutes
exports.ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware((_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
        // This code runs on your server before upload
        const user = yield getUser();
        // If you throw, the user will not be able to upload
        if (!user)
            throw new server_1.UploadThingError("Unauthorized");
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
    }))
        .onUploadComplete((_a) => __awaiter(void 0, [_a], void 0, function* ({ metadata, file }) {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
    })),
};
