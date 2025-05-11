import { TreeController } from './TreeController.js';
import { Tree } from './Tree.js';
import { TreeNode } from './TreeNode.js';

// Helper to mock DOM
function setupDOM(containerId) {
  document.body.innerHTML = `<div id="${containerId}"></div>`;
}

describe('TreeController', () => {
  let tree, root, child, controller;

  beforeEach(() => {
    root = new TreeNode({ id: 'root', label: 'Root' });
    child = new TreeNode({ id: 'child', label: 'Child' });
    tree = new Tree([root]);
    setupDOM('tree-container');
    controller = new TreeController(tree, 'tree-container');
  });

  test('addNode should add a child to the given parent', () => {
    controller.addNode('root', { id: 'newChild', label: 'New Child' });
    const newChild = root.children.find(c => c.id === 'newChild');
    expect(newChild).toBeDefined();
    expect(newChild.label).toBe('New Child');
    expect(newChild.parent).toBe(root);
  });

  test('addNode should do nothing if parent is not found', () => {
    controller.addNode('unknown', { id: 'x', label: 'X' });
    expect(root.children.length).toBe(0);
  });

  test('toggleExpand should collapse and expand node', () => {
    expect(root.expanded).toBe(true);
    controller.toggleExpand('root');
    expect(root.expanded).toBe(false);
    controller.toggleExpand('root');
    expect(root.expanded).toBe(true);
  });

  test('toggleExpand should do nothing if node not found', () => {
    expect(() => controller.toggleExpand('invalid')).not.toThrow();
  });

  test('moveNode should move node under new parent', () => {
    root.addChild(child);
    const newParent = new TreeNode({ id: 'newParent', label: 'New Parent' });
    tree.addRoot(newParent);

    controller.moveNode('child', 'newParent', 0);
    expect(child.parent).toBe(newParent);
    expect(newParent.children[0]).toBe(child);
  });

  test('moveNode should move node to root if newParentId is null', () => {
    root.addChild(child);
    controller.moveNode('child', null, 0);
    expect(tree.roots).toContain(child);
    expect(child.parent).toBe(null);
  });

  test('moveNode should do nothing if node not found', () => {
    expect(() => controller.moveNode('nope', null, 0)).not.toThrow();
  });

  test('onCheckboxChanged should update checked state of node', () => {
    root.checked = false;
    controller.onCheckboxChanged('root', true);
    expect(root.checked).toBe(true);
  });

  test('onCheckboxChanged should do nothing if node not found', () => {
    expect(() => controller.onCheckboxChanged('invalid', true)).not.toThrow();
  });

  test('constructor should throw if container is not found', () => {
    document.body.innerHTML = ''; // Remove all containers
    expect(() => new TreeController(tree, 'missing-container')).toThrow(
      'Container with ID "missing-container" not found.'
    );
  });
});