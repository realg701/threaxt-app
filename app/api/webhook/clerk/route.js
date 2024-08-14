"use strict";
/* eslint-disable camelcase */
// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// Above article shows why we need webhooks i.e., to sync data to our backend
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
exports.POST = void 0;
// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it
const svix_1 = require("svix");
const headers_1 = require("next/headers");
const server_1 = require("next/server");
const community_actions_1 = require("@/lib/actions/community.actions");
const POST = (request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = yield request.json();
    const header = (0, headers_1.headers)();
    const heads = {
        "svix-id": header.get("svix-id"),
        "svix-timestamp": header.get("svix-timestamp"),
        "svix-signature": header.get("svix-signature"),
    };
    // Activitate Webhook in the Clerk Dashboard.
    // After adding the endpoint, you'll see the secret on the right side.
    const wh = new svix_1.Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");
    let evnt = null;
    try {
        evnt = wh.verify(JSON.stringify(payload), heads);
    }
    catch (err) {
        return server_1.NextResponse.json({ message: err }, { status: 400 });
    }
    const eventType = evnt === null || evnt === void 0 ? void 0 : evnt.type;
    // Listen organization creation event
    if (eventType === "organization.created") {
        // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
        // Show what evnt?.data sends from above resource
        const { id, name, slug, logo_url, image_url, created_by } = (_a = evnt === null || evnt === void 0 ? void 0 : evnt.data) !== null && _a !== void 0 ? _a : {};
        try {
            // @ts-ignore
            yield (0, community_actions_1.createCommunity)(
            // @ts-ignore
            id, name, slug, logo_url || image_url, "org bio", created_by);
            return server_1.NextResponse.json({ message: "User created" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    // Listen organization invitation creation event.
    // Just to show. You can avoid this or tell people that we can create a new mongoose action and
    // add pending invites in the database.
    if (eventType === "organizationInvitation.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
            console.log("Invitation created", evnt === null || evnt === void 0 ? void 0 : evnt.data);
            return server_1.NextResponse.json({ message: "Invitation created" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    // Listen organization membership (member invite & accepted) creation
    if (eventType === "organizationMembership.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { organization, public_user_data } = evnt === null || evnt === void 0 ? void 0 : evnt.data;
            console.log("created", evnt === null || evnt === void 0 ? void 0 : evnt.data);
            // @ts-ignore
            yield (0, community_actions_1.addMemberToCommunity)(organization.id, public_user_data.user_id);
            return server_1.NextResponse.json({ message: "Invitation accepted" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    // Listen member deletion event
    if (eventType === "organizationMembership.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { organization, public_user_data } = evnt === null || evnt === void 0 ? void 0 : evnt.data;
            console.log("removed", evnt === null || evnt === void 0 ? void 0 : evnt.data);
            // @ts-ignore
            yield (0, community_actions_1.removeUserFromCommunity)(public_user_data.user_id, organization.id);
            return server_1.NextResponse.json({ message: "Member removed" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    // Listen organization updation event
    if (eventType === "organization.updated") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            const { id, logo_url, name, slug } = evnt === null || evnt === void 0 ? void 0 : evnt.data;
            console.log("updated", evnt === null || evnt === void 0 ? void 0 : evnt.data);
            // @ts-ignore
            yield (0, community_actions_1.updateCommunityInfo)(id, name, slug, logo_url);
            return server_1.NextResponse.json({ message: "Member removed" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    // Listen organization deletion event
    if (eventType === "organization.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
            // Show what evnt?.data sends from above resource
            const { id } = evnt === null || evnt === void 0 ? void 0 : evnt.data;
            console.log("deleted", evnt === null || evnt === void 0 ? void 0 : evnt.data);
            // @ts-ignore
            yield (0, community_actions_1.deleteCommunity)(id);
            return server_1.NextResponse.json({ message: "Organization deleted" }, { status: 201 });
        }
        catch (err) {
            console.log(err);
            return server_1.NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
});
exports.POST = POST;
