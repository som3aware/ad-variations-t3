// pages/index.tsx
import Head from "next/head";
import { api } from "@/utils/api";
import { storage } from "@/firebase";
import { Inter } from "next/font/google";
import { Button, Container, Flex, Grid, GridItem } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"


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
    variations: { target_platform: string, target_audience: string, cta: string, copy: string }[];
  } | null>(null);

  const handlePlatformChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      resetForm()
      console.log(data);
      setDisabled(false);
      setForm(data);
    },
    onError: (error) => {
      resetForm()
      setDisabled(false)
      console.log(error)
    }
  });

  const resetForm = () => {
    setBrief("")
    setImageFile(null)
    setSelectedPlatforms([])
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setDisabled(true);
      const formData = new FormData(e.currentTarget);
      const url = await uploadImage(imageFile!);
      console.log({ url })
      mutate({
        brief: formData.get("brief") as string,
        platforms: formData.getAll("socialMedia").join(","),
        image: { url, name: imageFile!.name, type: imageFile!.type },
      });
    } catch (error) {
      setDisabled(false)
    }
  };

  const uploadImage = async (image: File): Promise<string> => {
    const imageRef = ref(storage, `images/original-${image.name}`);
    const snapshot = await uploadBytes(imageRef, image)
    return await getDownloadURL(snapshot.ref)
  };

  return (
    <div className={`container mx-auto flex h-screen p-4 ${inter.className}`}>
      <Head>
        <title>Ad Variants Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-1/2 rounded-lg bg-white p-4 bg-white">
        <h1 className="mb-4 text-3xl font-semibold">Ad Variants Generator</h1>
        {/* <img src="1x1-football.jpeghttps://firebasestorage.googleapis.com/v0/b/ad-variations.appspot.com/o/images%2F1x1-football.jpeg?alt=media&token=8ba58e37-762e-4feb-81c2-40c6120e4c59&_gl=1*z7kap8*_ga*MTU2NDI1NjE5LjE2OTg4NTM1NDU.*_ga_CW55HF8NVT*MTY5ODkzMzM1Mi4zLjEuMTY5ODkzMzkzOS42MC4wLjA."></img> */}
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
              accept="image/*,video/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setImageFile(
                  e.target.files ? e.target.files[0]! : null
                )
              }
            />
          </div>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={disabled}
          >
            Generate Ad
          </Button>
        </form>
      </div>

      <div className="h-screen w-1/2 rounded-lg bg-white p-4 bg-gray-50">
        <h1 className="mb-4 text-3xl font-semibold">Variants</h1>
        {form &&
          <Container>
            <Flex flexDirection="column">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem colSpan={1}>
                  <img src={form.img1x1} width={200} height={200} alt="original image in aspect ratio 1:1"></img>
                </GridItem>
                <GridItem colSpan={1}>
                  <img src={form.img9x16} width={200} height={200} alt="original image in aspect ratio 9:16"></img>
                </GridItem>
              </Grid>
              <ul>
                {form.variations.map((variant, index) =>
                (<div key={index}>
                  <h2>Copy: {variant.copy}</h2>
                  <h3>CTA: {variant.cta}</h3>
                  <p>Target Audience: {variant.target_audience}</p>
                  <p>Target Platform: {variant.target_platform}</p>
                </div>
                ))}
              </ul>
            </Flex>
          </Container>
        }
      </div>
    </div>
  );
}
