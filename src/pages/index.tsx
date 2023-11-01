// pages/index.tsx
import { Inter } from "next/font/google";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "@/utils/api";
import { env } from "@/env.mjs";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [brief, setBrief] = useState<string>("");
  const [disabled, setDisabled] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    img1x1: string;
    img9x16: string;
    variations: string;
  } | null>(null);

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const platform = e.target.value;
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(
        selectedPlatforms.filter((item) => item !== platform),
      );
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const { mutate } = api.post.generateAdVariant.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setDisabled(false);
      setForm(data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setDisabled(true);
      const formData = new FormData(e.currentTarget);
      const { data } = await uploadImage(imageFile as File);
      console.log(data);
      mutate({
        brief: formData.get("brief") as string,
        platforms: formData.getAll("platforms").join(","),
        image: data.url,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (image: File) => {
    const url = `https://api.imgbb.com/1/upload`;
    const formData = new FormData();
    formData.append("key", env.NEXT_PUBLIC_IMGBB_KEY);
    formData.append("name", image.name);
    formData.append("image", image);

    const req = await fetch(url, { method: "POST", body: formData });
    return await req.json();
  };

  return (
    <div className={`container mx-auto flex h-screen p-4 ${inter.className}`}>
      <Head>
        <title>Ad Variants Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-full w-1/2 rounded-lg bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-3xl font-semibold">Ad Variants Generator</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-600"
              htmlFor="brief"
            >
              Brief
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              id="brief"
              name="brief"
              type="text"
              placeholder="Enter your brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-600">
              Social Media
            </label>
            <div className="flex">
              <label className="mr-4">
                <input
                  type="checkbox"
                  name="socialMedia"
                  value="Facebook"
                  className="mr-1"
                  checked={selectedPlatforms.includes("Facebook")}
                  onChange={handlePlatformChange}
                />
                Facebook
              </label>
              <label className="mr-4">
                <input
                  type="checkbox"
                  name="socialMedia"
                  value="Instagram"
                  className="mr-1"
                  checked={selectedPlatforms.includes("Instagram")}
                  onChange={handlePlatformChange}
                />
                Instagram
              </label>
              <label>
                <input
                  type="checkbox"
                  name="socialMedia"
                  value="Twitter"
                  className="mr-1"
                  checked={selectedPlatforms.includes("Twitter")}
                  onChange={handlePlatformChange}
                />
                Twitter
              </label>
              {/* Add more social media options as needed */}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-600"
              htmlFor="image"
            >
              Image
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
              id="image"
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setImageFile(e.target.files ? e.target.files[0] as File : null)
              }
            />
          </div>

          <button
            disabled={disabled}
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Generate Ad
          </button>
        </form>
      </div>

      <div className="h-full w-1/2 rounded-lg bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-3xl font-semibold">Result</h1>
        {form && (
          <p>{JSON.stringify(form, null,)}</p>
        )}
      </div>
    </div>
  );
}
