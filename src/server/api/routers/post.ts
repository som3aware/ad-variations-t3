import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateVariants } from "@/server/utils";
import { processImage } from "@/server/utils/image";

export const postRouter = createTRPCRouter({
  generateAdVariant: publicProcedure
    .input(
      z.object({
        brief: z.string(),
        platforms: z.string(),
        image: z.object({
          url: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      console.log({ ...input });
      const imgRes = await processImage(input.image);
      const variantRes = await generateVariants(input.brief, input.platforms);
      const variantsJson = JSON.parse(variantRes!) as {
        target_platform: string;
        target_audience: string;
        cta: string;
        copy: string;
      }[];
      return {
        img1x1: imgRes!.img1x1Url!,
        img9x16: imgRes!.img9X16Url!,
        variations: variantsJson!,
      };
    }),
});
