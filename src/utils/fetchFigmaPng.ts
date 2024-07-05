import fs from "fs";

const fetchFigmaPng = async (
  fileKey: string,
  nodeId: string,
  accessToken: string,
) => {
  const imageUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png`;
  const imageResponse = await fetch(imageUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const imageData = await imageResponse.json();
  const pngUrl = imageData.images[nodeId];

  const png = await fetch(pngUrl);
  const pngBuffer = await png.arrayBuffer();
  const realBuffer = Buffer.from(pngBuffer);

  fs.writeFileSync("figma.png", realBuffer);
};

export default fetchFigmaPng;
