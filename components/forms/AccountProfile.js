"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccountProfile;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
const zod_1 = require("@hookform/resolvers/zod");
const user_1 = require("@/lib/validations/user");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const uploadthing_1 = require("@/lib/uploadthing");
const user_actions_1 = require("@/lib/actions/user.actions");
function AccountProfile({ user, btnTitle }) {
    const [files, setFiles] = (0, react_1.useState)([]);
    const { startUpload } = (0, uploadthing_1.useUploadThing)("media");
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(user_1.UserValidation),
        defaultValues: {
            profile_photo: (user === null || user === void 0 ? void 0 : user.image) || "",
            name: (user === null || user === void 0 ? void 0 : user.name) || "",
            username: (user === null || user === void 0 ? void 0 : user.username) || "",
            bio: (user === null || user === void 0 ? void 0 : user.bio) || "",
        },
    });
    const handleImage = (e, fieldChange) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));
            if (!file.type.includes("image"))
                return;
            fileReader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const imageDataUrl = ((_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.toString()) || "";
                fieldChange(imageDataUrl);
            });
            fileReader.readAsDataURL(file);
        }
    };
    const onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
        const blob = values.profile_photo;
        const hasImageChanged = (0, utils_1.isBase64Image)(blob);
        if (hasImageChanged) {
            const imgRes = yield startUpload(files);
            if (imgRes && imgRes[0].fileUrl) {
                values.profile_photo = imgRes[0].fileUrl;
            }
        }
        // Update user Profile function
        yield (0, user_actions_1.updateUser)({
            userId: user.id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname,
        });
        if (pathname === "/profile/edit") {
            router.back();
        }
        else {
            router.push("/");
        }
    });
    return (<form_1.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <form_1.FormField control={form.control} name="profile_photo" render={({ field }) => (<form_1.FormItem className="flex items-center gap-4">
              <form_1.FormLabel className="account-form_image-label">
                {field.value ? (<image_1.default src={field.value} alt="avatar" width={96} height={96} priority className="rounded-full object-contain"/>) : (<image_1.default src="/assets/profile.svg" alt="avatar" width={24} height={24} className="object-contain"/>)}
              </form_1.FormLabel>
              <form_1.FormControl className="flex-1 text-base-semibold text-gray-200">
                <input_1.Input type="file" accept="image/*" placeholder="Upload a photo" className="account-form_image-input" onChange={(e) => handleImage(e, field.onChange)}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <form_1.FormField control={form.control} name="name" render={({ field }) => (<form_1.FormItem className="flex flex-col w-full gap-3">
              <form_1.FormLabel className="text-base-semibold text-light-2">
                Name
              </form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input type="text" className="account-form_input no-focus" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <form_1.FormField control={form.control} name="username" render={({ field }) => (<form_1.FormItem className="flex flex-col w-full gap-3">
              <form_1.FormLabel className="text-base-semibold text-light-2">
                Username
              </form_1.FormLabel>
              <form_1.FormControl>
                <input_1.Input type="text" className="account-form_input no-focus" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <form_1.FormField control={form.control} name="bio" render={({ field }) => (<form_1.FormItem className="flex flex-col w-full gap-3">
              <form_1.FormLabel className="text-base-semibold text-light-2">
                Bio
              </form_1.FormLabel>
              <form_1.FormControl>
                <textarea_1.Textarea rows={10} className="account-form_input no-focus" {...field}/>
              </form_1.FormControl>
              <form_1.FormMessage />
            </form_1.FormItem>)}/>
        <button_1.Button type="submit" className="bg-primary-500">
          Submit
        </button_1.Button>
      </form>
    </form_1.Form>);
}
