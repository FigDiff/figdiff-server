interface AbsoluteBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox: AbsoluteBoundingBox;
}

interface FigmaDocument {
  document: FigmaNode;
}

interface FigmaJson {
  nodes: { [key: string]: FigmaDocument };
}

const flattenFigmaNodes = (figmaJson: FigmaJson): FigmaNode[] => {
  const flatNodes: FigmaNode[] = [];
  let isFirstNode = true;

  const dfs = (currentNode: FigmaNode) => {
    if (isFirstNode) {
      isFirstNode = false;
      if (currentNode.children) {
        currentNode.children.forEach((child: FigmaNode) => dfs(child));
      }

      return;
    }
    const nodeCopy = { ...currentNode };
    delete nodeCopy.children;
    flatNodes.push(nodeCopy);

    if (currentNode.children) {
      currentNode.children.forEach((child: FigmaNode) => dfs(child));
    }
  };

  Object.values(figmaJson.nodes).forEach((node: FigmaDocument) =>
    dfs(node.document),
  );

  return flatNodes;
};

export default flattenFigmaNodes;
