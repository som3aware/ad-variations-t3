import sharp from "sharp";
import { ref, uploadBytes, getDownloadURL, getBytes } from "firebase/storage";

import { storage } from "@/firebase";

export type IFile = {
  url: string;
  name: string;
  type: string;
};

async function to1x1Ratio(image: ArrayBuffer, width: number, height: number) {
  try {
    const size = Math.min(width, height);
    return await sharp(image).resize(size, size, { fit: "cover" }).toBuffer();
  } catch (error) {
    console.log(`to1x1Ratio error:`, error);
  }
}

async function to9x16Ratio(image: ArrayBuffer, width: number, height: number) {
  try {
    const ratio = 9 / 16;
    const newWidth = Math.round(height * ratio);
    return await sharp(image)
      .resize(newWidth, height, { fit: "cover" })
      .toBuffer();
  } catch (error) {
    console.log(`to9x16Ratio error:`, error);
  }
}

async function downloadImage(imageUrl: string) {
  try {
    const imageRef = ref(storage, imageUrl);
    return await getBytes(imageRef);
  } catch (error) {
    console.log(`downloadImage error:`, error);
  }
}

async function uploadImage(image: Buffer, name: string) {
    try {
        const imgRef = ref(storage, `images/${name}`)
        await uploadBytes(imgRef, image)
        return await getDownloadURL(imgRef)
    } catch (error) {
        console.log(`processImage error:`, error);
    }
}

export async function processImage(file: IFile) {
  try {
    // download image
    const img = await downloadImage(file.url);

    // get image height & width
    const { width, height } = await sharp(img).metadata();

    // convert to aspect ratio 1:1
    const img1x1 = await to1x1Ratio(img!, width!, height!);

    // convert to aspect ratio 9:16
    const img9x16 = await to9x16Ratio(img!, width!, height!);

    // upload both images to firebase storage
    const img1x1Url = await uploadImage(img1x1!, `1x1-${file.name}`);
    const img9X16Url = await uploadImage(img9x16!, `9x16-${file.name}`);

    return { img1x1Url, img9X16Url };
  } catch (error) {
    console.log(`processImage error:`, error);
  }
}
