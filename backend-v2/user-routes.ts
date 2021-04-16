// deno-lint-ignore-file camelcase
import { Router } from "./deps.ts";
import { User } from "./db.ts";

const userRouter = new Router();

type UserSchema = {
  user_key?: string;
  user_name?: string;
};

userRouter
  .get("/v1/users", async (context) => {
    context.response.body = await User.all();
  })
  .get("/v1/user/:id", async (context) => {
    if (context.params && context.params.id) {
      context.response.body = await User.where("id", context.params.id).get();
    } else {
      context.response.status = 400;
    }
  })
  .post("/v1/user/add", async (context) => {
    const newUser =
      (await context.request.body({ type: "json" }).value) as UserSchema;
    if (newUser.user_name && newUser.user_key) {
      await User.create({
        user_name: newUser.user_name,
        user_key: newUser.user_key,
      });

      context.response.body = await User.where("user_key", newUser.user_key)
        .get();
    } else {
      context.response.status = 400;
    }
  })
  .delete("/v1/user/delete/:id", async (context) => {
    if (context.params && context.params.id) {
        context.response.body = await User.where("id", context.params.id).delete()
        context.response.status = 200
      } else {
        context.response.status = 400
      }
  });

export default userRouter;
