const  TreeViewModule  = require('./treeview');
const { TreeView } = TreeViewModule;

describe('TreeView', () => {
  let container;
  let leafTemplate;
  let nodeTemplate;

  beforeEach(() => {
    container = document.createElement('div');
    container.classList.add('tree-view');
    container.id = 'tree-view-container';

    // Add required template elements as in index.html
    leafTemplate = document.createElement('template');
    leafTemplate.setAttribute('name', 'treeview-leaf-template');

    leafTemplate.innerHTML = `
      <div class="treeview-leaf" data-id="{{id}}">
        <span class="treeview-label">{{label}}</span>
      </div>
    `;
    container.appendChild(leafTemplate);

    nodeTemplate = document.createElement('template');
    nodeTemplate.setAttribute('name', 'treeview-node-template');
    nodeTemplate.innerHTML = `
      <div class="treeview-node" data-id="{{id}}">
        <span class="treeview-label">{{label}}</span>
        <div class="treeview-children"></div>
      </div>
    `;
    container.appendChild(nodeTemplate);

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('should render the tree view correctly', () => {
    const treeData = [
      { id: 1, label: 'Node 1', checked: false },
      { id: 2, label: 'Node 2', checked: true },
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    const nodes = container.querySelectorAll('.treeview-li');
    expect(nodes.length).toBe(2);
    expect(nodes[0].querySelector('.treeview-label').textContent).toBe('Node 1');
    expect(nodes[1].querySelector('.treeview-label').textContent).toBe('Node 2');
  });

  it('should render the leaf nodes from the template', () => {
    const treeData = [
      { id: 1, label: 'Node 1', checked: false },
      { id: 2, label: 'Node 2', checked: true },
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    const leafTemplate = container.querySelector('template[name="treeview-leaf-template"]');
    expect(leafTemplate).not.toBeNull();

    const leafNodes = container.querySelectorAll('.treeview-leaf');
    expect(leafNodes.length).toBe(2);
    expect(leafNodes[0].getAttribute('data-id')).toBe('1');
    expect(leafNodes[1].getAttribute('data-id')).toBe('2');
    expect(leafNodes[0].querySelector('.treeview-label').textContent).toBe('Node 1');
    expect(leafNodes[1].querySelector('.treeview-label').textContent).toBe('Node 2');
  });

  it('should render the branch nodes from the template', () => {
    const treeData = [
      {
        id: 1,
        label: 'Parent',
        checked: false,
        children: [
          { id: 2, label: 'Child', checked: true }
        ]
      }
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.openIds.add(1); // Open the parent node to render children
    treeView.render();


    const branchNodes = container.querySelectorAll('.treeview-node');
    expect(branchNodes.length).toBe(1);
    expect(branchNodes[0].getAttribute('data-id')).toBe('1');
    expect(branchNodes[0].querySelector('.treeview-label').textContent).toBe('Parent');
  });

  it('should set the checkbox based on checked', () => {
    const treeData = [
      { id: 1, label: 'Node 1', checked: false },
      { id: 2, label: 'Node 2', checked: true },
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    const checkboxes = container.querySelectorAll('.treeview-li input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);

    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);
  });

  it('should set the checkbox to false if checked is undefined', () => {
    const treeData = [
      { id: 1, label: 'Node 1' }, // No checked property
      { id: 2, label: 'Node 2', checked: true },
    ];

    
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    const checkboxes = container.querySelectorAll('.treeview-li input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
    expect(checkboxes[0].checked).toBe(false); // Default to false
    expect(checkboxes[1].checked).toBe(true);
  });
    

  it('should update checkbox state and ancestors on click', () => {
    const treeData = [
      {
        id: 1,
        label: 'Parent',
        children: [
          {id: 2, label: 'Child 1', checked: false},
          {id: 3, label: 'Child 2', checked: false}
        ]
      }
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();
    treeView.expandAll(); // Expand all nodes to ensure checkboxes are visible

    // Find the checkbox for Child 1
    const child1Checkbox = container.querySelector('li[data-node-id="2"] input[type="checkbox"]');

    // Find the parent checkbox
    const parentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');

    // Simulate clicking the Child 1 checkbox
    child1Checkbox.click()

    // Re-query elements after potential re-render triggered by the click handler
    const updatedChild1Checkbox = container.querySelector('li[data-node-id="2"] input[type="checkbox"]');
    const updatedParentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');

    // Assert Child 1 state
    expect(updatedChild1Checkbox.checked).toBe(true);

    // Assert Parent state (should be indeterminate)
    expect(updatedParentCheckbox.checked).toBe(false);
    expect(updatedParentCheckbox.indeterminate).toBe(true);

    // Now click Child 2 checkbox
    const child2Checkbox = container.querySelector('li[data-node-id="3"] input[type="checkbox"]');
    child2Checkbox.click();

    // Re-query parent again
    const finalParentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');

    // Assert Parent state (should now be checked)
    expect(finalParentCheckbox.checked).toBe(true);
    expect(finalParentCheckbox.indeterminate).toBe(false);
  });

  it('should update checkbox state to indeterminate for ancestors on click', () =>
  {
    const treeData = [
      {
        id: 1,
        label: 'Parent',
        children: [
          {id: 2, label: 'Child 1', checked: true},
          {id: 3, label: 'Child 2', checked: true}
        ]
      }
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();
    treeView.expandAll(); // Expand all nodes to ensure checkboxes are visible

    // Find the checkbox for Child 1
    const child1Checkbox = container.querySelector('li[data-node-id="2"] input[type="checkbox"]');

    // Find the parent checkbox
    const parentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');
    expect(parentCheckbox.checked).toBe(true);

    // Simulate clicking the Child 1 checkbox
    child1Checkbox.click()

    // Re-query elements after potential re-render triggered by the click handler
    const updatedChild1Checkbox = container.querySelector('li[data-node-id="2"] input[type="checkbox"]');
    const updatedParentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');

    // Assert Child 1 state
    expect(updatedChild1Checkbox.checked).toBe(false);

    // Assert Parent state (should be indeterminate)
    expect(updatedParentCheckbox.checked).toBe(false);
    expect(updatedParentCheckbox.indeterminate).toBe(true);

    // Now click Child 2 checkbox
    const child2Checkbox = container.querySelector('li[data-node-id="3"] input[type="checkbox"]');
    child2Checkbox.click();

    // Re-query parent again
    const finalParentCheckbox = container.querySelector('li[data-node-id="1"] input[type="checkbox"]');

    // Assert Parent state (should now be not checked)
    expect(finalParentCheckbox.checked).toBe(false);
    expect(finalParentCheckbox.indeterminate).toBe(false);
  });

  it('should expand a branch when its arrow is clicked', () => {
    const treeData = [
      {
        id: 1,
        label: 'Parent',
        children: [
          { id: 2, label: 'Child 1' },
          { id: 3, label: 'Child 2' }
        ]
      }
    ];

    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    // The branch should be collapsed initially (children not rendered)
    let parentLi = container.querySelector('li[data-node-id="1"]');
    expect(parentLi).not.toBeNull();
    expect(parentLi.querySelector('ul')).toBeNull();

    // Simulate clicking the arrow to expand
    const arrow = parentLi.querySelector('.tree-arrow');
    expect(arrow).not.toBeNull();
    arrow.click();

    // After click, children should be rendered
    parentLi = container.querySelector('li[data-node-id="1"]'); // re-query after render
    const childrenUl = parentLi.querySelector('ul');
    expect(childrenUl).not.toBeNull();
    const childLis = childrenUl.querySelectorAll('li[data-node-id]');
    expect(childLis.length).toBe(2);
    expect(childLis[0].getAttribute('data-node-id')).toBe('2');
    expect(childLis[1].getAttribute('data-node-id')).toBe('3');
  });

  it('should allow dragging and dropping a leaf node to another branch', () => {
    // Setup tree: Parent1 (with Child1), Parent2 (empty)
    const treeData = [
      {
        id: 1,
        label: 'Parent 1',
        children: [
          { id: 2, label: 'Child 1' }
        ]
      },
      {
        id: 3,
        label: 'Parent 2',
        children: []
      }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.expandAll();
    treeView.render();

    // Simulate dragstart on leaf (Child 1)
    const child1Li = container.querySelector('li[data-node-id="2"]');
    const parent2Li = container.querySelector('li[data-node-id="3"]');
    const parent2DropZone = parent2Li.parentElement.querySelector('.drop-zone.after');

    // Mock DataTransfer for drag events
    const dataTransfer = {
      data: {},
      setData(key, value) { this.data[key] = value; },
      getData(key) { return this.data[key]; }
    };

    // Drag start on Child 1
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    dragStartEvent.dataTransfer = dataTransfer;
    child1Li.dispatchEvent(dragStartEvent);

    // Drop on Parent 2's drop zone (as child)
    const dropEvent = new Event('drop', { bubbles: true });
    dropEvent.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '2'); // Dragged node id
    parent2Li.dispatchEvent(dropEvent);

    // After drop, Parent 2 should have Child 1 as a child
    const parent2Node = treeView.findNodeById(treeView.data, 3);
    expect(parent2Node.children.length).toBe(1);
    expect(parent2Node.children[0].id).toBe(2);
    // Parent 1 should have no children
    const parent1Node = treeView.findNodeById(treeView.data, 1);
    expect(parent1Node.children.length).toBe(0);
  });

  it('should allow dropping a node above the first node in a branch', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    // Drag C above A (A is first)
    const cLi = container.querySelector('li[data-node-id="3"]');
    const aLi = container.querySelector('li[data-node-id="1"]');
    const aDropZoneBefore = aLi.previousSibling; // .drop-zone.before
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    cLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '3');
    aDropZoneBefore.dispatchEvent(drop);
    // C should now be first
    expect(treeView.data[0].id).toBe(3);
    expect(treeView.data[1].id).toBe(1);
    expect(treeView.data[2].id).toBe(2);
  });

  it('should allow dropping a node above a node that is not the first in a branch', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    // Drag C above B (B is not first)
    const cLi = container.querySelector('li[data-node-id="3"]');
    const bLi = container.querySelector('li[data-node-id="2"]');
    const bDropZoneBefore = bLi.previousSibling; // .drop-zone.before
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    cLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '3');
    bDropZoneBefore.dispatchEvent(drop);
    // C should now be before B
    expect(treeView.data[0].id).toBe(1);
    expect(treeView.data[1].id).toBe(3);
    expect(treeView.data[2].id).toBe(2);
  });

  it('should allow dropping a node below a node that is not the last in a branch', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    // Drag A below B (B is not last)
    const aLi = container.querySelector('li[data-node-id="1"]');
    const bLi = container.querySelector('li[data-node-id="2"]');
    const bDropZoneAfter = bLi.nextSibling; // .drop-zone.after
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    aLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '1');
    bDropZoneAfter.dispatchEvent(drop);
    // A should now be after B
    expect(treeView.data[0].id).toBe(2);
    expect(treeView.data[1].id).toBe(1);
    expect(treeView.data[2].id).toBe(3);
  });

  it('should allow dropping a node below the last node in a branch', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    // Drag A below C (C is last)
    const aLi = container.querySelector('li[data-node-id="1"]');
    const cLi = container.querySelector('li[data-node-id="3"]');
    const cDropZoneAfter = cLi.nextSibling; // .drop-zone.after
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    aLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '1');
    cDropZoneAfter.dispatchEvent(drop);
    // A should now be last
    expect(treeView.data[0].id).toBe(2);
    expect(treeView.data[1].id).toBe(3);
    expect(treeView.data[2].id).toBe(1);
  });

  it('should not allow dropping a branch onto one of its descendants', () => {
    // Tree: A (id:1) > B (id:2) > C (id:3)
    const treeData = [
      {
        id: 1,
        label: 'A',
        children: [
          {
            id: 2,
            label: 'B',
            children: [
              { id: 3, label: 'C' }
            ]
          }
        ]
      }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.expandAll();
    treeView.render();

    // Try to drag A (id:1) and drop it onto C (id:3) as a child
    const aLi = container.querySelector('li[data-node-id="1"]');
    const cLi = container.querySelector('li[data-node-id="3"]');
    const cDropZoneAfter = cLi.nextSibling; // .drop-zone.after
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    aLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '1');
    cDropZoneAfter.dispatchEvent(drop);
    // The tree structure should remain unchanged
    expect(treeView.data[0].id).toBe(1);
    expect(treeView.data[0].children[0].id).toBe(2);
    expect(treeView.data[0].children[0].children[0].id).toBe(3);
  });

  it('should add and remove drag-over/dragging classes on drag events', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();

    const aLi = container.querySelector('li[data-node-id="1"]');

    // Simulate dragover
    const dragOverEvent = new Event('dragover', { bubbles: true });
    aLi.dispatchEvent(dragOverEvent);
    expect(aLi.classList.contains('drag-over')).toBe(true);

    // Simulate dragleave
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    aLi.dispatchEvent(dragLeaveEvent);
    expect(aLi.classList.contains('drag-over')).toBe(false);

    // Simulate dragstart
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    dragStartEvent.dataTransfer = { setData: jest.fn() };
    aLi.dispatchEvent(dragStartEvent);
    expect(aLi.classList.contains('dragging')).toBe(true);

    // Simulate dragend
    const dragEndEvent = new Event('dragend', { bubbles: true });
    aLi.dispatchEvent(dragEndEvent);
    expect(aLi.classList.contains('dragging')).toBe(false);
  });

  it('should throw an error if container element is not found', () => {
    expect(() => new TreeView('nonexistent-id', [])).toThrow('Container element with ID "nonexistent-id" not found.');
  });


  it('should not render children if node.children is undefined', () => {
    const treeData = [{ id: 1, label: 'Node 1' }];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();
    const nodeLi = container.querySelector('li[data-node-id="1"]');
    expect(nodeLi).not.toBeNull();
    expect(nodeLi.querySelector('ul')).toBeNull();
  });

  it('should fallback to default label rendering if template is missing', () => {
    // Remove templates
    container.querySelectorAll('template').forEach(t => t.remove());
    const treeData = [{ id: 1, label: 'Node 1' }];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();
    const labelSpan = container.querySelector('li[data-node-id="1"] span');
    expect(labelSpan.textContent).toBe('Node 1');
  });

  it('should not allow moving a node to itself', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' }
    ];
    const treeView = new TreeView(container.id, treeData);
    treeView.render();
    // Simulate drag and drop of node 1 onto itself
    const aLi = container.querySelector('li[data-node-id="1"]');
    const dataTransfer = { data: {}, setData(k,v){this.data[k]=v;}, getData(k){return this.data[k];} };
    const dragStart = new Event('dragstart', { bubbles: true });
    dragStart.dataTransfer = dataTransfer;
    aLi.dispatchEvent(dragStart);
    const drop = new Event('drop', { bubbles: true });
    drop.dataTransfer = dataTransfer;
    dataTransfer.setData('text/plain', '1');
    aLi.dispatchEvent(drop);
    // The order should remain unchanged
    expect(treeView.data[0].id).toBe(1);
    expect(treeView.data[1].id).toBe(2);
  });

  it('should revert move if insertion fails and log error', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' }
    ];
    const treeView = new TreeView(container.id, treeData);
    // Patch _insertNodeRelativeToTarget to always fail
    treeView._insertNodeRelativeToTarget = () => ({ success: false });
    // Patch _findAndRemoveNode to simulate removal
    treeView._findAndRemoveNode = () => ({ removedNode: { id: 1, label: 'A' }, parentArray: treeView.data, originalIndex: 0 });
    // Patch parentMap
    treeView.parentMap.set(1, null);
    // Spy on console.error
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    treeView.moveNode(1, 999, 'before');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to insert node'));
    errorSpy.mockRestore();
  });

  it('should log error if moveNode cannot find or remove dragged node', () => {
    const treeData = [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' }
    ];
    const treeView = new TreeView(container.id, treeData);
    // Patch _findAndRemoveNode to return null
    treeView._findAndRemoveNode = () => null;
    // Spy on console.error
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    treeView.moveNode(1, 2, 'before');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to find or remove dragged node'));
    errorSpy.mockRestore();
  });
});