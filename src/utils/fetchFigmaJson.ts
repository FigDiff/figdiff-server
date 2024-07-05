const fetchFigmaJson = async (
  fileKey: string,
  nodeId: string,
  accessToken: string,
) => {
  try {
    const dataUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
    const response = await fetch(dataUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const figmaData = await response.json();

    return figmaData;
  } catch (err) {
    throw new Error("Failed to fetch figma data");
  }
};

export default fetchFigmaJson;
