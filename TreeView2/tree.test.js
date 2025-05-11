const { describe, test, expect, beforeEach } = require('@jest/globals');
const { Tree } = require('./Tree.js');
const { TreeNode } = require('./TreeNode.js');
const {EventEmitter} = require('../EventEmitter/EventEmitter.js'); 

describe('TreeNode', () => {
  let parent, child, child1, child2, grandchild, eventEmitter;

  beforeEach(() => {
    parent = new TreeNode({ id: 'p', label: 'Parent' });
    child = new TreeNode({ id: 'c', label: 'Child' });
    child1 = new TreeNode({ id: 'c1', label: 'Child 1' });
    child2 = new TreeNode({ id: 'c2', label: 'Child 2' });
    grandchild = new TreeNode({ id: 'gc', label: 'Grandchild' });
    eventEmitter = new EventEmitter();
  });

  test('TreeNode constructor sets parent on children', () => {
    const localChild = new TreeNode({ id: 'child1', label: 'Child' });
    const localParent = new TreeNode({ id: 'p1', label: 'Parent', children: [localChild] });
    expect(localChild.parent).toBe(localParent);
  });

  test('insertChildAt bounds correction', () => {
    parent.insertChildAt(child, -5);
    expect(parent.children[0]).toBe(child);

    const child2 = new TreeNode({ id: 'child2', label: 'Child2' });
    parent.insertChildAt(child2, 100);
    expect(parent.children[1]).toBe(child2);
  });

  test('UpdateExpanded sets expanded and calls callback', () => {
    const node = new TreeNode({ id: 'n', label: 'Node' });
    const cb = jest.fn();
    node.UpdateExpanded(false, cb);
    expect(node.expanded).toBe(false);
    expect(cb).toHaveBeenCalledWith(node);
  });

  test('UpdateExpanded sets expanded when no callback is provided', () => {
    const node = new TreeNode({ id: 'n', label: 'Node', expanded: true });
    node.UpdateExpanded(false);
    expect(node.expanded).toBe(false);
    node.UpdateExpanded(true);
    expect(node.expanded).toBe(true);
  });

  test('removeChild does nothing if child is not present', () => {
    const notAChild = new TreeNode({ id: 'x', label: 'X' });
    parent.removeChild(notAChild);
    expect(parent.children).toEqual([]);
    expect(notAChild.parent).toBe(null);
  });

  test('moveTo does not remove root if already at root and has no parent', () => {
    const node = new TreeNode({ id: 'r', label: 'Root' });
    const tree = new Tree([node]);
    tree.moveTo(node, null, 0);
    expect(tree.roots).toContain(node);
  });

  test('moveTo clamps root position when too large', () => {
    const node = new TreeNode({ id: 'a', label: 'A' });
    const tree = new Tree([]);
    tree.moveTo(node, null, 100);
    expect(tree.roots).toContain(node);
  });

  test('moveTo to self is ignored', () => {
    const node = new TreeNode({ id: 'a', label: 'A' });
    const tree = new Tree([node]);
    tree.moveTo(node, node, 0);
    expect(tree.roots).toContain(node);
  });

  test('moveTo to descendant is ignored', () => {
    parent.addChild(child);
    const tree = new Tree([parent]);
    tree.moveTo(parent, child, 0);
    expect(child.parent).toBe(parent);
  });

  test('should create a node with label and id', () => {
    const node = new TreeNode({ id: 'n1', label: 'Node 1' });
    expect(node.id).toBe('n1');
    expect(node.label).toBe('Node 1');
    expect(node.checked).toBe(false);
    expect(node.expanded).toBe(true);
    expect(node.children).toEqual([]);
    expect(node.parent).toBe(null);
  });

  test('should set the parent for child nodes', () => {
    parent.addChild(child);
    expect(child.parent).toBe(parent);
  });

  test('should add a child and set parent reference', () => {
    parent.addChild(child);
    expect(parent.children).toContain(child);
    expect(child.parent).toBe(parent);
  });

  test('should traverse depth-first in correct order', () => {
    //        root
    //      /  |   \
    //    a   b    c
    //   / \      / \
    //  d   e    f   g
    const root = new TreeNode({ id: 'root', label: 'Root' });
    const a = new TreeNode({ id: 'a', label: 'A' });
    const b = new TreeNode({ id: 'b', label: 'B' });
    const c = new TreeNode({ id: 'c', label: 'C' });
    const d = new TreeNode({ id: 'd', label: 'D' });
    const e = new TreeNode({ id: 'e', label: 'E' });
    const f = new TreeNode({ id: 'f', label: 'F' });
    const g = new TreeNode({ id: 'g', label: 'G' });

    a.addChild(d);
    a.addChild(e);
    c.addChild(f);
    c.addChild(g);
    root.addChild(a);
    root.addChild(b);
    root.addChild(c);

    const result = [];
    root.traverseDepthFirst(node => result.push(node.id));
    expect(result).toEqual(['root', 'a', 'd', 'e', 'b', 'c', 'f', 'g']);
  });

  test('should traverse breadth-first in correct order', () => {
    //        root
    //      /  |   \
    //    a   b    c
    //   / \      / \
    //  d   e    f   g
    const root = new TreeNode({ id: 'root', label: 'Root' });
    const a = new TreeNode({ id: 'a', label: 'A' });
    const b = new TreeNode({ id: 'b', label: 'B' });
    const c = new TreeNode({ id: 'c', label: 'C' });
    const d = new TreeNode({ id: 'd', label: 'D' });
    const e = new TreeNode({ id: 'e', label: 'E' });
    const f = new TreeNode({ id: 'f', label: 'F' });
    const g = new TreeNode({ id: 'g', label: 'G' });

    a.addChild(d);
    a.addChild(e);
    c.addChild(f);
    c.addChild(g);
    root.addChild(a);
    root.addChild(b);
    root.addChild(c);

    const result = [];
    root.traverseBreadthFirst(node => result.push(node.id));
    expect(result).toEqual(['root', 'a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });

  test('should traverse depth-first in post-order', () => {
    //        root
    //      /  |   \
    //    a   b    c
    //   / \      / \
    //  d   e    f   g
    const root = new TreeNode({ id: 'root', label: 'Root' });
    const a = new TreeNode({ id: 'a', label: 'A' });
    const b = new TreeNode({ id: 'b', label: 'B' });
    const c = new TreeNode({ id: 'c', label: 'C' });
    const d = new TreeNode({ id: 'd', label: 'D' });
    const e = new TreeNode({ id: 'e', label: 'E' });
    const f = new TreeNode({ id: 'f', label: 'F' });
    const g = new TreeNode({ id: 'g', label: 'G' });

    a.addChild(d);
    a.addChild(e);
    c.addChild(f);
    c.addChild(g);
    root.addChild(a);
    root.addChild(b);
    root.addChild(c);

    // Post-order: d, e, a, b, f, g, c, root
    const result = [];
    function traversePostOrder(node, cb) {
      node.children.forEach(child => traversePostOrder(child, cb));
      cb(node);
    }
    traversePostOrder(root, node => result.push(node.id));
    expect(result).toEqual(['d', 'e', 'a', 'b', 'f', 'g', 'c', 'root']);
  });

  test('should update checked state and propagate to children', () => {
    child.addChild(grandchild);
    parent.addChild(child);

    parent.setChecked(true);
    expect(parent.checked).toBe(true);
    expect(child.checked).toBe(true);
    expect(grandchild.checked).toBe(true);
  });

  test('should update parent indeterminate state', () => {
    parent.addChild(child1);
    parent.addChild(child2);

    child1.setChecked(true);
    expect(parent.isIntermediate()).toBe(true);
    expect(parent.checked).toBe(false);
  });

  test('should remove and insert children correctly', () => {
    parent.addChild(child1);
    parent.insertChildAt(child2, 0);
    expect(parent.children[0]).toBe(child2);

    parent.removeChild(child2);
    expect(parent.children).not.toContain(child2);
    expect(child2.parent).toBe(null);
  });

  test('updateCheckStateFromChildren sets checked=false and emits nodeChecked(false) when all children are unchecked', () => {
    parent.addChild(child1);
    parent.addChild(child2);

    // Set both children to unchecked
    child1.setChecked(false);
    child2.setChecked(false);

    const eventSpy = jest.fn();
    parent.emitter = new EventEmitter();
    parent.emitter.on('nodeChecked', eventSpy);

    // Force updateCheckStateFromChildren
    parent.updateCheckStateFromChildren();

    expect(parent.checked).toBe(false);
    expect(parent.isIntermediate()).toBe(false);
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ node: parent, checked: false }));
  });

  test('updateCheckStateFromChildren sets checked=true and emits nodeChecked(true) when all children are checked', () => {
    parent.addChild(child1);
    parent.addChild(child2);

    // Set both children to checked
    child1.setChecked(true);
    child2.setChecked(true);

    const eventSpy = jest.fn();
    parent.emitter = new EventEmitter();
    parent.emitter.on('nodeChecked', eventSpy);

    // Force updateCheckStateFromChildren
    parent.updateCheckStateFromChildren();

    expect(parent.checked).toBe(true);
    expect(parent.isIntermediate()).toBe(false);
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ node: parent, checked: true }));
  });

  test('updateCheckStateFromChildren calls parent.updateCheckStateFromChildren', () => {
    parent.addChild(child1);

    // Spy on parent's updateCheckStateFromChildren
    const spy = jest.spyOn(parent, 'updateCheckStateFromChildren');

    // Call on child1, should propagate to parent
    child1.updateCheckStateFromChildren();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Tree', () => {
  let tree, root, a, b, child, n1, n2, eventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    root = new TreeNode({ id: 'root', label: 'Root' });
    a = new TreeNode({ id: 'a', label: 'A' });
    b = new TreeNode({ id: 'b', label: 'B' });
    child = new TreeNode({ id: 'child', label: 'Child' });
    n1 = new TreeNode({ id: 'n1', label: 'Node 1' });
    n2 = new TreeNode({ id: 'n2', label: 'Node 2' });
    tree = new Tree([], eventEmitter);
  });

  test('should add root nodes and find by id', () => {
    tree.addRoot(n1);
    tree.addRoot(n2);
    expect(tree.roots.length).toBe(2);
    expect(tree.findNodeById('n2')).toBe(n2);
    expect(tree.findNodeById('notfound')).toBe(null);
  });

  test('should move node to a different parent', () => {
    tree = new Tree([root]);
    root.addChild(a);
    root.addChild(b);

    tree.moveTo(a, b, 0);
    expect(b.children[0]).toBe(a);
    expect(a.parent).toBe(b);
  });

  test('should not allow move to self or descendant', () => {
    tree = new Tree([root]);
    root.addChild(child);

    tree.moveTo(root, child, 0);
    expect(child.children).not.toContain(root);
    expect(tree.roots).toContain(root);
    expect(child.parent).toBe(root);
  });

  test('should move node to root level', () => {
    tree = new Tree([root]);
    root.addChild(child);
    tree.moveTo(child, null, 0);
    expect(tree.roots[0]).toBe(child);
    expect(child.parent).toBe(null);
    expect(root.children).not.toContain(child);
  });

  test('moveTo clamps root position to 0 when negative', () => {
    tree.moveTo(a, null, -10);
    expect(tree.roots[0]).toBe(a);
    expect(tree.roots.length).toBe(1);
  });

  test('moveTo removes node from roots before inserting at new root position', () => {
    tree = new Tree([n1, n2]);
    tree.moveTo(n1, null, 1);
    expect(tree.roots[1]).toBe(n1);
    expect(tree.roots.length).toBe(2);
    expect(tree.roots[0]).toBe(n2);
  });

  test('moveTo removes node from roots when moving to a new parent', () => {
    tree = new Tree([n1, n2]);
    tree.moveTo(n1, n2, 0);
    expect(tree.roots).not.toContain(n1);
    expect(n2.children[0]).toBe(n1);
    expect(n1.parent).toBe(n2);
    expect(tree.roots.length).toBe(1);
    expect(tree.roots[0]).toBe(n2);
  });

  test('moveTo emits nodeMoved event with correct arguments', () => {
    const node = new TreeNode({ id: 'n', label: 'Node' });
    const parent = new TreeNode({ id: 'p', label: 'Parent' });

    const eventEmitter = new EventEmitter();
    const tree = new Tree([node, parent],  eventEmitter);

    const eventSpy = jest.fn();
    eventEmitter.on('nodeMoved', eventSpy);

    // Move node from root to parent at position 2
    tree.moveTo(node, parent, 2);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(node);
    expect(evt.newParent).toBe(parent);
    expect(evt.position).toBe(2);
  });

  // Test for moving a node to a root level
  test('moveTo emits nodeMoved event when moving to root level', () => {
    const node = new TreeNode({ id: 'n', label: 'Node' });
    const tree = new Tree([node], eventEmitter);
    const eventSpy = jest.fn();
     eventEmitter.on('nodeMoved', eventSpy);

    // Move node to root level
    tree.moveTo(node, null, 0);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(node);
    expect(evt.newParent).toBe(null);
    expect(evt.position).toBe(0);
  }); 

  test('emits nodeAdded event with correct parent and position when adding as root', () => {
    const eventSpy = jest.fn();
    eventEmitter.on('nodeAdded', eventSpy);

    tree.addRoot(n1);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(n1);
    expect(evt.parent).toBe(null);
    expect(evt.position).toBe(0);
  });

  test('emits nodeAdded event with correct parent and position when adding as child', () => {
    tree.addRoot(root);
    const eventSpy = jest.fn();
    eventEmitter.on('nodeAdded', eventSpy);

    root.addChild(a);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(a);
    expect(evt.parent).toBe(root);
    expect(evt.position).toBe(0);
  });

  test('emits nodeRemoved event with correct node, parent, and position when removing a child', () => {
    tree.addRoot(root);
    root.addChild(a);
    const eventSpy = jest.fn();
    eventEmitter.on('nodeRemoved', eventSpy);

    root.removeChild(a);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(a);
    expect(evt.parent).toBe(root);
    expect(evt.position).toBe(0);
  });

  test('emits nodeChecked event with correct node and checked state when a node is checked', () => {
    tree.addRoot(root);
    const eventSpy = jest.fn();
    eventEmitter.on('nodeChecked', eventSpy);

    root.setChecked(true);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(root);
    expect(evt.checked).toBe(true);
  });

  test('emits nodeExpanded event with correct node and expanded state when a node is expanded or collapsed', () => {
    tree.addRoot(root);
    const eventSpy = jest.fn();
    eventEmitter.on('nodeExpanded', eventSpy);

    // Collapse the node
    root.UpdateExpanded(false);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    let evt = eventSpy.mock.calls[0][0];
    expect(evt.node).toBe(root);
    expect(evt.expanded).toBe(false);

    // Expand the node again
    root.UpdateExpanded(true);

    expect(eventSpy).toHaveBeenCalledTimes(2);
    evt = eventSpy.mock.calls[1][0];
    expect(evt.node).toBe(root);
    expect(evt.expanded).toBe(true);
  });

  test('onNodeAdded registers callback and is called when node is added', () => {
    const cb = jest.fn();
    tree.onNodeAdded(cb);
    tree.addRoot(n1);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(n1);
  });

  test('onNodeRemoved registers callback and is called when node is removed', () => {
    tree.addRoot(root);
    root.addChild(a);
    const cb = jest.fn();
    tree.onNodeRemoved(cb);
    root.removeChild(a);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(a);
  });

  test('onNodeMoved registers callback and is called when node is moved', () => {
    tree.addRoot(root);
    root.addChild(a);
    const cb = jest.fn();
    tree.onNodeMoved(cb);
    tree.moveTo(a, null, 0);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(a);
  });

  test('onNodeChecked registers callback and is called when node is checked', () => {
    tree.addRoot(root);
    const cb = jest.fn();
    tree.onNodeChecked(cb);
    root.setChecked(true);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(root);
    expect(cb.mock.calls[0][0].checked).toBe(true);
  });

  test('onNodeIndeterminate registers callback and is called when node becomes indeterminate', () => {
    tree.addRoot(root);
    root.addChild(a);
    root.addChild(b);
    const cb = jest.fn();
    tree.onNodeIndeterminate(cb);
    a.setChecked(true); // root should become indeterminate
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(root);
    expect(cb.mock.calls[0][0].indeterminate).toBe(true);
  });

  test('onNodeExpanded registers callback and is called when node is expanded/collapsed', () => {
    tree.addRoot(root);
    const cb = jest.fn();
    tree.onNodeExpanded(cb);
    root.UpdateExpanded(false);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].node).toBe(root);
    expect(cb.mock.calls[0][0].expanded).toBe(false);
    root.UpdateExpanded(true);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb.mock.calls[1][0].expanded).toBe(true);
  });
});
