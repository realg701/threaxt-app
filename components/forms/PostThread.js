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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PostThread;
const zod_1 = require("@hookform/resolvers/zod");
const navigation_1 = require("next/navigation");
const react_hook_form_1 = require("react-hook-form");
const nextjs_1 = require("@clerk/nextjs");
const thread_1 = require("@/lib/validations/thread");
const form_1 = require("@/components/ui/form");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const thread_actions_1 = require("@/lib/actions/thread.actions");
function PostThread({ userId }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const { organization } = (0, nextjs_1.useOrganization)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(thread_1.ThreadValidation),
        defaultValues: {
            thread: "",
            accountid: userId,
        },
    });
    const onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
        console.log("ORG ID:", organization);
        yield (0, thread_actions_1.createThread)({
            text: values.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname,
        });
        router.push("/");
    });
    return (<>
      <form_1.Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 mt-10">
          <form_1.FormField control={form.control} name="thread" render={({ field }) => (<form_1.FormItem className="flex flex-col w-full gap-3">
                <form_1.FormLabel className="text-base-semibold text-light-2">
                  Content
                </form_1.FormLabel>
                <form_1.FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <textarea_1.Textarea rows={15} {...field}/>
                </form_1.FormControl>
                <form_1.FormMessage />
              </form_1.FormItem>)}/>
          <button_1.Button type="submit" className="bg-primary-500">
            Submit
          </button_1.Button>
        </form>
      </form_1.Form>
    </>);
}
