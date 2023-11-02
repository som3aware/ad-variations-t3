import OpenAI from "openai";
import { env } from "@/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

async function generateVariants(brief: string, platforms: string) {
  const prompt = `
    Given a quick brief, and a list of target platforms (e.g., Facebook, Instagram, Twitter, etc.), 
    create a set of diverse ad variations for an advertising campaign. 

    quick brief: ${brief}
    list og target platforms: ${platforms}
    
    Your output should be a list where each variation is an object.
    For each ad variation object, please provide the following details:
    target_platform: [Specify the platform for this variation]
    target_audience: [Define the target audience or demographic for this variation]
    cta: [Provide the call to action (CTA) text for this variation]
    copy: [Specify the ad copy text for this variation]
    The goal is to generate distinct ad creatives tailored to each platform, ensuring 
    they align with platform-specific guidelines and audience expectations.
    Create variations that appear as if they were developed by experienced human advertisers.
    `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
  });

  return completion.choices[0]!.message.content;
}

export { generateVariants };
