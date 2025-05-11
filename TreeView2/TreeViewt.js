export class TreeView {
    constructor(container, tree, controller) {
      this.container = container;
      this.tree = tree;
      this.controller = controller;
      this.render();

      // this.tree.onNodeAdded(() => this.render());
      // this.tree.onNodeRemoved(() => this.render());
      this.tree.onNodeMoved((params) => this.moveElement(params));
      this.tree.onNodeChecked((params) => this.updateCheckState(params));
      this.tree.onNodeExpanded((params) => this.updateNodeExpanded(params));
      this.tree.onNodeIndeterminate((params) => this.updateCheckState(params));
    }



    createElementWithClasses(tag, ...classes) {
      const el = document.createElement(tag);
      if (classes.length) el.classList.add(...classes);
      return el;
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
        if (this.controller && typeof this.controller.onCheckboxChanged === "function") {
          this.controller.onCheckboxChanged(node.id, checkbox.checked);
        }
      });
  
      return checkbox;
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
  
        toggle.onclick = (e) => this.controller.toggleExpand(node.id);
      } else {
        toggle.classList.add("placeholder");
        icon.classList.add("fas", "fa-circle", "icon-transparent");
        toggle.appendChild(icon);
      }
      return toggle;
    }
    createChildrenUl(node) {
      if (node.children.length > 0 ) { // 
        const childrenUl = this.createElementWithClasses("ul", "children-ul", node.expanded ? "expanded" : "collapsed");
        return childrenUl;
      }
      return null;
    }

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
      this.controller.moveNode(draggedId, node.id, countOfChildren);
    }

    handleDropzoneDragOver(e, dz) {
      e.preventDefault();
      dz.classList.add("active");
    }
  
    handleDropzoneDragLeave(e, dz) {
      dz.classList.remove("active");
    }
    // Utility: Query element by node id and selector
    queryByNodeId(selector, nodeId) {
      return this.container.querySelector(`${selector}[data-node-id="${nodeId}"]`);
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
        index
      );
    }


    createDropzone(targetNode, position) {
      const dz = this.createElementWithClasses("div", "dropzone", position);
      dz.addEventListener("dragover", (e) => this.handleDropzoneDragOver(e, dz));
      dz.addEventListener("dragleave", (e) => this.handleDropzoneDragLeave(e, dz));
      dz.addEventListener("drop", (e) => this.handleDropzoneDrop(e, targetNode, position, dz));
      return dz;
    }
    
    addDragAndDropHandlers(div, node) {
      div.setAttribute("draggable", "true");
      div.addEventListener("dragstart", (e) => this.handleDragStart(e, node, div));
      div.addEventListener("dragend", (e) => this.handleDragEnd(e, div));
      div.addEventListener("dragover", (e) => this.handleDragOver(e, div));
      div.addEventListener("dragleave", (e) => this.handleDragLeave(e, div));
      div.addEventListener("drop", (e) => this.handleDropOnNode(e, node, div));
    }


    renderTreeNode(node, currentRootUl) {
      const li = this.createElementWithClasses("li");

      li.appendChild(this.createDropzone(node, "before"));
      li.setAttribute("data-node-id", node.id);

      const div = this.createElementWithClasses("div", "item-content-wrapper");
      const label = this.createElementWithClasses("label", "form-checkbox");
      const checkbox = this.createCheckbox(node);
      const customSpan = this.createElementWithClasses("span", "custom-checkbox")
      customSpan.setAttribute("data-node-id", node.id);
                              

      label.appendChild(checkbox);
      label.appendChild(customSpan);

      div.appendChild(label);
      div.appendChild(this.createNodeLabel(node));
      li.appendChild(div);
      li.appendChild(this.createDropzone(node, "after"));
      this.addDragAndDropHandlers(div, node);

      if(node.children.length > 0) {
        const childrenUl = this.createChildrenUl(node);
        li.appendChild(childrenUl);
        node.children.forEach((child) => {
          this.renderTreeNode(child, childrenUl);
        });
        div.prepend(this.createToggle(node, li, childrenUl));
      } else {
        div.prepend(this.createToggle(node, li ));
      }

      currentRootUl.appendChild(li);
    }

    render() {
      //this.container.innerHTML = '';
      const rootUl = document.createElement('ul');
      this.tree.roots.forEach((rootNode) => {
          this.renderTreeNode(rootNode, rootUl);
      });
      this.container.appendChild(rootUl);
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

    updateCheckState({ node, checked }) {
      // Find the checkbox for this node and update its state
      const checkbox = this.container.querySelector(`input[type="checkbox"][data-node-id="${node.id}"]`);
      if (checkbox) {
        checkbox.checked = checked;
        checkbox.indeterminate = node.isIntermediate();
      }
    }

    updateNodeExpanded({ node, expanded }) {
      const li = this.container.querySelector(`li[data-node-id="${node.id}"]`);
      if (!li) return;

      // Update aria-expanded attribute
      li.setAttribute("aria-expanded", expanded);

      // Find the children <ul> and update its class
      const childrenUl = li.querySelector("ul.children-ul");
      if (childrenUl) {
        childrenUl.classList.toggle("expanded", expanded);
        childrenUl.classList.toggle("collapsed", !expanded);
      }

      // Update the toggle icon
      const toggleIcon = li.querySelector(".toggle-icon > i");
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-chevron-down", "fa-chevron-right");
        toggleIcon.classList.add(expanded ? "fa-chevron-down" : "fa-chevron-right");
      }
    }


    moveElement({ node, newParent, position }) {
      const li = this.container.querySelector(`li[data-node-id="${node.id}"]`);
      if (!li) return;

      // Remove the node from its current position
      const currentUl = li.parentNode;
      currentUl.removeChild(li);
      if (currentUl.children.length === 0) {
        // update the toggle icon of the parent node
        const parentLi = currentUl.parentNode;
        const toggleIcon = parentLi.querySelector(".toggle-icon > i");
        if (toggleIcon) {
          toggleIcon.classList.add("fa-circle", "icon-transparent");
        }
        const childrenUl = parentLi.querySelector("ul.children-ul");
        if (childrenUl) {
          childrenUl.parentNode.removeChild(childrenUl);
        }

      }

      // Find the new parent <ul>
      let newParentUl;
      if (newParent) {
        newParentUl = this.container.querySelector(`li[data-node-id="${newParent.id}"] > ul`);
        if (!newParentUl) {
          newParentUl = document.createElement("ul");
          newParentUl.classList.add("children-ul");
          this.container.querySelector(`li[data-node-id="${newParent.id}"]`).appendChild(newParentUl);
          // get the toggle icon of the parent node
          const parentLi = this.container.querySelector(`li[data-node-id="${newParent.id}"]`);
          const toggleIcon = parentLi.querySelector(".toggle-icon > i");
          if (toggleIcon) {
            toggleIcon.classList.remove("fa-chevron-right");
            toggleIcon.classList.remove("icon-transparent");
            toggleIcon.classList.add("fa-chevron-down");
            // add the event listener to the toggle icon
            toggleIcon.onclick = (e) => this.controller.toggleExpand(newParent.id);
            // 
          }
        }
      } else {
        newParentUl = this.container.querySelector("ul");
      }

      // Insert the node at the specified position
      if (position < 0 || position >= newParentUl.children.length) {
        newParentUl.appendChild(li);
      } else {
        newParentUl.insertBefore(li, newParentUl.children[position]);
      }
    }
    

  }