import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeNode, Tree } from 'src/app/models/common.model';
import { NewNodeDialogComponent } from '../new-node-dialog/new-node-dialog.component';

function isTree(element: TreeNode | Tree): element is Tree {
  return (element as Tree)?.length > 0;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit {
  private _selectedNode!: TreeNode;

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  treeData: Tree = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this._initData();
  }

  private _initData(): void {
    const loadedData = [
      {
        name: "guitars",
        children: [
          {
            name: "acoustic",
            children: [
              { name: "Kremona" },
              { name: "Epiphone" },
              { name: "Gibson" },
              { name: "Yamaha" },
            ],
          },
          {
            name: "electric",
            children: [
              {
                name: "Fender",
                children: [
                  { name: "Telecaster", },
                  { name: "Stratocaster", },
                  { name: "Jaguar", },
                ],
              },
              {
                name: "Gibson",
                children: [
                  { name: "Les Paul", },
                  { name: "SG", },
                  { name: "ES-335", },
                  { name: "ES-339", },
                ],
              },
            ],
          },
          { name: "acoustic bass" },
          { name: "electric bass" },
        ],
      },
    ] as Partial<Tree>;

    const fillGaps = (arr: Partial<Tree>, parentNode?: TreeNode): Tree => {
      const formattedTree: Tree = [];

      // Нужно добавить id, leaf (возможно, path) для последующих расчётов
      arr.forEach((node, index) => {
        let newNode: TreeNode = {
          id: index,
          name: node?.name ?? '',
          leaf: !!!node?.children,
          idPath: parentNode ? parentNode.idPath + '>' + index.toString() : index.toString()
        }

        if (!newNode.leaf && node?.children) {
          newNode.children = fillGaps(node.children, newNode);
        }

        formattedTree.push(newNode);
      })

      return formattedTree;
    }

    this.treeData = fillGaps(loadedData);
    this.dataSource.data = this.treeData;
  }

  private _getNode(pathStr: string, nodeType: 'parent' | 'self' = 'self'): TreeNode | Tree {
    // Моя гениальная функция для поиска родительского элемента
    const path: string[] = pathStr.split('>');
    const rootNode = this.treeData.find(node => node.id === +path[0])!;

    const nodes: Tree = [rootNode];

    // Удаляем первый элемент, так как уже не актуален.
    path.shift();
    if (path.length === 0) {
      return nodeType === 'parent'
        ? this.treeData : nodes[nodes.length - 1];
    }

    path.forEach((id, index) => {
      const currentNode = nodes[index];
      nodes.push(currentNode.children!.find(child => child.id === +id)!);
    })

    return nodeType === 'parent'
      ? nodes[nodes.length - 2] : nodes[nodes.length - 1];
  }

  private _refreshTree() {
    let _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }


  nodeClickHandler(node: TreeNode): void {
    console.log('You clicked on node: ', node);
    this._selectedNode = node;
  }

  addChildNode(): void {
    if (!this._selectedNode) return;

    const dialogRef = this.dialog.open(NewNodeDialogComponent, {
      disableClose: true, autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const parentNode = this._getNode(this._selectedNode.idPath);

        if (isTree(parentNode)) {
          const newNodeId = parentNode[parentNode.length - 1].id + 1;

          const newNode: TreeNode = {
            id: newNodeId,
            name: result,
            leaf: true,
            idPath: newNodeId.toString()
          };

          parentNode.push(newNode);
        } else {
          const newNodeId = parentNode.children![parentNode.children!.length - 1].id + 1;

          const newNode: TreeNode = {
            id: newNodeId,
            name: result,
            leaf: true,
            idPath: parentNode ? parentNode.idPath + '>' + newNodeId.toString() : newNodeId.toString()
          };

          parentNode.children!.push(newNode);
        }

        this._refreshTree();
      }
    });
  }

  deleteNode(): void {
    if (!this._selectedNode) return;

    const parentNode = this._getNode(this._selectedNode.idPath, 'parent');

    if (isTree(parentNode)) {
      const selectedNodeIndex = parentNode.findIndex((item) => item.id === this._selectedNode.id)!;
      parentNode.splice(selectedNodeIndex, 1);
    } else {
      const selectedNodeIndex = parentNode.children?.findIndex((item) => item.id === this._selectedNode.id)!;
      parentNode.children?.splice(selectedNodeIndex, 1);
    }

    this._refreshTree();
  }

  hasChild = (_: number, node: TreeNode) => !node.leaf;
}
