import { DataService } from './../../services/data.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeNode, Tree, TreeNodeResponse } from 'src/app/models/common.model';
import { NewNodeDialogComponent } from '../new-node-dialog/new-node-dialog.component';

function isTree(element: TreeNode | Tree): element is Tree {
  return (element as Tree)?.length > 0;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit {
  private _selectedNode!: TreeNode;

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  treeData: Tree = [];

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((response) => {
      this._initData(response);
    });
  }

  private _initData(loadedData: TreeNodeResponse): void {
    const fillGaps = (arr: TreeNodeResponse[], parentNode?: TreeNode): Tree => {
      const formattedTree: Tree = [];

      // Нужно добавить id, leaf (возможно, path) для последующих расчётов
      arr.forEach((node, index) => {
        let newNode: TreeNode = {
          id: index,
          name: node.name ?? '',
          leaf: !!!node.children,
          idPath: parentNode ? parentNode.idPath + '>' + index.toString() : index.toString(),
          children: parentNode?.children ? [...parentNode.children] : [],
        }

        if (!newNode.leaf && node?.children) {
          newNode.children = fillGaps(node.children, newNode);
        }

        formattedTree.push(newNode);
      })

      return formattedTree;
    }

    this.treeData = fillGaps([loadedData]);
    this.dataSource.data = this.treeData;
  }

  private _checkNodeIsLeaf(node: TreeNode): void {
    node.leaf = !(node.children.length > 0);
  }

  private _getNodesByPath(pathStr: string): Tree {
    // Моя гениальная функция для поиска родительского элемента
    const path: string[] = pathStr.split('>');
    const rootNode = this.treeData.find(node => node.id === +path[0])!;

    const nodes: Tree = [rootNode];

    // Удаляем первый элемент, так как уже не актуален.
    path.shift();

    // Если нет, начинаем поиск вглубь
    path.forEach((id, index) => {
      const currentNode = nodes[index];
      nodes.push(currentNode.children.find(child => child.id === +id)!);
    })

    return nodes;
  }

  private _getPathString(pathStr: string): string {
    const nodes = this._getNodesByPath(pathStr);

    return nodes.map(node => node.name).join(' > ');
  }

  private _getParentNode(pathStr: string): TreeNode | Tree {
    const nodes = this._getNodesByPath(pathStr);

    // Возвращает либо предпоследний элемент (т. е. родительский)
    return nodes[nodes.length - 2] ?? this.treeData;
  }

  private _refreshTree() {
    let _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }

  nodeClickHandler(node: TreeNode): void {
    this._selectedNode = node;
  }

  addChildNode(): void {
    if (!this._selectedNode) return;

    const dialogRef = this.dialog.open(NewNodeDialogComponent, {
      disableClose: true, autoFocus: false
    });

    dialogRef.beforeClosed().subscribe(result => {
      if (result) {
        const parentNode = this._selectedNode;

        const newNodeId = parentNode.children.length > 0
          ? parentNode.children![parentNode.children!.length - 1].id + 1 : 1;

        const newNode: TreeNode = {
          id: newNodeId,
          name: result,
          leaf: true,
          idPath: parentNode.idPath + '>' + newNodeId.toString(),
          children: []
        }

        parentNode.children.push(newNode);

        // Проверка на leaf
        this._checkNodeIsLeaf(parentNode);

        console.log(this.treeData);

        this._refreshTree();
      }
    });
  }

  deleteNode(): void {
    if (!this._selectedNode) return;

    const parentNode = this._getParentNode(this._selectedNode.idPath);

    // Пробиваем тип ноды на случай, если это само дерево
    if (isTree(parentNode)) {
      const selectedNodeIndex = parentNode.findIndex((item) => item.id === this._selectedNode.id)!;
      parentNode.splice(selectedNodeIndex, 1);
    } else {
      const selectedNodeIndex = parentNode.children.findIndex((item) => item.id === this._selectedNode.id)!;
      parentNode.children.splice(selectedNodeIndex, 1);

      // Проверка на leaf
      this._checkNodeIsLeaf(parentNode);
    }

    this._refreshTree();
  }

  showPath(): void {
    console.log('Путь до текущей ноды: ', this._getPathString(this._selectedNode.idPath));
  }

  hasChild = (_: number, node: TreeNode) => !node.leaf;
}
