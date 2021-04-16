// deno-lint-ignore-file camelcase
import { Application, Router, oakCors } from "./deps.ts";
import db, { Image } from  './db.ts'
import userRouter from './user-routes.ts'

// If the development mode is activate for database, clean up the tabels.
await db.sync({ drop: Deno.env.get("DEV_DB_MODE") && Deno.env.get("DEV_DB_MODE") === "clean" ? true : false })

type ImageScheme = {
  original_src?: string,
  optm_src?: string,
  user_id?: string
}

const router = new Router();
router
  .get("/v1/images", async (context) => {
    context.response.body = await Image.all();
  })
  .get("/v1/images/:userId", async (context) => {
    if (context.params && context.params.userId) {
      context.response.body = await Image.where("user_id", context.params.userId).get()
    } else {
      context.response.status = 400
    }
  })
  .get("/v1/image/:id", async (context) => {
    if (context.params && context.params.id) {
      context.response.body = await Image.where("id", context.params.id).get()
    } else {
      context.response.status = 400
    }
  })
  .post("/v1/image/add", async (context) => {
  
    const newImgValues = (await context.request.body({type: 'json'}).value) as ImageScheme

    console.log(newImgValues.original_src, newImgValues.optm_src, newImgValues.user_id)

    if( newImgValues.original_src && newImgValues.optm_src && newImgValues.user_id ) {
      await Image.create({
        original_src: newImgValues.original_src,
        optm_src: newImgValues.optm_src,
        user_id: newImgValues.user_id
      })
      
      context.response.body = await Image.where('optm_src', newImgValues.optm_src).get()
      context.response.status = 200
    } else {
      context.response.status = 400
    }
  })
  .delete("/v1/image/delete/:id", async (context) => {
    if (context.params && context.params.id) {
      context.response.body = await Image.where("id", context.params.id).delete()
    } else {
      context.response.status = 400
    }
  });
    
  
const app = new Application();

app.use(
  oakCors({
    origin: "*"
  }),
);
app.use(router.routes());
app.use(userRouter.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8500 });
