const fetchFigmaPng = async (
  fileKey: string,
  nodeId: string,
  accessToken: string,
) => {
  try {
    const imageUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&use_absolute_bounds=true`;
    const imageResponse = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const imageData = await imageResponse.json();
    const pngUrls = imageData.images;
    const figmaPngBuffers = [];

    for (const key in pngUrls) {
      const figmaPng = await fetch(pngUrls[key]);
      const figmaPngBufferArray = await figmaPng.arrayBuffer();
      const figmaPngBuffer = Buffer.from(figmaPngBufferArray);

      figmaPngBuffers.push(figmaPngBuffer);
    }

    return figmaPngBuffers;
  } catch (err) {
    throw new Error("Failed to fetch figma Png");
  }
};

export default fetchFigmaPng;
