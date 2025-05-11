/**
 * @jest-environment jsdom
 */

import { TreeView } from './TreeViewt.js';
import { Tree } from './Tree.js';
import { TreeNode } from './TreeNode.js';

describe('TreeView', () => {
  let root, child1, child2, tree, controller, container, view,newParent,root2,child1root2;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `<div id="tree-container"></div>`;
    container = document.getElementById('tree-container');

    // Tree setup
    root = new TreeNode({ id: 'root', label: 'Root' });
    child1 = new TreeNode({ id: 'c1', label: 'Child 1' });
    child2 = new TreeNode({ id: 'c2', label: 'Child 2' });

    root2 = new TreeNode({ id: 'root2', label: 'Root 2' });
    child1root2 = new TreeNode({ id: 'c1r2', label: 'Child 1 Root 2' });
    root2.addChild(child1root2);
    
    root.addChild(child1);
    root.addChild(child2);
    newParent = new TreeNode({ id: 'np', label: 'New Parent' });


    tree = new Tree([root,newParent, root2]);

    // Controller mock
    controller = {
      onCheckboxChanged: jest.fn(),
      toggleExpand: jest.fn(),
      moveNode: jest.fn(),
    };

    view = new TreeView(container, tree, controller);
  });

  test('renders nodes with correct structure', () => {
    const rootLi = container.querySelector('li[data-node-id="root"]');
    const childLi = container.querySelector('li[data-node-id="c1"]');
    expect(rootLi).not.toBeNull();
    expect(childLi).not.toBeNull();

    const toggle = rootLi.querySelector('.toggle-icon');
    expect(toggle).not.toBeNull();

    const checkbox = rootLi.querySelector('input[type="checkbox"]');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.getAttribute('data-node-id')).toBe('root');
  });

  test('checkbox change triggers controller callback', () => {
    const checkbox = container.querySelector('input[type="checkbox"][data-node-id="root"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    expect(controller.onCheckboxChanged).toHaveBeenCalledWith('root', true);
  });

  test('toggle icon click calls controller.toggleExpand', () => {
    const toggle = container.querySelector('li[data-node-id="root"] .toggle-icon');
    toggle.click();
    expect(controller.toggleExpand).toHaveBeenCalledWith('root');
  });

  test('updateCheckState updates checkbox state and indeterminate', () => {
    const checkbox = container.querySelector('input[type="checkbox"][data-node-id="root"]');
    view.updateCheckState({ node: root, checked: true });
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  test('updateNodeExpanded updates aria-expanded and toggle icon', () => {
    root.expanded = false;
    view.updateNodeExpanded({ node: root, expanded: false });

    const li = container.querySelector('li[data-node-id="root"]');
    const ul = li.querySelector('ul.children-ul');
    expect(li.getAttribute('aria-expanded')).toBe('false');
    expect(ul.classList.contains('collapsed')).toBe(true);
  });


  test('moveElement moves node to new root position', () => {
    const node = tree.findNodeById('c1');
    const li = container.querySelector(`li[data-node-id="c1"]`);
  
    view.moveElement({ node, newParent: null, position: 0 });
  
    const newParentUl = container.querySelector('ul');
    expect(newParentUl.contains(li)).toBe(true);
  });

  test('moveElement creates children-ul on new parent if missing', () => {

    const node = tree.findNodeById('c1');
    const li = container.querySelector(`li[data-node-id="c1"]`);
  
    view.moveElement({ node, newParent, position: 0 });
  
    const parentLi = container.querySelector(`li[data-node-id="np"]`);
    const childrenUl = parentLi.querySelector('ul.children-ul');
    expect(childrenUl).not.toBeNull();
    expect(childrenUl.contains(li)).toBe(true);
  });

  test('moveElement removes children-ul from old parent if empty and updates toggle', () => {
    const node = root2.children[0];
    const oldParentLi = container.querySelector(`li[data-node-id="root2"]`);
    const oldParentUl = oldParentLi.querySelector('ul.children-ul');
    const oldParentLiChildren = oldParentUl.querySelectorAll('li');
  
    // Remove node to make root have no children
    view.moveElement({ node, newParent: null, position: 0 });

    const updatedUl = oldParentLi.querySelector('ul.children-ul');
    const icon = oldParentLi.querySelector('.toggle-icon > i')  ;
  
    expect(updatedUl).toBeNull();
    expect(icon.classList.contains('icon-transparent')).toBe(true);
  });

  test('createNodeLabel uses template if present', () => {
    // Add a template to the container
    const template = document.createElement('template');
    template.classList.add('node-template');
    template.innerHTML = '<span>{{label}}-{{id}}</span>';
    container.appendChild(template);

    const node = new TreeNode({ id: 'templ', label: 'Templated' });
    const labelSpan = view.createNodeLabel(node);

    expect(labelSpan.innerHTML).toBe('<span>Templated-templ</span>');
  });

  test('createNodeLabel falls back to label if no template', () => {
    const node = new TreeNode({ id: 'plain', label: 'PlainLabel' });
    const labelSpan = view.createNodeLabel(node);

    expect(labelSpan.textContent).toBe('PlainLabel');
  });

  test('addDragAndDropHandlers adds drag and drop event listeners', () => {
    const div = document.createElement('div');
    const node = new TreeNode({ id: 'dragtest', label: 'Drag Test' });
    const viewInstance = new TreeView(container, tree, controller);

    // Spy on handler methods
    viewInstance.handleDragStart = jest.fn();
    viewInstance.handleDragEnd = jest.fn();
    viewInstance.handleDragOver = jest.fn();
    viewInstance.handleDragLeave = jest.fn();
    viewInstance.handleDropOnNode = jest.fn();

    viewInstance.addDragAndDropHandlers(div, node);

    expect(div.getAttribute('draggable')).toBe('true');

    // Simulate events and check if handlers are called
    const eventTypes = [
      { type: 'dragstart', handler: viewInstance.handleDragStart },
      { type: 'dragend', handler: viewInstance.handleDragEnd },
      { type: 'dragover', handler: viewInstance.handleDragOver },
      { type: 'dragleave', handler: viewInstance.handleDragLeave },
      { type: 'drop', handler: viewInstance.handleDropOnNode }
    ];

    eventTypes.forEach(({ type, handler }) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      div.dispatchEvent(event);
      expect(handler).toHaveBeenCalled();
      handler.mockClear();
    });
  });

  test('createDropzone adds dragover, dragleave, and drop event listeners', () => {
    const node = new TreeNode({ id: 'dztest', label: 'Dropzone Test' });
    const viewInstance = new TreeView(container, tree, controller);

    // Spy on handler methods
    viewInstance.handleDropzoneDragOver = jest.fn();
    viewInstance.handleDropzoneDragLeave = jest.fn();
    viewInstance.handleDropzoneDrop = jest.fn();

    const dz = viewInstance.createDropzone(node, 'before');

    // Simulate events and check if handlers are called
    dz.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    expect(viewInstance.handleDropzoneDragOver).toHaveBeenCalled();

    dz.dispatchEvent(new Event('dragleave', { bubbles: true, cancelable: true }));
    expect(viewInstance.handleDropzoneDragLeave).toHaveBeenCalled();

    dz.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    expect(viewInstance.handleDropzoneDrop).toHaveBeenCalled();
  });

  test('handleDropzoneDragOver prevents default and adds active class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const dz = document.createElement('div');
    const event = new Event('dragover', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();

    viewInstance.handleDropzoneDragOver(event, dz);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dz.classList.contains('active')).toBe(true);
  });

  test('handleDropzoneDragLeave removes active class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const dz = document.createElement('div');
    dz.classList.add('active');
    const event = new Event('dragleave', { bubbles: true, cancelable: true });

    viewInstance.handleDropzoneDragLeave(event, dz);

    expect(dz.classList.contains('active')).toBe(false);
  });

  test('handleDropzoneDrop moves node to correct position', () => {
    const viewInstance = new TreeView(container, tree, controller);

    // Setup: drag c1 to after c2
    const targetNode = child2;
    const draggedNode = child1;
    const dz = document.createElement('div');
    dz.classList.add('dropzone');

    // Spy on moveTo
    viewInstance.tree.moveTo = jest.fn();

    // Mock event with dataTransfer
    const event = new Event('drop', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: jest.fn(() => draggedNode.id)
    };

    // Ensure li exists for targetNode
    const li = container.querySelector(`li[data-node-id="${targetNode.id}"]`);
    expect(li).not.toBeNull();

    // Call handleDropzoneDrop
    viewInstance.handleDropzoneDrop(event, targetNode, 'after', dz);

    // Should remove 'active' class
    expect(dz.classList.contains('active')).toBe(false);

    // Should call moveTo with correct args
    expect(viewInstance.tree.moveTo).toHaveBeenCalledWith(
      draggedNode,
      targetNode.parent,
      expect.any(Number)
    );
  });

  test('handleDropOnNode calls moveNode with correct arguments', () => {
    const viewInstance = new TreeView(container, tree, controller);

    const node = root;
    const draggedNode = child1;
    const div = document.createElement('div');
    div.classList.add('item-content-wrapper');

    // Spy on controller.moveNode
    viewInstance.controller.moveNode = jest.fn();

    // Mock event with dataTransfer
    const event = new Event('drop', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: jest.fn(() => draggedNode.id)
    };

    // Call handleDropOnNode
    viewInstance.handleDropOnNode(event, node, div);

    // Should remove 'drag-over' class
    expect(div.classList.contains('drag-over')).toBe(false);

    // Should call moveNode with correct args
    expect(viewInstance.controller.moveNode).toHaveBeenCalledWith(
      draggedNode.id,
      node.id,
      node.children.length
    );
  });

  test('handleDropOnNode does nothing if dropped on self', () => {
    const viewInstance = new TreeView(container, tree, controller);

    const node = root;
    const div = document.createElement('div');
    div.classList.add('item-content-wrapper');

    viewInstance.controller.moveNode = jest.fn();

    const event = new Event('drop', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: jest.fn(() => node.id)
    };

    viewInstance.handleDropOnNode(event, node, div);

    expect(viewInstance.controller.moveNode).not.toHaveBeenCalled();
  });

  test('handleDropOnNode does nothing if dragged node not found', () => {
    const viewInstance = new TreeView(container, tree, controller);

    const node = root;
    const div = document.createElement('div');
    div.classList.add('item-content-wrapper');

    viewInstance.controller.moveNode = jest.fn();

    const event = new Event('drop', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: jest.fn(() => 'nonexistent')
    };

    viewInstance.handleDropOnNode(event, node, div);

    expect(viewInstance.controller.moveNode).not.toHaveBeenCalled();
  });

  test('handleDragStart sets dataTransfer and adds dragging class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const node = child1;
    const div = document.createElement('div');
    // Mock dataTransfer
    const event = new Event('dragstart', { bubbles: true, cancelable: true });
    event.dataTransfer = { setData: jest.fn() };

    viewInstance.handleDragStart(event, node, div);

    expect(event.dataTransfer.setData).toHaveBeenCalledWith('text/plain', node.id);
    expect(div.classList.contains('dragging')).toBe(true);
  });

  test('handleDragEnd removes dragging class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const div = document.createElement('div');
    div.classList.add('dragging');
    const event = new Event('dragend', { bubbles: true, cancelable: true });

    viewInstance.handleDragEnd(event, div);

    expect(div.classList.contains('dragging')).toBe(false);
  });

  test('handleDragOver prevents default and adds drag-over class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const div = document.createElement('div');
    const event = new Event('dragover', { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();

    viewInstance.handleDragOver(event, div);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(div.classList.contains('drag-over')).toBe(true);
  });

  test('handleDragLeave removes drag-over class', () => {
    const viewInstance = new TreeView(container, tree, controller);
    const div = document.createElement('div');
    div.classList.add('drag-over');
    const event = new Event('dragleave', { bubbles: true, cancelable: true });

    viewInstance.handleDragLeave(event, div);

    expect(div.classList.contains('drag-over')).toBe(false);
  });
});