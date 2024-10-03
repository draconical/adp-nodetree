export interface IFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

export type TreeNode = {
  id: number;
  name: string;
  leaf: boolean;
  idPath: string;
  children?: TreeNode[];
};

export type Tree = TreeNode[];

