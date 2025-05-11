import { Tree } from './Tree.js';
import { TreeNode } from './TreeNode.js';
import { TreeView } from './TreeViewt.js';

export class TreeController {
    constructor(tree, containerId) {
      this.tree = tree;
  
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
      }
  
      this.view = new TreeView(container, tree, this);
  
      // Optionally bind event handlers here
      // this.bindUIActions();
    }
  
    addNode(parentId, nodeData) {
      const parent = this.tree.findNodeById(parentId);
      if (!parent) return;
  
      const newNode = new TreeNode(nodeData);
      parent.addChild(newNode);
    }
  
    toggleExpand(nodeId) {
      const node = this.tree.findNodeById(nodeId);
      if (node) node.UpdateExpanded(!node.expanded);
    }
  
    moveNode(nodeId, newParentId, position) {
      const node = this.tree.findNodeById(nodeId);
      const newParent = newParentId ? this.tree.findNodeById(newParentId) : null;
  
      if (node) {
        this.tree.moveTo(node, newParent, position);
      }
    }

    onCheckboxChanged(nodeId, checked) {
      // Implement your logic here, e.g.:
      const node = this.tree.findNodeById(nodeId);
      if (node) {
        node.setChecked(checked);
      }
    }
}