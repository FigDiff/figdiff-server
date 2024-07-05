import fs from "fs";

const fetchFigmaPng = async (
  fileKey: string,
  nodeId: string,
  accessToken: string,
) => {
  try {
    const imageUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png`;
    const imageResponse = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const imageData = await imageResponse.json();
    const pngUrl = imageData.images[nodeId];

    const figmaPng = await fetch(pngUrl);
    const figmaPngBufferArray = await figmaPng.arrayBuffer();
    const figmaPngBuffer = Buffer.from(figmaPngBufferArray);

    fs.writeFileSync("figma.png", figmaPngBuffer);

    return figmaPngBuffer;
  } catch (err) {
    throw new Error("Failed to fetch figma Png");
  }
};

export default fetchFigmaPng;
