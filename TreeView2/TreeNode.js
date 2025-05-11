// TreeNode class definition
class TreeNode {
  constructor({
    id, label, checked = false, expanded = true, indeterminate = false, children = [], emitter = null,
  }) {
    this.id = id;
    this.label = label;
    this.checked = checked;
    this.expanded = expanded;
    this.children = children;
    this.parent = null;
    this._intermediate = indeterminate;
    this.emitter = emitter;
    this.children.forEach((child) => {
      child.parent = this;
      // Propagate emitter to children if not set
      if (!child.emitter) child.emitter = this.emitter;
    });
  }

  // Emit functions grouped together
  emitNodeAdded(childNode, position) {
    if (this.emitter) {
      this.emitter.emit('nodeAdded', {
        node: childNode,
        parent: this,
        position,
      });
    }
  }

  emitNodeChecked(checked) {
    if (this.emitter) {
      this.emitter.emit('nodeChecked', {
        node: this,
        checked,
      });
    }
  }

  emitNodeIndeterminate(indeterminate) {
    if (this.emitter) {
      this.emitter.emit('nodeIndeterminate', {
        node: this,
        indeterminate,
      });
    }
  }

  emitNodeRemoved(childNode, position) {
    if (this.emitter) {
      this.emitter.emit('nodeRemoved', {
        node: childNode,
        parent: this,
        position,
      });
    }
  }

  emitNodeExpanded(expanded) {
    if (this.emitter) {
      this.emitter.emit('nodeExpanded', {
        node: this,
        expanded: expanded,
      });
    }
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
    // Propagate emitter to child if not set
    if (!childNode.emitter) childNode.emitter = this.emitter;
    this.children.push(childNode);

    // Emit nodeAdded if emitter is set
    if (this.emitter) {
      const position = this.children.length - 1;
      this.emitNodeAdded(childNode, position);
    }
  }

  setChecked(checked, callback) {
    this.checked = checked;
    this._intermediate = false;
    this.traverseDepthFirst((child) => {
      child.checked = checked;
      child._intermediate = false;
      child.emitNodeChecked(checked);
    });
    if (this.parent) {
      this.parent.updateCheckStateFromChildren(callback);
    }

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

  updateCheckStateFromChildren() {
    const { allChecked, allUnchecked, mixed } = this.getChildrenCheckState();
    this._intermediate = false;
    this.checked = false;
    if (mixed)
    {
      this._intermediate = true;
      this.emitNodeIndeterminate(true);
    }
    else if (allUnchecked)
    {
      this.checked = false;
      this.emitNodeChecked(false)
    }
    else
    {
      this.checked = true;
      this.emitNodeChecked(true);
    }

    if (this.parent) {
      this.parent.updateCheckStateFromChildren();
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
      // Emit nodeRemoved if emitter is set
      if (this.emitter) {
        this.emitNodeRemoved(childNode, idx);
      }
    }
  }

  insertChildAt(childNode, position) {
    childNode.parent = this;
    // Propagate emitter to child if not set
    if (!childNode.emitter) childNode.emitter = this.emitter;
    if (position < 0) position = 0;
    if (position > this.children.length) position = this.children.length;
    this.children.splice(position, 0, childNode);
  }

  UpdateExpanded(expanded, callback) {
    this.expanded = expanded;
    if (callback) callback(this);
    // Emit nodeExpanded if emitter is set
    if (this.emitter) {
      this.emitNodeExpanded(expanded);
    }
  }
}

export { TreeNode };

