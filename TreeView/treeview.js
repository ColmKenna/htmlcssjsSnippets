class TreeView {
    constructor(containerId, initialData, jsonViewId = null) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with ID "${containerId}" not found.`);
        }
        this.jsonViewElement = jsonViewId ? document.getElementById(jsonViewId) : null;

        this.templateContainer = document.getElementById(containerId);
        if (!this.templateContainer) {
            throw new Error(`Template container element with ID "${containerId}" not found.`);
        }

        // Add Expand All button to the container
        const expandAllBtn = document.createElement('button');
        expandAllBtn.textContent = 'Expand All';
        expandAllBtn.className = 'treeview-expand-all-btn';
        expandAllBtn.style.marginBottom = '0.5em';
        expandAllBtn.addEventListener('click', () => {
            this.expandAll();
        });
        this.container.insertBefore(expandAllBtn, this.container.firstChild);

        // get all the checked children in initialData
  
        this.data = initialData;
        this.openIds = new Set();
        this.parentMap = new Map();



        this._addCheckedProperty(this.data);
        this._buildParentMap(this.data);

        this.traverseNodes(initialData, (node) => {
            if (node.checked) {
                this.updateAncestorsState(node);
                this.setCheckedRecursive(node, true);
            }
        });
        this._setupTreeClickListener();
        this.render(); // Initial render





    }

        // Traverse all nodes in the tree and their children
        traverseNodes(nodes, callback) {
            nodes.forEach(node => {
                callback(node);
                if (node.children && node.children.length > 0) {
                    this.traverseNodes(node.children, callback);
                }
            });
        }

        
    // Add checked property to all nodes recursively (private helper)
    _addCheckedProperty(nodes) {
        nodes.forEach(node => {
            if (typeof node.checked === 'undefined') node.checked = false;
            if (node.children && node.children.length > 0) this._addCheckedProperty(node.children);
        });
    }

    // Build a map from node id to parent node (private helper)
    _buildParentMap(nodes, parent = null) {
        nodes.forEach(node => {
            if (parent) this.parentMap.set(node.id, parent);
            if (node.children && node.children.length > 0) {
                this._buildParentMap(node.children, node); // <-- FIX: pass node, not parent
            }
        });
    }


    // Set checked state recursively
    setCheckedRecursive(node, checked) {
        node.checked = checked;
        node.indeterminate = false;
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => this.setCheckedRecursive(child, checked));
        }
    }

    // Update ancestor states upwards
    updateAncestorsState(node) {
        const parent = this.parentMap.get(node.id);
        if (!parent) return;

        const children = parent.children;
        if (!children || children.length === 0) return;

        const totalChildren = children.length;
        const checkedChildren = children.filter(child => child.checked && !child.indeterminate).length;
        const indeterminateChildren = children.filter(child => child.indeterminate).length;

        let newCheckedState = false;
        let newIndeterminateState = false;

        if (checkedChildren === totalChildren) {
            newCheckedState = true;
            newIndeterminateState = false;
        } else if (checkedChildren > 0 || indeterminateChildren > 0) {
            newCheckedState = false;
            newIndeterminateState = true;
        } else {
            newCheckedState = false;
            newIndeterminateState = false;
        }

        if (parent.checked !== newCheckedState || parent.indeterminate !== newIndeterminateState) {
            parent.checked = newCheckedState;
            parent.indeterminate = newIndeterminateState;
            this.updateAncestorsState(parent); // Use this.
        }
    }

    // Find node by ID
    findNodeById(nodes, id) {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = this.findNodeById(node.children, id); // Use this.
                if (found) return found;
            }
        }
        return null;
    }

    // Helper: Check if targetId is a descendant of sourceId
    _isDescendant(sourceId, targetId) {
        const sourceNode = this.findNodeById(this.data, sourceId);
        if (!sourceNode) return false;
        function search(node) {
            if (!node.children) return false;
            for (const child of node.children) {
                if (child.id === targetId) return true;
                if (search(child)) return true;
            }
            return false;
        }
        return search(sourceNode);
    }

    // --- Event Handlers ---

    _handleTreeClick(e) {
        const target = e.target;
        const li = target.closest('li[data-node-id]');
        if (!li) return;

        const nodeId = Number(li.dataset.nodeId);
        const node = this.findNodeById(this.data, nodeId);
        if (!node) {
            console.error("Data node not found for ID:", nodeId);
            return;
        }

        if (target.classList.contains('tree-arrow')) {
            this._handleArrowClick(e, node, nodeId);
        } else if (target.matches('input[type="checkbox"]')) {
            this._handleCheckboxClick(e, node, target);
        }
    }

    _handleArrowClick(e, node, nodeId) {
        e.stopPropagation();
        if (this.openIds.has(nodeId)) {
            this.openIds.delete(nodeId);
        } else {
            this.openIds.add(nodeId);
        }
        this.render();
    }

    _handleCheckboxClick(e, node, checkbox) {
        e.stopPropagation();
        this.updateCheckboxState(checkbox, node);
        this.render();
    }

    updateCheckboxState(checkbox, node) {
        const isChecked = checkbox.checked;
        this.setCheckedRecursive(node, isChecked);
        this.updateAncestorsState(node);
    }

    // Generic helper for drag/drop event handling
    _handleDragEvent(e, element, className, add = true) {
        e.preventDefault();
        e.stopPropagation();
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    _handleDropZoneDragOver(e, dropZone) {
        this._handleDragEvent(e, dropZone, 'active', true);
    }

    _handleDropZoneDragLeave(e, dropZone) {
        this._handleDragEvent(e, dropZone, 'active', false);
    }

    _handleDropZoneDrop(e, node, position, dropZone) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('active');
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        if (draggedId === node.id) return;
        if (this._isDescendant(draggedId, node.id)) return;
        const draggedNode = this.findNodeById(this.data, draggedId);
        const targetNode = node;
        // Dispatch beforedrop event (cancelable)
        const beforeDropEvent = new CustomEvent('treeview:beforedrop', {
            detail: {
                draggedNode,
                targetNode,
                position
            },
            cancelable: true
        });
        this.container.dispatchEvent(beforeDropEvent);
        if (beforeDropEvent.defaultPrevented) return;
        this.moveNode(draggedId, node.id, position);
        this.render();
        // Dispatch afterdrop event
        this.container.dispatchEvent(new CustomEvent('treeview:afterdrop', {
            detail: {
                draggedNode,
                targetNode,
                position
            }
        }));
    }

    _handleListItemDragOver(e, li) {
        this._handleDragEvent(e, li, 'drag-over', true);
    }

    _handleListItemDragLeave(e, li) {
        this._handleDragEvent(e, li, 'drag-over', false);
    }

    _handleListItemDrop(e, node, li) {
        e.preventDefault();
        e.stopPropagation();
        li.classList.remove('drag-over');
        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        if (draggedId === node.id) return;
        if (this._isDescendant(draggedId, node.id)) return;
        const draggedNode = this.findNodeById(this.data, draggedId);
        const targetNode = node;
        // Dispatch beforedrop event (cancelable)
        const beforeDropEvent = new CustomEvent('treeview:beforedrop', {
            detail: {
                draggedNode,
                targetNode,
                position: 'child'
            },
            cancelable: true
        });
        this.container.dispatchEvent(beforeDropEvent);
        if (beforeDropEvent.defaultPrevented) return;
        this.moveNode(draggedId, node.id, 'child');
        this.render();
        // Dispatch afterdrop event
        this.container.dispatchEvent(new CustomEvent('treeview:afterdrop', {
            detail: {
                draggedNode,
                targetNode,
                position: 'child'
            }
        }));
    }

    _handleListItemDragStart(e, node, li) {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', node.id);
        li.classList.add('dragging');
    }

    _handleListItemDragEnd(e, li) {
        li.classList.remove('dragging');
    }

    // --- Setup/Creation Methods ---

    // Setup main click listener
    _setupTreeClickListener() {
        this._boundHandleTreeClick = this._handleTreeClick.bind(this);
        this.container.addEventListener('click', this._boundHandleTreeClick);
    }

    // Create Drop Zone element
    _createDropZone(node, position) {
        const dropZone = document.createElement('div');
        dropZone.className = `drop-zone ${position}`;
        dropZone.addEventListener('dragover', (e) => this._handleDropZoneDragOver(e, dropZone));
        dropZone.addEventListener('dragleave', (e) => this._handleDropZoneDragLeave(e, dropZone));
        dropZone.addEventListener('drop', (e) => this._handleDropZoneDrop(e, node, position, dropZone));
        return dropZone;
    }

    // Create Arrow element
    _createArrowElement(node, li) {
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'tree-arrow';
        arrowSpan.innerHTML = '&#9654;';
        if (this.openIds.has(node.id)) {
            arrowSpan.style.transform = 'rotate(90deg)';
        }
        return arrowSpan;
    }

    // Create Checkbox element
    _createCheckboxElement(node) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '0.3em';
        checkbox.checked = !!node.checked;
        checkbox.indeterminate = !!node.indeterminate;
        return checkbox;
    }

    // Create Label element
    _createLabelElement(node) {
        // Use the template container provided in the constructor
        const templateContainer = this.templateContainer;
        if (!templateContainer) {
            // fallback to old behavior if not found
            const labelSpan = document.createElement('span');
            labelSpan.textContent = node.label;
            labelSpan.style.marginLeft = '0.2em';
            return labelSpan;
        }

        // Determine if this is a leaf or branch node
        const isLeaf = !node.children || node.children.length === 0;
        const templateName = isLeaf ? 'treeview-leaf-template' : 'treeview-node-template';
        const template = templateContainer.querySelector(`template[name="${templateName}"]`);
        if (!template) {
            // fallback to old behavior if template not found
            const labelSpan = document.createElement('span');
            labelSpan.textContent = node.label;
            labelSpan.style.marginLeft = '0.2em';
            return labelSpan;
        }

        // Clone the template content
        const clone = template.content.cloneNode(true);
        // Replace placeholders {{id}} and {{label}}
        // We'll do this for all elements with attributes or textContent containing the placeholders
        const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            const current = walker.currentNode;
            if (current.nodeType === Node.ELEMENT_NODE) {
                // Replace in attributes
                for (let attr of current.attributes || []) {
                    if (attr.value.includes('{{id}}')) {
                        current.setAttribute(attr.name, attr.value.replace(/{{id}}/g, node.id));
                    }
                    if (attr.value.includes('{{label}}')) {
                        current.setAttribute(attr.name, attr.value.replace(/{{label}}/g, node.label));
                    }
                }
            } else if (current.nodeType === Node.TEXT_NODE) {
                // Replace in text content
                if (current.nodeValue.includes('{{id}}')) {
                    current.nodeValue = current.nodeValue.replace(/{{id}}/g, node.id);
                }
                if (current.nodeValue.includes('{{label}}')) {
                    current.nodeValue = current.nodeValue.replace(/{{label}}/g, node.label);
                }
            }
        }
        // Return the first element child of the clone (the template root)
        return clone.children[0] || clone.firstElementChild || clone;
    }

    // Setup Drag/Drop listeners for list item
    _setupDragDropListeners(node, li) {
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragover', (e) => this._handleListItemDragOver(e, li));
        li.addEventListener('dragleave', (e) => this._handleListItemDragLeave(e, li));
        li.addEventListener('drop', (e) => this._handleListItemDrop(e, node, li));
        li.addEventListener('dragstart', (e) => this._handleListItemDragStart(e, node, li));
        li.addEventListener('dragend', (e) => this._handleListItemDragEnd(e, li));
    }

    // Create Tree Node list item
    _createTreeNode(node) {
        const li = document.createElement('li');
        li.classList.add('treeview-li'); // Add class to li
        li.textContent = '';
        li.dataset.nodeId = node.id;
        if (this.openIds.has(node.id)) li.classList.add('open');

        const hasChildren = node.children && node.children.length > 0;

        if (hasChildren) {
            li.appendChild(this._createArrowElement(node, li));
        } else {
            const emptySpan = document.createElement('span');
            emptySpan.style.display = 'inline-block';
            emptySpan.style.width = '1em';
            li.appendChild(emptySpan);
        }

        li.appendChild(this._createCheckboxElement(node));
        li.appendChild(this._createLabelElement(node));
        this._setupDragDropListeners(node, li);

        if (hasChildren && this.openIds.has(node.id)) {
            const ul = document.createElement('ul');
            node.children.forEach(child => {
                this._renderTreeNodeWithDropZones(child, ul);
            });
            li.appendChild(ul);
        }
        return li;
    }

    // Render node with drop zones
    _renderTreeNodeWithDropZones(node, container) {
        container.appendChild(this._createDropZone(node, 'before'));
        container.appendChild(this._createTreeNode(node));
        container.appendChild(this._createDropZone(node, 'after'));
    }

    // Find and remove node helper
    _findAndRemoveNode(nodes, nodeId) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
                const originalIndex = i;
                const removedNode = nodes.splice(i, 1)[0];
                return { removedNode, parentArray: nodes, originalIndex };
            }
            if (nodes[i].children && nodes[i].children.length > 0) {
                const result = this._findAndRemoveNode(nodes[i].children, nodeId);
                if (result) return result;
            }
        }
        return null;
    }

    // Insert node helper
    _insertNodeRelativeToTarget(nodes, nodeToInsert, targetId, position, currentParent = null) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === targetId) {
                if (position === 'before' || position === 'after') {
                    const insertionIndex = (position === 'before') ? i : i + 1;
                    nodes.splice(insertionIndex, 0, nodeToInsert);
                    return { success: true, newParent: currentParent };
                } else if (position === 'child') {
                    nodes[i].children = nodes[i].children || [];
                    nodes[i].children.push(nodeToInsert);
                    return { success: true, newParent: nodes[i] };
                }
            }
            if (nodes[i].children && nodes[i].children.length > 0) {
                const result = this._insertNodeRelativeToTarget(nodes[i].children, nodeToInsert, targetId, position, nodes[i]);
                if (result && result.success) return result;
            }
        }
        return { success: false, newParent: null };
    }

    // Move node logic
    moveNode(draggedId, targetId, position = 'child') {
        const removalResult = this._findAndRemoveNode(this.data, draggedId);
        if (removalResult && removalResult.removedNode) {
            const nodeToMove = removalResult.removedNode;
            const originalParent = this.parentMap.get(nodeToMove.id); // Get parent *before* deletion/map update
            this.parentMap.delete(nodeToMove.id);

            const insertionResult = this._insertNodeRelativeToTarget(this.data, nodeToMove, targetId, position);

            if (insertionResult.success) {
                if (insertionResult.newParent) {
                    this.parentMap.set(nodeToMove.id, insertionResult.newParent);
                } else {
                    this.parentMap.delete(nodeToMove.id);
                }
            } else {
                if (removalResult.parentArray) {
                    removalResult.parentArray.splice(removalResult.originalIndex, 0, nodeToMove);
                    if (originalParent) {
                        this.parentMap.set(nodeToMove.id, originalParent);
                    }
                } else {
                    this.data.push(nodeToMove);
                    this.parentMap.delete(nodeToMove.id);
                }
                console.error("Failed to insert node, target not found? Reverted move.");
            }
        } else {
            console.error("Failed to find or remove dragged node.");
        }
    }

    // Copy tree with checked state
    _copyTreeWithChecked(nodes) {
        return nodes.map(node => ({
            id: node.id,
            label: node.label,
            checked: !!node.checked,
            indeterminate: !!node.indeterminate,
            children: node.children ? this._copyTreeWithChecked(node.children) : []
        }));
    }

    // Update JSON view
    _updateJsonView() {
        if (this.jsonViewElement) {
            this.jsonViewElement.textContent = JSON.stringify(this._copyTreeWithChecked(this.data), null, 2);
        }
    }

    // Render the entire tree using DocumentFragment for performance
    render() {
        // select all elements withing the container and remove them
        const elements = this.container.querySelectorAll('.tree, .drop-zone');
        elements.forEach(element => element.remove());
        
        const fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');
        ul.className = 'tree';
        this.data.forEach(node => {
            this._renderTreeNodeWithDropZones(node, ul);
        });
        fragment.appendChild(ul);
        this.container.appendChild(fragment);
        this._updateJsonView();
    }

    // Expand all nodes in the tree
    expandAll() {
        this.traverseNodes(this.data, node => {
            if (node.children && node.children.length > 0) {
                this.openIds.add(node.id);
            }
        });
        this.render();
    }
}

// --- Initialization ---
function initTreeView(containerId, initialData, jsonViewId) {
    return new TreeView(containerId, initialData, jsonViewId);
}

module.exports = { TreeView, initTreeView };
