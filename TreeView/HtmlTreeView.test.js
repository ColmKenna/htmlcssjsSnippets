const { describe, test, expect, beforeEach, beforeAll } = require('@jest/globals');
const { TreeNode, Tree } = require('./TreeView.js');
const { HtmlTreeView } = require('./HtmlTreeView.js');

// Mock DOM for testing
document.body.innerHTML = `
  <div id="tree-container"></div>
`;

// Define DragEvent mock globally for the test file if not present
if (typeof global.DragEvent === 'undefined') {
    global.DragEvent = class DragEvent extends Event {
        constructor(type, eventInitDict) {
            super(type, eventInitDict);
            this.dataTransfer = eventInitDict?.dataTransfer || {
                data: {},
                setData: function(format, data) { this.data[format] = data; },
                getData: function(format) { return this.data[format]; },
                clearData: function(format) { 
                    if (format) delete this.data[format]; else this.data = {};
                },
                dropEffect: 'none',
                effectAllowed: 'all',
                files: [],
                items: [],
                types: [],
            };
        }
    };
}

describe('HtmlTreeView', () => {
    let tree;

    beforeEach(() => {
        document.body.innerHTML = `<div id="tree-container"></div>`;

        const root = new TreeNode({
            id: "1",
            label: "Project Alpha",
            checked: false,
            expanded: true,
        });

        const root2 = new TreeNode({
            id: "2",
            label: "Project Beta",
            checked: false,
            expanded: true,
        });

        // Add children to root
        const child1 = new TreeNode({
            id: "1.1",
            label: "Child 1",
            checked: false,
            expanded: true, // This node will remain expanded for other tests
        });
        const child2 = new TreeNode({
            id: "1.2",
            label: "Child 2", // This node will be set to collapsed for a specific test
            checked: false,
            expanded: false, // Set to false for the new test
        });
        root.addChild(child1);
        root.addChild(child2);

        // Add children to root2
        const child3 = new TreeNode({
            id: "2.1",
            label: "Child 3",
            checked: false,
            expanded: true,
        });
        root2.addChild(child3);

        // Add grandchildren
        child1.addChild(
            new TreeNode({
                id: "1.1.1",
                label: "Grandchild 1.1",
                checked: false,
                expanded: true,
                indeterminate: true, // Example of intermediate state
            })
        );
        child1.addChild(
            new TreeNode({
                id: "1.1.2",
                label: "Grandchild 1.2",
                checked: false,
                expanded: true,
            })
        );
        // child2 needs children for the collapsed parent test
        child2.addChild( 
            new TreeNode({
                id: "1.2.1",
                label: "Grandchild 2.1",
                checked: false,
                expanded: true, // Grandchild's expanded state doesn't affect parent's icon if parent is collapsed
            })
        );
        child2.addChild(
            new TreeNode({
                id: "1.2.2",
                label: "Grandchild 2.2",
                checked: false,
                expanded: true,
            })
        );

        // Add grandchildren to root2's child
        child3.addChild(
            new TreeNode({
                id: "2.1.1",
                label: "Grandchild 3.1",
                checked: false,
                expanded: true,
            })
        );

        // Create tree and add roots
        tree = new Tree();
        tree.addRoot(root);
        tree.addRoot(root2);
    });

    /*
      <li data-node-id="1.1.1"><div class="dropzone before"></div><div class="item-content-wrapper" draggable="true"><span class="toggle-icon placeholder"><i class="fas fa-circle icon-transparent"></i></span><label class="form-checkbox"><input class="form-check-input" type="checkbox" id="chk_1.1.1" name="checkbox-1.1.1" value="true" data-node-id="1.1.1"><span class="custom-checkbox" data-node-id="1.1.1"></span></label><span>Grandchild 1.1</span></div><div class="dropzone after"></div></li>
    */

    test('li elements should have the correct data-node-id', () => {

        const htmlTreeView = new HtmlTreeView('tree-container', tree);
        const child1 = tree.findNodeById("1.1.1");
        const child2 = tree.findNodeById("1.1.2");
        const child3 = tree.findNodeById("2.1.1");

        // should be an li element with data-node-id="1.1.1"

        const child1Element = document.querySelector(`li[data-node-id="${child1.id}"]`);
        const child2Element = document.querySelector(`li[data-node-id="${child2.id}"]`);
        const child3Element = document.querySelector(`li[data-node-id="${child3.id}"]`);

        expect(child1Element).not.toBeNull();
        expect(child1Element.dataset.nodeId).toBe(child1.id);
        expect(child2Element).not.toBeNull();
        expect(child2Element.dataset.nodeId).toBe(child2.id);
        expect(child3Element).not.toBeNull();
        expect(child3Element.dataset.nodeId).toBe(child3.id);
    });

    test('li elements should have drop zones before and after', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);
        const child1 = tree.findNodeById("1.1.1");
        const child2 = tree.findNodeById("1.1.2");
        const child3 = tree.findNodeById("2.1.1");

        // Check if the drop zones are present
        const child1Element = document.querySelector(`li[data-node-id="${child1.id}"]`);
        const child2Element = document.querySelector(`li[data-node-id="${child2.id}"]`);
        const child3Element = document.querySelector(`li[data-node-id="${child3.id}"]`);

        // it should have a dropzone before should be first child
        // get the first child of the li element
        const dropzoneBefore1 = child1Element.firstChild;
        expect(dropzoneBefore1.classList.contains('dropzone')).toBe(true);
        expect(dropzoneBefore1.classList.contains('before')).toBe(true);

        // get the last child of the li element
        const dropzoneAfter1 = child1Element.lastChild;
        expect(dropzoneAfter1.classList.contains('dropzone')).toBe(true);
        expect(dropzoneAfter1.classList.contains('after')).toBe(true);

        // it should have a dropzone before should be first child
        // get the first child of the li element
        const dropzoneBefore2 = child2Element.firstChild;
        expect(dropzoneBefore2.classList.contains('dropzone')).toBe(true);
        expect(dropzoneBefore2.classList.contains('before')).toBe(true);

        // get the last child of the li element
        const dropzoneAfter2 = child2Element.lastChild;
        expect(dropzoneAfter2.classList.contains('dropzone')).toBe(true);
        expect(dropzoneAfter2.classList.contains('after')).toBe(true);

        // it should have a dropzone before should be first child
        // get the first child of the li element
        const dropzoneBefore3 = child3Element.firstChild;
        expect(dropzoneBefore3.classList.contains('dropzone')).toBe(true);
        expect(dropzoneBefore3.classList.contains('before')).toBe(true);

        // get the last child of the li element
        const dropzoneAfter3 = child3Element.lastChild
        expect(dropzoneAfter3.classList.contains('dropzone')).toBe(true);
        expect(dropzoneAfter3.classList.contains('after')).toBe(true);

    });

    test('toggle icons should be correctly rendered based on children and expanded state', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);

        // Test case 1: Node with children, expanded (e.g., "1.1" which has children "1.1.1", "1.1.2")
        const parentNodeId = "1.1";
        const parentNodeElement = document.querySelector(`li[data-node-id="${parentNodeId}"]`);
        const parentToggleIcon = parentNodeElement.querySelector('.toggle-icon > .fas');
        expect(parentToggleIcon).not.toBeNull();
        // Node "1.1" is expanded by default in test data
        expect(parentToggleIcon.classList.contains('fa-chevron-down')).toBe(true);
        expect(parentToggleIcon.classList.contains('fa-chevron-right')).toBe(false);
        expect(parentNodeElement.getAttribute('aria-expanded')).toBe('true');


        // Test case 2: Leaf node (e.g., "1.1.1")
        const leafNodeId = "1.1.1";
        const leafNodeElement = document.querySelector(`li[data-node-id="${leafNodeId}"]`);
        const leafToggleIcon = leafNodeElement.querySelector('.toggle-icon > .fas');
        expect(leafToggleIcon).not.toBeNull();
        expect(leafToggleIcon.classList.contains('fa-circle')).toBe(true);
        expect(leafToggleIcon.classList.contains('icon-transparent')).toBe(true);
        // Leaf nodes might not have aria-expanded, or it could be false.
        // Depending on implementation, we might not set aria-expanded or set it to false.
        // For now, let's assume it's not set or explicitly false if it's a leaf.
        // The current implementation adds a placeholder span, so aria-expanded might not be relevant here.

        // Test case 3: Another parent node, expanded (e.g., "2.1" which has child "2.1.1")
        const anotherParentNodeId = "2.1";
        const anotherParentNodeElement = document.querySelector(`li[data-node-id="${anotherParentNodeId}"]`);
        const anotherParentToggleIcon = anotherParentNodeElement.querySelector('.toggle-icon > .fas');
        expect(anotherParentToggleIcon).not.toBeNull();
        expect(anotherParentToggleIcon.classList.contains('fa-chevron-down')).toBe(true);
        expect(anotherParentNodeElement.getAttribute('aria-expanded')).toBe('true');


        // Test case 4: Another leaf node (e.g., "1.2.1")
        const anotherLeafNodeId = "1.2.1";
        const anotherLeafNodeElement = document.querySelector(`li[data-node-id="${anotherLeafNodeId}"]`);
        const anotherLeafToggleIcon = anotherLeafNodeElement.querySelector('.toggle-icon > .fas');
        expect(anotherLeafToggleIcon).not.toBeNull();
        expect(anotherLeafToggleIcon.classList.contains('fa-circle')).toBe(true);
        expect(anotherLeafToggleIcon.classList.contains('icon-transparent')).toBe(true);
    });

    test('should correctly render a collapsed parent node with children', () => {
        // Node "1.2" is set to expanded: false in beforeEach and has children "1.2.1", "1.2.2"
        const htmlTreeView = new HtmlTreeView('tree-container', tree);
        const collapsedParentNodeId = "1.2";
        const collapsedParentNodeElement = document.querySelector(`li[data-node-id="${collapsedParentNodeId}"]`);
        
        expect(collapsedParentNodeElement).not.toBeNull();

        // Check toggle icon
        const toggleIcon = collapsedParentNodeElement.querySelector('.toggle-icon > .fas');
        expect(toggleIcon).not.toBeNull();
        expect(toggleIcon.classList.contains('fa-chevron-right')).toBe(true); // Should be right-chevron for collapsed
        expect(toggleIcon.classList.contains('fa-chevron-down')).toBe(false);

        // Check aria-expanded attribute
        expect(collapsedParentNodeElement.getAttribute('aria-expanded')).toBe('false');

        // Check children ul class
        const childrenUl = collapsedParentNodeElement.querySelector('ul.children-ul');
        expect(childrenUl).not.toBeNull();
        expect(childrenUl.classList.contains('collapsed')).toBe(true);
        expect(childrenUl.classList.contains('expanded')).toBe(false);
    });

    test('nodes with children should have a child ul list with correct children', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);

        // Test case 1: Node with children (e.g., "1.1" which has children "1.1.1", "1.1.2")
        const parentNodeId = "1.1";
        const parentNodeElement = document.querySelector(`li[data-node-id="${parentNodeId}"]`);
        const childUlElement = parentNodeElement.querySelector('ul');
        expect(childUlElement).not.toBeNull();
        const childNodes = Array.from(childUlElement.children).map(li => li.dataset.nodeId);
        expect(childNodes).toEqual(["1.1.1", "1.1.2"]);

        // Test case 2: Another node with children (e.g., "2.1" which has child "2.1.1")
        const anotherParentNodeId = "2.1";
        const anotherParentNodeElement = document.querySelector(`li[data-node-id="${anotherParentNodeId}"]`);
        const anotherChildUlElement = anotherParentNodeElement.querySelector('ul');
        expect(anotherChildUlElement).not.toBeNull();
        const anotherChildNodes = Array.from(anotherChildUlElement.children).map(li => li.dataset.nodeId);
        expect(anotherChildNodes).toEqual(["2.1.1"]);
    });

    test('checkboxes should be correctly rendered and have the right attributes', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);

        // Test case 1: Leaf node (e.g., "1.1.1")
        const leafNodeId = "1.1.1";
        const leafNodeElement = document.querySelector(`li[data-node-id="${leafNodeId}"]`);
        const checkbox = leafNodeElement.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
        expect(checkbox.id).toBe(`chk_${leafNodeId}`);
        expect(checkbox.name).toBe(`checkbox-${leafNodeId}`);
        expect(checkbox.value).toBe("true");
        expect(checkbox.dataset.nodeId).toBe(leafNodeId);

        // Test case 2: Another leaf node (e.g., "2.1.1")
        const anotherLeafNodeId = "2.1.1";
        const anotherLeafNodeElement = document.querySelector(`li[data-node-id="${anotherLeafNodeId}"]`);
        const anotherCheckbox = anotherLeafNodeElement.querySelector('input[type="checkbox"]');
        expect(anotherCheckbox).not.toBeNull();
        expect(anotherCheckbox.id).toBe(`chk_${anotherLeafNodeId}`);
        expect(anotherCheckbox.name).toBe(`checkbox-${anotherLeafNodeId}`);
        expect(anotherCheckbox.value).toBe("true");
        expect(anotherCheckbox.dataset.nodeId).toBe(anotherLeafNodeId);
    });

    test('updateCheckboxState should update the checkbox state correctly', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);

        // Test case 1: Leaf node (e.g., "1.1.1")
        const leafNodeId = "1.1.1";
        const leafNode = tree.findNodeById(leafNodeId); // Get the actual node instance
        const leafNodeElement = document.querySelector(`li[data-node-id="${leafNodeId}"]`);
        const checkbox = leafNodeElement.querySelector('input[type="checkbox"]');
        
        expect(checkbox).not.toBeNull();
        expect(checkbox.checked).toBe(false); // Initially unchecked
        expect(leafNode.checked).toBe(false); // Node state should also be initially unchecked

        // Spy on the setChecked method of the specific node instance
        const setCheckedSpy = jest.spyOn(leafNode, 'setChecked');

        // Simulate a click to check the checkbox
        checkbox.click(); 
        
        expect(checkbox.checked).toBe(true); // Should be checked now
        
        // Verify that node.setChecked was called with the correct arguments
        expect(setCheckedSpy).toHaveBeenCalledTimes(1);
        expect(setCheckedSpy).toHaveBeenCalledWith(true, htmlTreeView.updateCheckboxState);

        // Check the actual node state (assuming setChecked updates it directly or via callback)
        // This part depends on whether setChecked itself updates the node's 'checked' property
        // or if it's solely done through the callback.
        // Given the current TreeView.js, setChecked updates the node's property.
        expect(leafNode.checked).toBe(true); // Node state should also be updated

        // Restore the original method
        setCheckedSpy.mockRestore();
    });

    test('handleToggleClick should be called when a toggle icon is clicked', () => {
        const htmlTreeView = new HtmlTreeView('tree-container', tree);
        const parentNodeId = "1.1"; // A node with children
        const parentNode = tree.findNodeById(parentNodeId);
        const parentNodeElement = document.querySelector(`li[data-node-id="${parentNodeId}"]`);
        const toggleElement = parentNodeElement.querySelector('.toggle-icon');
        const childrenUlElement = parentNodeElement.querySelector('ul.children-ul');
        const iconElement = toggleElement.querySelector('i.fas');

        expect(toggleElement).not.toBeNull();

        // Spy on the handleToggleClick method of the specific htmlTreeView instance
        const handleToggleClickSpy = jest.spyOn(htmlTreeView, 'handleToggleClick');

        // Simulate a click on the toggle element
        toggleElement.click();

        // Assert that handleToggleClick was called
        expect(handleToggleClickSpy).toHaveBeenCalledTimes(1);
        
        // Optionally, assert that it was called with the correct arguments.
        // Note: The event object 'e' will be a real event object, so direct comparison might be tricky.
        // We can check for the other arguments.
        expect(handleToggleClickSpy).toHaveBeenCalledWith(
            expect.any(Event), // The event object
            parentNode,        // The TreeNode instance
            parentNodeElement, // The li element
            childrenUlElement, // The children ul element
            iconElement        // The icon element (i)
        );

        // Restore the original method
        handleToggleClickSpy.mockRestore();
    });

    describe('handleToggleClick', () => {
        let htmlTreeView;
        let node;
        let li;
        let childrenUl;
        let icon;
        let mockEvent;

        beforeEach(() => {
            // Re-initialize htmlTreeView for each test in this describe block if needed,
            // or use the one from the outer scope if its state is managed by outer beforeEach.
            // For simplicity, we'll create a new one to ensure a clean state for these specific tests.
            document.body.innerHTML = `<div id="tree-container-toggle"></div>`; // Use a different container or ensure it's clean
            
            // Create a simplified tree for toggle tests or use the existing one
            const rootNode = new TreeNode({ id: "rootToggle", label: "Root Toggle", expanded: true });
            const childNode = new TreeNode({ id: "childToggle", label: "Child Toggle", expanded: false });
            rootNode.addChild(childNode);
            const testTree = new Tree();
            testTree.addRoot(rootNode);

            htmlTreeView = new HtmlTreeView('tree-container-toggle', testTree);
            
            // Setup for a node that can be toggled (e.g., rootNode which has childNode)
            node = testTree.findNodeById("rootToggle"); // This node is initially expanded

            // Create mock DOM elements
            li = document.createElement('li');
            childrenUl = document.createElement('ul');
            icon = document.createElement('i');
            icon.classList.add('fas'); // Common class for Font Awesome icons

            mockEvent = {
                stopPropagation: jest.fn()
            };
        });

        test('should expand a collapsed node and update UI', () => {
            // Ensure node is collapsed for this test
            node.expanded = false; 
            li.setAttribute('aria-expanded', 'false');
            childrenUl.classList.add('collapsed');
            icon.classList.add('fa-chevron-right');

            htmlTreeView.handleToggleClick(mockEvent, node, li, childrenUl, icon);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(node.expanded).toBe(true);
            expect(li.getAttribute('aria-expanded')).toBe('true');
            expect(childrenUl.classList.contains('expanded')).toBe(true);
            expect(childrenUl.classList.contains('collapsed')).toBe(false);
            expect(icon.classList.contains('fa-chevron-down')).toBe(true);
            expect(icon.classList.contains('fa-chevron-right')).toBe(false);
        });

        test('should collapse an expanded node and update UI', () => {
            // Ensure node is expanded for this test (which it is by default from setup)
            node.expanded = true;
            li.setAttribute('aria-expanded', 'true');
            childrenUl.classList.add('expanded');
            icon.classList.add('fa-chevron-down');

            htmlTreeView.handleToggleClick(mockEvent, node, li, childrenUl, icon);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(node.expanded).toBe(false);
            expect(li.getAttribute('aria-expanded')).toBe('false');
            expect(childrenUl.classList.contains('collapsed')).toBe(true);
            expect(childrenUl.classList.contains('expanded')).toBe(false);
            expect(icon.classList.contains('fa-chevron-right')).toBe(true);
            expect(icon.classList.contains('fa-chevron-down')).toBe(false);
        });
    });

    describe('handleDropOnNode', () => {
        let htmlTreeView;
        let treeInstance; // Renamed to avoid conflict with global 'tree' in outer scope
        let draggedNode;
        let targetNode;
        let mockEvent;
        let divElement;

        beforeEach(() => {
            document.body.innerHTML = `<div id="tree-container-handle-drop"></div>`;
            
            draggedNode = new TreeNode({ id: "dragged", label: "Dragged Node" });
            targetNode = new TreeNode({ id: "target", label: "Target Node" });
            const childOfTarget = new TreeNode({ id: "targetChild", label: "Target Child" });
            targetNode.addChild(childOfTarget); // targetNode has one child

            treeInstance = new Tree();
            treeInstance.addRoot(draggedNode);
            treeInstance.addRoot(targetNode);

            htmlTreeView = new HtmlTreeView('tree-container-handle-drop', treeInstance);
            
            divElement = document.createElement('div');
            divElement.classList.add("drag-over"); // Simulate state before drop

            // Mock the event
            // Note: The global DragEvent mock is used, but we override dataTransfer.getData for specific tests.
            // We also mock preventDefault for spying.
            mockEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer: { // This will be part of eventInitDict and used by the mock DragEvent constructor
                    getData: jest.fn().mockReturnValue(draggedNode.id)
                }
            });
            // Ensure preventDefault is a Jest mock function for this specific instance
            mockEvent.preventDefault = jest.fn();
        });

        test('should call tree.moveTo with correct parameters and remove drag-over class', () => {
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');

            htmlTreeView.handleDropOnNode(mockEvent, targetNode, divElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(divElement.classList.contains("drag-over")).toBe(false);
            expect(moveToSpy).toHaveBeenCalledTimes(1);
            expect(moveToSpy).toHaveBeenCalledWith(
                draggedNode,
                targetNode,
                1, // After move, draggedNode is appended as the second child (index 1)appending
                htmlTreeView.moveHtmlElement
            );

            moveToSpy.mockRestore();
        });

        test('should not call tree.moveTo if draggedId is the same as target node id', () => {
            // Adjust mockEvent's dataTransfer.getData for this specific test case
            // The DragEvent constructor uses eventInitDict.dataTransfer, so we modify the instance's dataTransfer
            mockEvent.dataTransfer.getData = jest.fn().mockReturnValue(targetNode.id);
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');

            htmlTreeView.handleDropOnNode(mockEvent, targetNode, divElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1); // preventDefault is still called
            expect(divElement.classList.contains("drag-over")).toBe(false); // class is still removed
            expect(moveToSpy).not.toHaveBeenCalled();
            
            moveToSpy.mockRestore();
        });

        test('should not call tree.moveTo if draggedNode is not found', () => {
            // Adjust mockEvent's dataTransfer.getData for this specific test case
            mockEvent.dataTransfer.getData = jest.fn().mockReturnValue("non-existent-id");
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');

            htmlTreeView.handleDropOnNode(mockEvent, targetNode, divElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(divElement.classList.contains("drag-over")).toBe(false);
            expect(moveToSpy).not.toHaveBeenCalled();

            moveToSpy.mockRestore();
        });
    });

    describe('handleDropzoneDrop', () => {
        let htmlTreeView;
        let treeInstance;
        let draggedNode;
        let targetNode;
        let parentOfTargetNode;
        let siblingNode;
        let mockEvent;
        let dropzoneElement;
        let mockLi;
        let mockUl;

        beforeEach(() => {
            document.body.innerHTML = `<div id="tree-container-handle-dropzone"></div>`;
            
            draggedNode = new TreeNode({ id: "dragged", label: "Dragged Node" });
            targetNode = new TreeNode({ id: "target", label: "Target Node" });
            siblingNode = new TreeNode({ id: "sibling", label: "Sibling Node" });
            parentOfTargetNode = new TreeNode({ id: "parent", label: "Parent Node" });

            parentOfTargetNode.addChild(siblingNode);
            parentOfTargetNode.addChild(targetNode);

            treeInstance = new Tree();
            treeInstance.addRoot(draggedNode);
            treeInstance.addRoot(parentOfTargetNode);

            htmlTreeView = new HtmlTreeView('tree-container-handle-dropzone', treeInstance);
            
            dropzoneElement = document.createElement('div');
            dropzoneElement.classList.add("dropzone", "active");

            mockLi = document.createElement('li');
            mockLi.setAttribute('data-node-id', targetNode.id);
            const mockSiblingLi = document.createElement('li');
            mockSiblingLi.setAttribute('data-node-id', siblingNode.id);

            mockUl = document.createElement('ul');
            mockUl.appendChild(mockSiblingLi);
            mockUl.appendChild(mockLi);

            // Append mockUl to the container so that parentNodeElement.parentElement exists
            const container = document.getElementById('tree-container-handle-dropzone');
            container.appendChild(mockUl);

            jest.spyOn(htmlTreeView, 'queryByNodeId').mockReturnValue(mockLi);
            
            mockEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer: {
                    getData: jest.fn().mockReturnValue(draggedNode.id)
                }
            });
            mockEvent.preventDefault = jest.fn();
        });

        afterEach(() => {
            if (htmlTreeView.queryByNodeId.mockRestore) {
                htmlTreeView.queryByNodeId.mockRestore();
            }
        });

        test('should call tree.moveTo with correct parameters for "after" position', () => {
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');
            const moveHtmlElementMock = jest.fn(); // mock moveHtmlElement
            htmlTreeView.moveHtmlElement = moveHtmlElementMock;
        
            jest.spyOn(htmlTreeView, 'queryByNodeId').mockReturnValue(mockLi);
        
            const expectedIndex = Array.from(mockUl.children).indexOf(mockLi) + 1;
        
            htmlTreeView.handleDropzoneDrop(mockEvent, targetNode, 'after', dropzoneElement);
        
            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(dropzoneElement.classList.contains("active")).toBe(false);
            expect(moveToSpy).toHaveBeenCalledTimes(1);
            expect(moveToSpy).toHaveBeenCalledWith(
                draggedNode,
                parentOfTargetNode,
                expectedIndex,
                moveHtmlElementMock // make sure it's your mocked function
            );
        
            moveToSpy.mockRestore();
            htmlTreeView.queryByNodeId.mockRestore();
        });

        test('should call tree.moveTo with correct parameters for "before" position', () => {
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');
            const moveHtmlElementMock = jest.fn(); // mock moveHtmlElement
            htmlTreeView.moveHtmlElement = moveHtmlElementMock;
        
            jest.spyOn(htmlTreeView, 'queryByNodeId').mockReturnValue(mockLi);
        
            const expectedIndex = Array.from(mockUl.children).indexOf(mockLi); // No +1 for "before" position
        
            htmlTreeView.handleDropzoneDrop(mockEvent, targetNode, 'before', dropzoneElement);
        
            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(dropzoneElement.classList.contains("active")).toBe(false);
            expect(moveToSpy).toHaveBeenCalledTimes(1);
            expect(moveToSpy).toHaveBeenCalledWith(
                draggedNode,
                parentOfTargetNode,
                expectedIndex,
                moveHtmlElementMock
            );
        
            moveToSpy.mockRestore();
            htmlTreeView.queryByNodeId.mockRestore();
        });

        test('should not call tree.moveTo if draggedId is the same as target node id', () => {
            mockEvent.dataTransfer.getData = jest.fn().mockReturnValue(targetNode.id);
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');

            htmlTreeView.handleDropzoneDrop(mockEvent, targetNode, 'before', dropzoneElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(dropzoneElement.classList.contains("active")).toBe(false);
            expect(moveToSpy).not.toHaveBeenCalled();
            moveToSpy.mockRestore();
        });

        test('should not call tree.moveTo if draggedNode is not found', () => {
            mockEvent.dataTransfer.getData = jest.fn().mockReturnValue("non-existent-id");
            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');

            htmlTreeView.handleDropzoneDrop(mockEvent, targetNode, 'before', dropzoneElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(dropzoneElement.classList.contains("active")).toBe(false);
            expect(moveToSpy).not.toHaveBeenCalled();
            moveToSpy.mockRestore();
        });

        test('should handle case where targetNode has no parent (is a root)', () => {
            targetNode.parent = null; 
            treeInstance.roots = [draggedNode, targetNode, siblingNode];

            const moveToSpy = jest.spyOn(htmlTreeView.tree, 'moveTo');
            const expectedIndex = Array.from(mockUl.children).indexOf(mockLi);

            htmlTreeView.handleDropzoneDrop(mockEvent, targetNode, 'before', dropzoneElement);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
            expect(dropzoneElement.classList.contains("active")).toBe(false);
            expect(moveToSpy).toHaveBeenCalledTimes(1);
            expect(moveToSpy).toHaveBeenCalledWith(
                draggedNode,
                null,
                expectedIndex,
                htmlTreeView.moveHtmlElement
            );
            moveToSpy.mockRestore();
        });
    });

    describe('createDropzone', () => {
        let htmlTreeView;
        let mockNode;

        beforeEach(() => {
            document.body.innerHTML = `<div id="tree-container-dropzone"></div>`;
            const singleNode = new TreeNode({ id: "dzNode", label: "Dropzone Test Node" });
            const testTree = new Tree();
            testTree.addRoot(singleNode);
            htmlTreeView = new HtmlTreeView('tree-container-dropzone', testTree);
            mockNode = testTree.findNodeById("dzNode");
        });

        test('should add dragover event listener calling handleDropzoneDragOver', () => {
            const dropzoneElement = htmlTreeView.createDropzone(mockNode, 'before');
            const handleDropzoneDragOverSpy = jest.spyOn(htmlTreeView, 'handleDropzoneDragOver');
            
            const mockDragEvent = new DragEvent('dragover', { bubbles: true, cancelable: true });
            dropzoneElement.dispatchEvent(mockDragEvent);

            expect(handleDropzoneDragOverSpy).toHaveBeenCalledTimes(1);
            expect(handleDropzoneDragOverSpy).toHaveBeenCalledWith(expect.any(DragEvent), dropzoneElement);
            handleDropzoneDragOverSpy.mockRestore();
        });

        test('should add dragleave event listener calling handleDropzoneDragLeave', () => {
            const dropzoneElement = htmlTreeView.createDropzone(mockNode, 'after');
            const handleDropzoneDragLeaveSpy = jest.spyOn(htmlTreeView, 'handleDropzoneDragLeave');

            const mockDragEvent = new DragEvent('dragleave', { bubbles: true, cancelable: true });
            dropzoneElement.dispatchEvent(mockDragEvent);

            expect(handleDropzoneDragLeaveSpy).toHaveBeenCalledTimes(1);
            expect(handleDropzoneDragLeaveSpy).toHaveBeenCalledWith(expect.any(DragEvent), dropzoneElement);
            handleDropzoneDragLeaveSpy.mockRestore();
        });

        test('should add drop event listener calling handleDropzoneDrop', () => {
            const dropzoneElement = htmlTreeView.createDropzone(mockNode, 'before');
            const handleDropzoneDropSpy = jest.spyOn(htmlTreeView, 'handleDropzoneDrop');

            const mockDropEvent = new DragEvent('drop', { bubbles: true, cancelable: true });
            Object.defineProperty(mockDropEvent, 'dataTransfer', {
                value: {
                    getData: jest.fn().mockReturnValue('some-dragged-node-id')
                }
            });
            
            const mockLi = document.createElement('li');
            mockLi.setAttribute('data-node-id', mockNode.id);
            const mockUl = document.createElement('ul');
            mockUl.appendChild(mockLi);
            htmlTreeView.container.appendChild(mockUl);

            jest.spyOn(htmlTreeView, 'queryByNodeId').mockReturnValue(mockLi);

            dropzoneElement.dispatchEvent(mockDropEvent);

            expect(handleDropzoneDropSpy).toHaveBeenCalledTimes(1);
            expect(handleDropzoneDropSpy).toHaveBeenCalledWith(expect.any(DragEvent), mockNode, 'before', dropzoneElement);
            
            handleDropzoneDropSpy.mockRestore();
            htmlTreeView.queryByNodeId.mockRestore();
        });
    });

    describe('addDragAndDropHandlers', () => {
        let htmlTreeView;
        let mockNode;
        let divElement;

        beforeEach(() => {
            document.body.innerHTML = `<div id="tree-container-dragdrop"></div>`;
            const dndNode = new TreeNode({ id: "dndNode", label: "DragDrop Test Node" });
            const testTree = new Tree();
            testTree.addRoot(dndNode);
            htmlTreeView = new HtmlTreeView('tree-container-dragdrop', testTree);
            mockNode = testTree.findNodeById("dndNode");
            divElement = document.createElement('div');
        });

        test('should set draggable attribute to true', () => {
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);
            expect(divElement.getAttribute('draggable')).toBe('true');
        });

        test('should add dragstart listener calling handleDragStart', () => {
            const handleDragStartSpy = jest.spyOn(htmlTreeView, 'handleDragStart');
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);
            
            const mockEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true });
            divElement.dispatchEvent(mockEvent);

            expect(handleDragStartSpy).toHaveBeenCalledTimes(1);
            expect(handleDragStartSpy).toHaveBeenCalledWith(mockEvent, mockNode, divElement);
            handleDragStartSpy.mockRestore();
        });

        test('should add dragend listener calling handleDragEnd', () => {
            const handleDragEndSpy = jest.spyOn(htmlTreeView, 'handleDragEnd');
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);

            const mockEvent = new DragEvent('dragend', { bubbles: true, cancelable: true });
            divElement.dispatchEvent(mockEvent);

            expect(handleDragEndSpy).toHaveBeenCalledTimes(1);
            expect(handleDragEndSpy).toHaveBeenCalledWith(mockEvent, divElement);
            handleDragEndSpy.mockRestore();
        });

        test('should add dragover listener calling handleDragOver', () => {
            const handleDragOverSpy = jest.spyOn(htmlTreeView, 'handleDragOver');
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);

            const mockEvent = new DragEvent('dragover', { bubbles: true, cancelable: true });
            divElement.dispatchEvent(mockEvent);

            expect(handleDragOverSpy).toHaveBeenCalledTimes(1);
            expect(handleDragOverSpy).toHaveBeenCalledWith(mockEvent, divElement);
            handleDragOverSpy.mockRestore();
        });

        test('should add dragleave listener calling handleDragLeave', () => {
            const handleDragLeaveSpy = jest.spyOn(htmlTreeView, 'handleDragLeave');
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);

            const mockEvent = new DragEvent('dragleave', { bubbles: true, cancelable: true });
            divElement.dispatchEvent(mockEvent);

            expect(handleDragLeaveSpy).toHaveBeenCalledTimes(1);
            expect(handleDragLeaveSpy).toHaveBeenCalledWith(mockEvent, divElement);
            handleDragLeaveSpy.mockRestore();
        });

        test('should add drop listener calling handleDropOnNode', () => {
            const handleDropOnNodeSpy = jest.spyOn(htmlTreeView, 'handleDropOnNode');
            htmlTreeView.addDragAndDropHandlers(divElement, mockNode);

            const mockEvent = new DragEvent('drop', { 
                bubbles: true, 
                cancelable: true,
                dataTransfer: { 
                    getData: jest.fn().mockReturnValue('some-other-node-id')
                }
            });
            divElement.dispatchEvent(mockEvent);

            expect(handleDropOnNodeSpy).toHaveBeenCalledTimes(1);
            expect(handleDropOnNodeSpy).toHaveBeenCalledWith(mockEvent, mockNode, divElement);
            handleDropOnNodeSpy.mockRestore();
        });
    });

    test('should render node content using a template if provided', () => {
        // 1. Setup DOM with a template and a dedicated container for this test
        document.body.innerHTML = `
            <div id="tree-container-template">
            <template id="node-content-template" class="node-template">
                <div class="custom-node-render">
                    Label: {{label}}, ID: {{id}}, Unmatched: {{unmatchedPlaceholder}}
                </div>
            </template>
            </div>
        `;

        // 2. Create a TreeNode with properties for the template
        const templateTestNode = new TreeNode({
            id: "node-template-1",
            label: "Node With Template",
            // 'unmatchedPlaceholder' is not in node data to test fallback
        });

        const testTreeForTemplate = new Tree();
        testTreeForTemplate.addRoot(templateTestNode);

        // 3. Instantiate HtmlTreeView, assuming it accepts a 'templateSelector' option
        const htmlTreeViewInstance = new HtmlTreeView('tree-container-template', testTreeForTemplate       );

        // 4. Query the rendered node element
        const renderedLiElement = document.querySelector(`li[data-node-id="${templateTestNode.id}"]`);
        expect(renderedLiElement).not.toBeNull();

        // 5. Verify the templated content
        //    Assuming the templated HTML replaces the default label span.
        //    The structure is typically: .item-content-wrapper > span.toggle-icon + label.form-checkbox + span (this one)
        const itemContentWrapper = renderedLiElement.querySelector('.item-content-wrapper');
        expect(itemContentWrapper).not.toBeNull();

        // Find the span that should contain the templated content.
        // This span is expected to be generated by the lines of code under test.
        const labelElement = itemContentWrapper.querySelector('label.form-checkbox');
        expect(labelElement).not.toBeNull();
        const templatedContentHostSpan = labelElement.nextElementSibling; // The span after the checkbox label

        expect(templatedContentHostSpan).not.toBeNull();
        expect(templatedContentHostSpan.tagName).toBe('SPAN'); // As per `const span = document.createElement("span");`

        // Normalize HTML content for robust comparison (handles whitespace variations)
        const normalizeHtml = (htmlStr) => htmlStr.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

        const expectedInnerHtml = normalizeHtml(`
            <div class="custom-node-render">
                Label: Node With Template, ID: node-template-1, Unmatched: {{unmatchedPlaceholder}}
            </div>
        `);
        const actualInnerHtml = normalizeHtml(templatedContentHostSpan.innerHTML);

        expect(actualInnerHtml).toBe(expectedInnerHtml);
        // Ensure that placeholders for properties not found in the node data are retained
        expect(actualInnerHtml).toContain("{{unmatchedPlaceholder}}");
    });

    test('moveHtmlElement should update UI correctly when a parent becomes childless after moving its only child to another node', () => {
        // Setup:
        // ParentA
        //  └─ ChildA1 (to be moved)
        // TargetParentB
        const parentNode = new TreeNode({ id: "P1", label: "Parent Node A", expanded: true });
        const childNodeToMove = new TreeNode({ id: "C1A1", label: "Child A1" });
        parentNode.addChild(childNodeToMove);

        const targetParentNode = new TreeNode({ id: "TP2", label: "Target Parent B", expanded: true });

        const testTree = new Tree();
        testTree.addRoot(parentNode);
        testTree.addRoot(targetParentNode);

        document.body.innerHTML = `<div id="tree-container-parent-childless"></div>`;
        const htmlTreeView = new HtmlTreeView('tree-container-parent-childless', testTree);

        // Pre-move checks for parentNode ("P1")
        const parentLiP1 = htmlTreeView.queryByNodeId("li", "P1");
        expect(parentLiP1).not.toBeNull();
        // P1 should have a UL for its children
        let childrenUlOfP1 = parentLiP1.querySelector("ul.children-ul");
        expect(childrenUlOfP1).not.toBeNull();
        expect(childrenUlOfP1.children.length).toBe(1); // C1A1 is its child
        // P1's toggle icon should not be transparent and should indicate it's expandable
        let toggleIconP1 = parentLiP1.querySelector("div.item-content-wrapper .toggle-icon");
        expect(toggleIconP1).not.toBeNull();
        expect(toggleIconP1.classList.contains("icon-transparent")).toBe(false);
        expect(toggleIconP1.querySelector("i.fa-chevron-down")).not.toBeNull(); // Expanded with children

        // Action: Move ChildA1 from ParentA to TargetParentB
        // tree.moveTo(nodeToMove, newParentNode, newIndex, callback)
        testTree.moveTo(childNodeToMove, targetParentNode, 0, htmlTreeView.moveHtmlElement);

        // Post-move assertions for parentNode ("P1")
        const updatedParentLiP1 = htmlTreeView.queryByNodeId("li", "P1"); // Re-query, DOM might have changed
        expect(updatedParentLiP1).not.toBeNull();
        // P1 should no longer have a UL for children
        childrenUlOfP1 = updatedParentLiP1.querySelector("ul.children-ul");
        expect(childrenUlOfP1).toBeNull();
        
        // P1's toggle icon should now be transparent
        toggleIconP1 = updatedParentLiP1.querySelector("div.item-content-wrapper .toggle-icon");
        expect(toggleIconP1).not.toBeNull();
        expect(toggleIconP1.classList.contains("icon-transparent")).toBe(true);

        // Post-move assertions for targetParentNode ("TP2")
        const targetParentLiTP2 = htmlTreeView.queryByNodeId("li", "TP2");
        expect(targetParentLiTP2).not.toBeNull();
        const childrenUlOfTP2 = targetParentLiTP2.querySelector("ul.children-ul");
        expect(childrenUlOfTP2).not.toBeNull(); // TP2 should now have a UL
        const movedChildLi = childrenUlOfTP2.querySelector(`li[data-node-id="${childNodeToMove.id}"]`);
        expect(movedChildLi).not.toBeNull(); // C1A1 should be under TP2
    });

    test('moveHtmlElement should update UI correctly when a parent becomes childless after moving its only child to root', () => {
        // Setup:
        // ParentA
        //  └─ ChildA1 (to be moved to root)
        const parentNode = new TreeNode({ id: "P1Root", label: "Parent Node A (Root Test)", expanded: true });
        const childNodeToMove = new TreeNode({ id: "C1A1Root", label: "Child A1 (Root Test)" });
        parentNode.addChild(childNodeToMove);

        const testTree = new Tree();
        testTree.addRoot(parentNode);
        // childNodeToMove is initially under parentNode, not a root

        document.body.innerHTML = `<div id="tree-container-parent-childless-toroot"></div>`;
        const htmlTreeView = new HtmlTreeView('tree-container-parent-childless-toroot', testTree);

        const parentLiP1 = htmlTreeView.queryByNodeId("li", "P1Root");
        expect(parentLiP1).not.toBeNull();
        expect(parentLiP1.querySelector("ul.children-ul")).not.toBeNull();
        let toggleIconP1 = parentLiP1.querySelector("div.item-content-wrapper .toggle-icon");
        expect(toggleIconP1.classList.contains("icon-transparent")).toBe(false);

        // Action: Move ChildA1 from ParentA to root (targetNodeId = null)
        testTree.moveTo(childNodeToMove, null, 1, htmlTreeView.moveHtmlElement); // Move to root, as the second root element

        // Post-move assertions for parentNode ("P1Root")
        const updatedParentLiP1 = htmlTreeView.queryByNodeId("li", "P1Root");
        expect(updatedParentLiP1.querySelector("ul.children-ul")).toBeNull();
        toggleIconP1 = updatedParentLiP1.querySelector("div.item-content-wrapper .toggle-icon");
        expect(toggleIconP1.classList.contains("icon-transparent")).toBe(true);

        // Post-move assertion for the moved child (now a root)
        const rootUl = htmlTreeView.container.querySelector("ul"); // The main root UL
        const movedChildLiAtRoot = rootUl.querySelector(`:scope > li[data-node-id="${childNodeToMove.id}"]`);
        expect(movedChildLiAtRoot).not.toBeNull();
        // Check its position if important, e.g., it should be the second child of the root UL
        expect(rootUl.children[1]).toBe(movedChildLiAtRoot);
    });
});


