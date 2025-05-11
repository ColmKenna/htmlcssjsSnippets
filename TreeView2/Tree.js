import { EventEmitter } from '../EventEmitter/EventEmitter.js';
import { TreeNode } from './TreeNode.js';
// Tree class definition
class Tree {
  constructor(roots = [], emitter = null) {
    this.emitter = emitter || new EventEmitter();
    this.roots = [];
    // Set _tree property for all root nodes
    roots.forEach(rootNode => {
      this.addRoot(rootNode);      
    });
  }

  onNodeAdded(callback) {
    this.emitter.on('nodeAdded', callback);
  }

  onNodeRemoved(callback) {
    this.emitter.on('nodeRemoved', callback);
  }

  onNodeMoved(callback) {
    this.emitter.on('nodeMoved', callback);
  }

  onNodeChecked(callback) {
    this.emitter.on('nodeChecked', callback);
  }

  onNodeIndeterminate(callback) {
    this.emitter.on('nodeIndeterminate', callback);
  }

  onNodeExpanded(callback) {
    this.emitter.on('nodeExpanded', callback);
  }

  addRoot(rootNode) {
    // Set emitter for root and all descendants
    rootNode.emitter = this.emitter;
    rootNode.traverseDepthFirst(
      (nd) => nd.emitter = this.emitter
    );
    rootNode._tree = this;
    this.roots.push(rootNode);
    rootNode.traverseDepthFirst(
      (nd) => 
        nd._tree = this
    );    
    // Emit nodeAdded event with parent=null and position at end of roots
    this.emitter.emit('nodeAdded', {
      node: rootNode,
      parent: null,
      position: this.roots.length - 1,
    });
  }

  /**
   * Find a node by its id in the entire tree.
   * @param {string} id
   * @returns {TreeNode|null}
   */
  findNodeById(id) {
    let found = null;
    for (const root of this.roots) {
      root.traverseDepthFirst((n) => {
        if (n.id === id) {
          found = n;
        }
      });
      if (found) break;
    }
    return found;
  }

  moveTo(node, newParent, position) {
    if (!newParent) {
      let oldPosition;
      if (node.parent) {
        oldPosition = node.parent.children.indexOf(node);
        node.parent.removeChild(node);
      } else {
        oldPosition = this.roots.indexOf(node);
        this.roots = this.roots.filter((r) => r !== node);
      }
      if (position < 0) position = 0;
      if (position > this.roots.length) position = this.roots.length;
      this.roots.splice(position, 0, node);
      node.parent = null; // Set parent reference to null
      this.emitter.emit('nodeMoved', { node, newParent: null, position, oldPosition });
    } else {
      if (node === newParent) return;
      let isDescendant = false;
      node.traverseDepthFirst((n) => {
        if (n.id === newParent.id) isDescendant = true;
      });
      if (isDescendant) return;

      let oldPosition;
      if (node.parent) {
        oldPosition = node.parent.children.indexOf(node);
        node.parent.removeChild(node);
      } else {
        oldPosition = this.roots.indexOf(node);
        this.roots = this.roots.filter((r) => r !== node);
      }
      newParent.insertChildAt(node, position);
      node.parent = newParent; // Set new parent reference
      this.emitter.emit('nodeMoved', { node, newParent, position, oldPosition });
    }
  }
}

export { Tree };