# Right-Positioned-Dropdown-Menu

## dropdown.js

The `dropdown.js` file handles the interactions for a right-positioned dropdown menu. It includes the following functionalities:

- **Constants**: Defines constants for class names and selectors used in the dropdown functionality.
- **Helper Functions**:
  - `shouldOpenElement(element, showClass)`: Determines if an element should be opened or closed.
  - `closeElementAndChildren(element)`: Closes a specific element and resets its toggle, also closes all nested submenus within the element.
  - `closeSiblingSubmenus(currentSubmenuLi)`: Closes all open sibling submenus relative to a given submenu item.
- **Core Closing Logic**:
  - `closeAllDropdowns()`: Closes all open dropdowns and submenus globally.
- **Document Level Event Handlers**:
  - `handleClickOutside(e)`: Closes all dropdowns if a click occurs outside any dropdown element.
  - `handleEscapeKey(e)`: Closes all dropdowns when the Escape key is pressed.
- **Toggle Event Handler Logic**:
  - `handleTopToggleClick(e)`: Handles clicks on top-level dropdown toggles.
  - `handleSubmenuToggleClick(e)`: Handles clicks on submenu toggles.
- **Initialization Function**:
  - `initializeDropdowns()`: Attaches all necessary event listeners for dropdown functionality and removes existing listeners first to prevent duplicates on re-initialization.
- **Script Entry Point**: Initializes the dropdowns when the DOM is fully loaded.
- **Exports for Testing**: Exports core logic, document handlers, toggle handlers, and initializer for testing purposes.

## dropdown.test.js

The `dropdown.test.js` file tests the interactions for the right-positioned dropdown menu. It includes the following test cases:

- **Setup**: Sets up the HTML structure and initializes the dropdown functionality before each test.
- **Top-Level Dropdown**:
  - Tests that clicking on the top-level dropdown toggles the dropdown menu.
  - Tests that clicking on another top-level dropdown closes the first one.
- **Submenu**:
  - Tests that clicking on a submenu toggles the submenu.
  - Tests that clicking on a submenu closes other open submenus.
  - Tests that clicking on a submenu closes other open submenus and their children.
- **Root Menu**:
  - Tests that clicking on a root menu closes other open menus and their children.
  - Tests that clicking on a parent submenu closes its child submenus.
  - Tests that clicking on a root menu closes its child submenus.
- **Outside Click and Escape Key**:
  - Tests that clicking outside closes all dropdowns.
  - Tests that pressing Escape closes all dropdowns.
