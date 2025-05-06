class HtmlTreeView {
  constructor(containerId, tree) {
    this.container = document.getElementById(containerId);
    this.tree = tree;
    this.moveHtmlElement = this.moveHtmlElement.bind(this);
    this.renderTreeWithTraversal();
  }

  // Utility: Create element with classes
  createElementWithClasses(tag, ...classes) {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    return el;
  }

  // Utility: Query element by node id and selector
  queryByNodeId(selector, nodeId) {
    return this.container.querySelector(`${selector}[data-node-id="${nodeId}"]`);
  }

  updateCheckboxState(updatedNode) {
    const updatedCheckbox = document.getElementById("chk_" + updatedNode.id);
    if (updatedCheckbox) {
      updatedCheckbox.checked = updatedNode.checked;
      updatedCheckbox.indeterminate = updatedNode.isIntermediate();
    }
  }

  createCheckbox(node) {
    const checkbox = this.createElementWithClasses("input", "form-check-input");
    checkbox.type = "checkbox";
    checkbox.checked = node.checked;
    checkbox.id = "chk_" + node.id;
    checkbox.indeterminate = node.isIntermediate();
    checkbox.name = "checkbox-" + node.id;
    checkbox.value = "true";
    checkbox.setAttribute("data-node-id", node.id);

    checkbox.addEventListener("change", () => {
      node.setChecked(checkbox.checked, this.updateCheckboxState);
    });

    return checkbox;
  }

  createNodeLabel(node) {
    const template = this.container.querySelector("template.node-template");
    if (template) {
      // Get template as string and interpolate all {{property}} placeholders
      let html = template.innerHTML.replace(/\{\{(\w+)\}\}/g, (match, prop) =>
        node[prop] !== undefined ? node[prop] : match
      );
      const span = document.createElement("span");
      span.innerHTML = html;
      return span;
    } else {
      // Fallback: original implementation
      const labelSpan = document.createElement("span");
      labelSpan.textContent = node.label;
      return labelSpan;
    }
  }

  // Drag and drop event handlers
  handleDragStart(e, node, div) {
    e.dataTransfer.setData("text/plain", node.id);
    div.classList.add("dragging");
  }

  handleDragEnd(e, div) {
    div.classList.remove("dragging");
  }

  handleDragOver(e, div) {
    e.preventDefault();
    div.classList.add("drag-over");
  }

  handleDragLeave(e, div) {
    div.classList.remove("drag-over");
  }

  handleDropOnNode(e, node, div) {
    e.preventDefault();
    div.classList.remove("drag-over");
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === node.id) return; // Prevent dropping onto self

    let draggedNode = this.tree.findNodeById(draggedId);
    if (!draggedNode) return; // Node not found
    let countOfChildren = node.children.length;
    this.tree.moveTo(
      draggedNode,
      node,
      countOfChildren,
      this.moveHtmlElement
    ); // Move to the target node
  }

  handleDropzoneDragOver(e, dz) {
    e.preventDefault();
    dz.classList.add("active");
  }

  handleDropzoneDragLeave(e, dz) {
    dz.classList.remove("active");
  }

  handleDropzoneDrop(e, targetNode, position, dz) {
    e.preventDefault();
    let li = this.queryByNodeId("li", targetNode.id);
    let liParent = li.parentNode;
    let index = Array.from(liParent.children).indexOf(li);

    if (position === "after") {
      index += 1;
    }
    dz.classList.remove("active");
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === targetNode.id) return;

    let draggedNode = this.tree.findNodeById(draggedId);
    if (!draggedNode) return;

    this.tree.moveTo(
      draggedNode,
      targetNode.parent,
      index,
      this.moveHtmlElement
    );
  }

  handleToggleClick(e, node, li, childrenUl, icon) {
    e.stopPropagation();
    let f = function (node) {
      if (node.expanded) {
        childrenUl.classList.remove("collapsed");
        childrenUl.classList.add("expanded");
        icon.classList.remove("fa-chevron-right");
        icon.classList.add("fa-chevron-down");
        li.setAttribute("aria-expanded", true);
      } else {
        childrenUl.classList.remove("expanded");
        childrenUl.classList.add("collapsed");
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-right");
        li.setAttribute("aria-expanded", false);
      }
    };
    node.UpdateExpanded(!node.expanded, f);
  }

  addDragAndDropHandlers(div, node) {
    div.setAttribute("draggable", "true");
    div.addEventListener("dragstart", (e) => this.handleDragStart(e, node, div));
    div.addEventListener("dragend", (e) => this.handleDragEnd(e, div));
    div.addEventListener("dragover", (e) => this.handleDragOver(e, div));
    div.addEventListener("dragleave", (e) => this.handleDragLeave(e, div));
    div.addEventListener("drop", (e) => this.handleDropOnNode(e, node, div));
  }

  moveHtmlElement(addedNodeId, targetNodeId, position) {
    let sourceLi = this.queryByNodeId("li", addedNodeId);

    if (targetNodeId === null) {
      // Move to root level
      if (sourceLi) {
        let parentElement = sourceLi.parentNode;
        sourceLi.parentNode.removeChild(sourceLi);
        if (parentElement.children.length === 0) {
          let parentLi = parentElement.parentNode;
          parentLi.removeChild(parentElement);
          const div = parentLi.querySelector("div.item-content-wrapper");
          div.querySelector(".toggle-icon").classList.add("icon-transparent");
        }
        // use position to determine where to insert the sourceLi
        const rootUl = this.container.querySelector("ul");
        if (!rootUl) return; // No root UL found
        const refNode = rootUl.children[position] || null;
        rootUl.insertBefore(sourceLi, refNode);
      }
      return;
    }

    let targetLi = this.queryByNodeId("li", targetNodeId);

    if (!targetLi) return; // Target node not found
    let targetUl = targetLi.querySelector("ul");

    if (sourceLi) {
      let parentElement = sourceLi.parentNode;
      sourceLi.parentNode.removeChild(sourceLi);
      if (parentElement.children.length === 0) {
        let parentLi = parentElement.parentNode;
        parentLi.removeChild(parentElement);
        const div = parentLi.querySelector("div.item-content-wrapper");
        div.querySelector(".toggle-icon").classList.add("icon-transparent");
      }
    }

    if (!targetUl) {
      let node = this.tree.findNodeById(targetNodeId);
      targetUl = this.createChildrenUl(node, null);
      if (targetUl) {
        targetLi.appendChild(targetUl);
      }

      const div = targetLi.querySelector("div.item-content-wrapper");
      div.querySelector(".toggle-icon").remove();
      div.prepend(this.createToggle(node, targetLi, targetUl));
    }

    const refNode = targetUl.children[position] || null;

    targetUl.insertBefore(sourceLi, refNode);
    let node = this.tree.findNodeById(addedNodeId);
    node.updateCheckStateFromChildren(this.updateCheckboxState);
  }

  createDropzone(targetNode, position) {
    const dz = this.createElementWithClasses("div", "dropzone", position);
    dz.addEventListener("dragover", (e) => this.handleDropzoneDragOver(e, dz));
    dz.addEventListener("dragleave", (e) => this.handleDropzoneDragLeave(e, dz));
    dz.addEventListener("drop", (e) => this.handleDropzoneDrop(e, targetNode, position, dz));
    return dz;
  }

  createToggle(node, li, childrenUl) {
    const toggle = this.createElementWithClasses("span", "toggle-icon");
    const icon = this.createElementWithClasses("i");
    if (node.children?.length) {
      icon.classList.add("fas");
      icon.classList.add(
        node.expanded ? "fa-chevron-down" : "fa-chevron-right"
      );
      toggle.appendChild(icon);
      li.setAttribute("aria-expanded", node.expanded ?? false);

      toggle.onclick = (e) => this.handleToggleClick(e, node, li, childrenUl, icon);
    } else {
      toggle.classList.add("placeholder");
      icon.classList.add("fas", "fa-circle", "icon-transparent");
      toggle.appendChild(icon);
    }
    return toggle;
  }

  createChildrenUl(node, nodeToUl) {
    if (node.children.length > 0 ) { // 
      const childrenUl = this.createElementWithClasses("ul", "children-ul", node.expanded ? "expanded" : "collapsed");
      if (nodeToUl) {
        nodeToUl.set(node, childrenUl);
      }
      return childrenUl;
    }
    return null;
  }

  renderTreeWithTraversal() {
    const rootUl = this.createElementWithClasses("ul");
    this.tree.roots.forEach((rootNode) => {
      const nodeToUl = new Map();
      nodeToUl.set(rootNode, rootUl);

      rootNode.traverseDepthFirst((node) => {
        const li = this.createElementWithClasses("li");
        li.setAttribute("data-node-id", node.id);

        li.appendChild(this.createDropzone(node, "before"));

        const div = this.createElementWithClasses("div", "item-content-wrapper");

        this.addDragAndDropHandlers(div, node);

        const label = this.createElementWithClasses("label", "form-checkbox");

        const checkbox = this.createCheckbox(node);

        const customSpan = this.createElementWithClasses("span", "custom-checkbox");
        customSpan.setAttribute("data-node-id", node.id);

        label.appendChild(checkbox);
        label.appendChild(customSpan);

        div.appendChild(label);
        div.appendChild(this.createNodeLabel(node));
        li.appendChild(div);

        const childrenUl = this.createChildrenUl(node, nodeToUl);
        if (childrenUl) {
          li.appendChild(childrenUl);
        }

        div.prepend(this.createToggle(node, li, childrenUl));

        if (node.parent && nodeToUl.has(node.parent)) {
          nodeToUl.get(node.parent).appendChild(li);
        } else {
          rootUl.appendChild(li);
        }

        li.appendChild(this.createDropzone(node, "after"));
      });
    });
    this.container.appendChild(rootUl);
  }
}

export {HtmlTreeView};