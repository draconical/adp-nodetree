import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeNode, Tree } from 'src/app/models/common.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  treeData: Tree = [];

  constructor() { }

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
          indexPath: parentNode ? parentNode.indexPath + '>' + index.toString() : index.toString()
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

  private _getParentNode(pathStr: string): TreeNode {
    // Моя гениальная функция для поиска родительского элемента
    const path: string[] = pathStr.split('>');
    const rootNode = this.treeData[+path[0]];

    const nodes: Tree = [rootNode];

    // Удаляем первый элемент, так как уже не актуален.
    path.shift();
    path.forEach((index, i) => {
      const currentNode = nodes[i];
      currentNode ? nodes.push(currentNode.children![+index]) : nodes.push(rootNode.children![+index]);
    })

    console.log('Nodes:', nodes);
    return nodes[nodes.length - 2] ?? this.treeData;
  }

  private _refreshTree() {
    let _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }

  nodeClickHandler(node: TreeNode): void {
    console.log('You clicked on node: ', node);

    const parentNode = this._getParentNode(node.indexPath);
    console.log('Its parent node is: ', parentNode);

    // setTimeout(() => {
    //   parentNode.children?.splice(node.id, 1);
    //   this._refreshTree();
    // }, 1500);
  }

  hasChild = (_: number, node: TreeNode) => !node.leaf;
}
