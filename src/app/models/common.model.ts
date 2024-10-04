export type TreeNodeResponse = {
  name: string;
  children?: TreeNodeResponse[];
};

export type TreeNode = {
  name: string;
  id: number;
  leaf: boolean;
  idPath: string;
  children: TreeNode[]
}

export type Tree = TreeNode[];