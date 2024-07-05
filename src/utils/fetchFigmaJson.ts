const fetchFigmaJson = async (
  fileKey: string,
  nodeId: string,
  accessToken: string,
) => {
  const dataUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
  const response = await fetch(dataUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  return data;
};

export default fetchFigmaJson;
