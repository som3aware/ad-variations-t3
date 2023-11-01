import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  generateAdVariant: publicProcedure
    .input(
      z.object({
        brief: z.string(),
        platforms: z.string(),
        image: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return { img1x1: input.image, img9x16: input.image, variations: `${input.brief}\n${input.platforms}` };
    }),
});
