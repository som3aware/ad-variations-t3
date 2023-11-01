import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),

  generateAdVariant: publicProcedure
    .input(
      z.object({
        brief: z.string(),
        platforms: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return { img1x1: input.image, img9x16: input.image, variations: `${input.brief}\n${input.platforms}` };
    }),
});
