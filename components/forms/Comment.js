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
exports.default = Comment;
const image_1 = __importDefault(require("next/image"));
const zod_1 = require("@hookform/resolvers/zod");
const navigation_1 = require("next/navigation");
const react_hook_form_1 = require("react-hook-form");
const thread_1 = require("@/lib/validations/thread");
const form_1 = require("@/components/ui/form");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const thread_actions_1 = require("@/lib/actions/thread.actions");
function Comment({ threadId, currentUserImage, currentUserId, }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(thread_1.CommentValidation),
        defaultValues: {
            thread: "",
        },
    });
    const onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
        yield (0, thread_actions_1.addCommentToThread)(threadId, values.thread, JSON.parse(currentUserId), pathname);
        form.reset();
    });
    return (<form_1.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <form_1.FormField control={form.control} name="thread" render={({ field }) => (<form_1.FormItem className="flex w-full items-center gap-3">
              <form_1.FormLabel>
                <image_1.default src={currentUserImage} width={40} height={40} alt="profile" className="rounded-full object-cover"/>
              </form_1.FormLabel>
              <form_1.FormControl className="border-none bg-transparent">
                <input_1.Input type="text" placeholder="Comment..." className="no-focus text-light-1 outline-none" {...field}/>
              </form_1.FormControl>
            </form_1.FormItem>)}/>
        <button_1.Button type="submit" className="comment-form_btn">
          Reply
        </button_1.Button>
      </form>
    </form_1.Form>);
}
