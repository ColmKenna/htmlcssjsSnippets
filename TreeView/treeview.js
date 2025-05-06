import { EventEmitter } from '../EventEmitter/EventEmitter.js';

// TreeNode class definition
class TreeNode {
  constructor({
    id,
    label,
    checked = false,
    expanded = true,
    indeterminate = false,
    children = [],
  }) {
    this.id = id;
    this.label = label;
    this.checked = checked;
    this.expanded = expanded;
    this.children = children;
    this.parent = null;
    this._intermediate = indeterminate;
    this.children.forEach((child) => {
      child.parent = this;
    });
  }

  traverseDepthFirst(callback) {
    const stack = [this];
    while (stack.length > 0) {
      const node = stack.pop();
      callback(node);
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }

  traverseBreadthFirst(callback) {
    const queue = [this];
    while (queue.length > 0) {
      const node = queue.shift();
      callback(node);
      queue.push(...node.children);
    }
  }

  addChild(childNode) {
    childNode.parent = this; // Set parent reference
    this.children.push(childNode);

    // Emit nodeAdded if _tree is set
    if (this._tree) {
      const position = this.children.length - 1;
      this._tree.emitter.emit('nodeAdded', {
        node: childNode,
        parent: this,
        position,
      });
    }
  }

  setChecked(checked, callback) {
    this.checked = checked;
    this._intermediate = false; // Reset intermediate state when explicitly set
    if (callback) callback(this);
    // Emit nodeChecked if _tree is set
    if (this._tree) {
      this._tree.emitter.emit('nodeChecked', {
        node: this,
        checked,
      });
    }
    // Update parent state
    if (this.parent) {
      this.parent.updateCheckStateFromChildren(callback);
    }
    this.children.forEach((child) => child.setChecked(checked, callback));
  }

  getChildrenCheckState() {
    let allChecked = true;
    let allUnchecked = true;

    for (const { checked } of this.children) {
      if (checked) allUnchecked = false;
      else allChecked = false;

      if (!allChecked && !allUnchecked) break; // mixed ⇒ no need to continue
    }

    const mixed = !allChecked && !allUnchecked;
    return { allChecked, allUnchecked, mixed };
  }

  updateCheckStateFromChildren(callback) {
    const { allChecked, allUnchecked, mixed } = this.getChildrenCheckState();
    this._intermediate = false;
    this.checked = false;
    if (mixed) this._intermediate = true;
    else if (allUnchecked) this.checked = false;
    else this.checked = true;

    if (callback) callback(this);
    if (this.parent) {
      this.parent.updateCheckStateFromChildren(callback);
    }
  }

  isIntermediate() {
    return !!this._intermediate;
  }

  removeChild(childNode) {
    const idx = this.children.indexOf(childNode);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      childNode.parent = null;
      // Emit nodeRemoved if _tree is set
      if (this._tree) {
        this._tree.emitter.emit('nodeRemoved', {
          node: childNode,
          parent: this,
          position: idx,
        });
      }
    }
  }

  insertChildAt(childNode, position) {
    childNode.parent = this;
    if (position < 0) position = 0;
    if (position > this.children.length) position = this.children.length;
    this.children.splice(position, 0, childNode);
  }

  UpdateExpanded(expanded, callback) {
    this.expanded = expanded;
    if (callback) callback(this);
    // Emit nodeExpanded if _tree is set
    if (this._tree) {
      this._tree.emitter.emit('nodeExpanded', {
        node: this,
        expanded: expanded,
      });
    }
  }
}

// Tree class definition
class Tree {
  constructor(roots = [], emitter = null) {
    this.emitter = emitter || new EventEmitter();
    this.roots = roots;
    // Set _tree property for all root nodes
    this.roots.forEach(rootNode => {
      rootNode._tree = this;
    });
  }

  addRoot(rootNode) {
    rootNode._tree = this;
    this.roots.push(rootNode);
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

  // moveTo function to move a node to a new parent at a specific position
  moveTo(node, newParent, position, callback) {
    // newParent is null if we want to move to root level
    if (!newParent) {
      // Move to root level
      let oldPosition;
      if (node.parent) {
        // Was a child, remove from parent
        oldPosition = node.parent.children.indexOf(node);
        node.parent.removeChild(node);
      } else {
        // Was a root, remove from roots
        oldPosition = this.roots.indexOf(node);
        this.roots = this.roots.filter((r) => r !== node);
      }
      // Check if the position is valid
      if (position < 0) position = 0;
      if (position > this.roots.length) position = this.roots.length;
      // Insert at the specified position
      this.roots.splice(position, 0, node);
      node.parent = null; // Set parent reference to null
      if (callback) callback(node.id, null, position);
      this.emitter.emit('nodeMoved', { node, newParent: null, position, oldPosition });
    } else {
      // Move to a new parent

      // Prevent moving to self or to a descendant
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
      if (callback) callback(node.id, newParent.id, position);
      this.emitter.emit('nodeMoved', { node, newParent, position, oldPosition });
    }
  }
}

export { TreeNode, Tree };