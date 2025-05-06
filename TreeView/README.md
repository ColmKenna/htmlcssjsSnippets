# TreeView Module

## HtmlTreeView.js

### Purpose
`HtmlTreeView.js` is responsible for rendering and managing interactions for a tree view component. It provides functionalities such as creating tree nodes, handling drag-and-drop operations, and updating the UI based on the tree structure.

### Functions
- `constructor(containerId, tree)`: Initializes the tree view with the given container and tree structure.
- `createElementWithClasses(tag, ...classes)`: Utility function to create an element with specified classes.
- `queryByNodeId(selector, nodeId)`: Utility function to query an element by node ID and selector.
- `updateCheckboxState(updatedNode)`: Updates the state of a checkbox based on the node's state.
- `createCheckbox(node)`: Creates a checkbox for a tree node.
- `createNodeLabel(node)`: Creates a label for a tree node.
- `handleDragStart(e, node, div)`: Handles the drag start event for a node.
- `handleDragEnd(e, div)`: Handles the drag end event for a node.
- `handleDragOver(e, div)`: Handles the drag over event for a node.
- `handleDragLeave(e, div)`: Handles the drag leave event for a node.
- `handleDropOnNode(e, node, div)`: Handles the drop event on a node.
- `handleDropzoneDragOver(e, dz)`: Handles the drag over event for a dropzone.
- `handleDropzoneDragLeave(e, dz)`: Handles the drag leave event for a dropzone.
- `handleDropzoneDrop(e, targetNode, position, dz)`: Handles the drop event on a dropzone.
- `handleToggleClick(e, node, li, childrenUl, icon)`: Handles the click event for toggling a node's expanded state.
- `addDragAndDropHandlers(div, node)`: Adds drag-and-drop event handlers to a node.
- `moveHtmlElement(addedNodeId, targetNodeId, position)`: Moves an HTML element representing a node to a new position.
- `createDropzone(targetNode, position)`: Creates a dropzone for a node.
- `createToggle(node, li, childrenUl)`: Creates a toggle icon for a node.
- `createChildrenUl(node, nodeToUl)`: Creates a UL element for a node's children.
- `renderTreeWithTraversal()`: Renders the tree view by traversing the tree structure.

## HtmlTreeView.test.js

### Purpose
`HtmlTreeView.test.js` contains tests for the `HtmlTreeView.js` module. It verifies the functionality of the tree view component, including rendering, drag-and-drop operations, and UI updates.

### Tests
- `li elements should have the correct data-node-id`: Verifies that `li` elements have the correct `data-node-id` attribute.
- `li elements should have drop zones before and after`: Verifies that `li` elements have drop zones before and after them.
- `toggle icons should be correctly rendered based on children and expanded state`: Verifies that toggle icons are rendered correctly based on the node's children and expanded state.
- `should correctly render a collapsed parent node with children`: Verifies that a collapsed parent node with children is rendered correctly.
- `nodes with children should have a child ul list with correct children`: Verifies that nodes with children have a `ul` list with the correct children.
- `checkboxes should be correctly rendered and have the right attributes`: Verifies that checkboxes are rendered correctly and have the right attributes.
- `updateCheckboxState should update the checkbox state correctly`: Verifies that `updateCheckboxState` updates the checkbox state correctly.
- `handleToggleClick should be called when a toggle icon is clicked`: Verifies that `handleToggleClick` is called when a toggle icon is clicked.
- `handleToggleClick`: Contains tests for the `handleToggleClick` function.
- `handleDropOnNode`: Contains tests for the `handleDropOnNode` function.
- `handleDropzoneDrop`: Contains tests for the `handleDropzoneDrop` function.
- `createDropzone`: Contains tests for the `createDropzone` function.
- `addDragAndDropHandlers`: Contains tests for the `addDragAndDropHandlers` function.
- `should render node content using a template if provided`: Verifies that node content is rendered using a template if provided.
- `moveHtmlElement should update UI correctly when a parent becomes childless after moving its only child to another node`: Verifies that `moveHtmlElement` updates the UI correctly when a parent becomes childless after moving its only child to another node.
- `moveHtmlElement should update UI correctly when a parent becomes childless after moving its only child to root`: Verifies that `moveHtmlElement` updates the UI correctly when a parent becomes childless after moving its only child to root.

## treeview.js

### Purpose
`treeview.js` defines the tree and tree node structures. It provides functionalities for creating and managing tree nodes, traversing the tree, and updating node states.

### Functions
- `TreeNode`: Class representing a tree node.
  - `constructor({ id, label, checked, expanded, indeterminate, children })`: Initializes a tree node with the given properties.
  - `traverseDepthFirst(callback)`: Traverses the tree depth-first and calls the callback for each node.
  - `traverseBreadthFirst(callback)`: Traverses the tree breadth-first and calls the callback for each node.
  - `addChild(childNode)`: Adds a child node to the current node.
  - `setChecked(checked, callback)`: Sets the checked state of the node and updates its children.
  - `getChildrenCheckState()`: Returns the check state of the node's children.
  - `updateCheckStateFromChildren(callback)`: Updates the check state of the node based on its children.
  - `isIntermediate()`: Returns whether the node is in an intermediate state.
  - `removeChild(childNode)`: Removes a child node from the current node.
  - `insertChildAt(childNode, position)`: Inserts a child node at the specified position.
  - `UpdateExpanded(expanded, callback)`: Updates the expanded state of the node.
- `Tree`: Class representing a tree structure.
  - `constructor(roots, emitter)`: Initializes a tree with the given root nodes and event emitter.
  - `addRoot(rootNode)`: Adds a root node to the tree.
  - `findNodeById(id)`: Finds a node by its ID in the tree.
  - `moveTo(node, newParent, position, callback)`: Moves a node to a new parent at the specified position.

## treeview.test.js

### Purpose
`treeview.test.js` contains tests for the `treeview.js` module. It verifies the functionality of the tree and tree node structures, including node creation, traversal, and state updates.

### Tests
- `TreeNode constructor sets parent on children`: Verifies that the `TreeNode` constructor sets the parent on children.
- `setChecked triggers callback`: Verifies that `setChecked` triggers the callback.
- `updateCheckStateFromChildren sets checked = false and triggers callback if all unchecked`: Verifies that `updateCheckStateFromChildren` sets `checked` to `false` and triggers the callback if all children are unchecked.
- `insertChildAt bounds correction`: Verifies that `insertChildAt` corrects bounds.
- `UpdateExpanded sets expanded and calls callback`: Verifies that `UpdateExpanded` sets the expanded state and calls the callback.
- `UpdateExpanded sets expanded when no callback is provided`: Verifies that `UpdateExpanded` sets the expanded state when no callback is provided.
- `moveTo root with no parent updates root and triggers callback`: Verifies that `moveTo` updates the root and triggers the callback when moving to the root with no parent.
- `removeChild does nothing if child is not present`: Verifies that `removeChild` does nothing if the child is not present.
- `moveTo does not remove root if already at root and has no parent`: Verifies that `moveTo` does not remove the root if it is already at the root and has no parent.
- `moveTo clamps root position when too large`: Verifies that `moveTo` clamps the root position when it is too large.
- `moveTo to self is ignored`: Verifies that `moveTo` to self is ignored.
- `moveTo to descendant is ignored`: Verifies that `moveTo` to a descendant is ignored.
- `should create a node with label and id`: Verifies that a node is created with a label and ID.
- `should set the parent for child nodes`: Verifies that the parent is set for child nodes.
- `should add a child and set parent reference`: Verifies that a child is added and the parent reference is set.
- `should traverse depth-first in correct order`: Verifies that the tree is traversed depth-first in the correct order.
- `should traverse breadth-first in correct order`: Verifies that the tree is traversed breadth-first in the correct order.
- `should traverse depth-first in post-order`: Verifies that the tree is traversed depth-first in post-order.
- `should update checked state and propagate to children`: Verifies that the checked state is updated and propagated to children.
- `should update parent indeterminate state`: Verifies that the parent indeterminate state is updated.
- `should remove and insert children correctly`: Verifies that children are removed and inserted correctly.
- `should add root nodes and find by id`: Verifies that root nodes are added and found by ID.
- `should move node to a different parent`: Verifies that a node is moved to a different parent.
- `should not allow move to self or descendant`: Verifies that moving to self or a descendant is not allowed.
- `should move node to root level`: Verifies that a node is moved to the root level.
- `moveTo clamps root position to 0 when negative`: Verifies that `moveTo` clamps the root position to 0 when it is negative.
- `moveTo removes node from roots before inserting at new root position`: Verifies that `moveTo` removes a node from the roots before inserting it at a new root position.
- `moveTo calls callback with correct arguments when moving to new parent`: Verifies that `moveTo` calls the callback with the correct arguments when moving to a new parent.
- `moveTo removes node from roots when moving to a new parent`: Verifies that `moveTo` removes a node from the roots when moving to a new parent.
- `moveTo emits nodeMoved event with correct arguments`: Verifies that `moveTo` emits a `nodeMoved` event with the correct arguments.
- `moveTo emits nodeMoved event when moving to root level`: Verifies that `moveTo` emits a `nodeMoved` event when moving to the root level.
- `emits nodeAdded event with correct parent and position when adding as root`: Verifies that a `nodeAdded` event is emitted with the correct parent and position when adding as a root.
- `emits nodeAdded event with correct parent and position when adding as child`: Verifies that a `nodeAdded` event is emitted with the correct parent and position when adding as a child.
- `emits nodeRemoved event with correct node, parent, and position when removing a child`: Verifies that a `nodeRemoved` event is emitted with the correct node, parent, and position when removing a child.
- `emits nodeChecked event with correct node and checked state when a node is checked`: Verifies that a `nodeChecked` event is emitted with the correct node and checked state when a node is checked.
- `emits nodeExpanded event with correct node and expanded state when a node is expanded or collapsed`: Verifies that a `nodeExpanded` event is emitted with the correct node and expanded state when a node is expanded or collapsed.

## Sample Usage

Here is a sample usage demonstrating how to use the tree view component in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <meta charset="UTF-8" />
    <title>TreeView</title>
    <link rel="stylesheet" href="TreeView.css" />
  </head>

  <body>
    <div id="treeview-container">
      <!-- <template class="node-template"> {{label}} {{id}} </template> -->
    </div>

    <script type="module" src="../EventEmitter/EventEmitter.js"></script>
    <script type="module" src="./TreeView.js"></script>
    <script type="module" src="./HtmlTreeView.js"></script>
    <script type="module">
      import { TreeNode, Tree } from './TreeView.js';
      import { HtmlTreeView } from './HtmlTreeView.js';
      // Example usage:
      // Create root nodes
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
        expanded: false,
      });

      // Add children to root
      const child1 = new TreeNode({
        id: "1.1",
        label: "Child 1",
        checked: false,
        expanded: true,
      });
      const child2 = new TreeNode({
        id: "1.2",
        label: "Child 2",
        checked: false,
        expanded: true,
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
      child2.addChild(
        new TreeNode({
          id: "1.2.1",
          label: "Grandchild 2.1",
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
      const tree = new Tree();
      tree.addRoot(root);
      tree.addRoot(root2);

      // Render
      new HtmlTreeView("treeview-container", tree);
    </script>
  </body>
</html>
```
