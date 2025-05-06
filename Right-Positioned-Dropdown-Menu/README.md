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

## Sample Usage

Here is a sample usage demonstrating how to use the right-positioned dropdown menu in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navbar with Animated Multilevel Dropdown</title>
    <style>

/* --- PASTE THIS CSS OVER THE PREVIOUS <style> block --- */

    body {
    margin: 0;
    font-family: sans-serif;
    background-color: #f4f4f4;
}

.navbar {
    background-color: #333;
    color: white;
    padding: 0 1rem;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    min-height: 60px;
}

.navbar-brand {
        color: var(--navbar-brand-color);
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: bold;
        transition: color 0.3s ease; /* Add smooth transition */
    }

.navbar-nav {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
}

.nav-item {
    position: relative;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 1rem;
    display: block;
    transition: background-color 0.2s ease;
}

.nav-link:hover,
.nav-item:hover > .nav-link:not(.dropdown-toggle) {
     background-color: #555;
}



.navbar {
        background-color: var(--navbar-bg);
        color: var(--navbar-text);
    }
    .nav-link {
        color: var(--navbar-text);
    }
    .nav-link:hover,
    .nav-item:hover > .nav-link:not(.dropdown-toggle) {
        background-color: var(--nav-link-hover-bg);
    }
    .theme-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        padding: 1rem;
        color: inherit;
    }
</style>

    <link rel="stylesheet" href="dropdown.css">
</head>
<body>

<nav class="navbar">
    <div class="navbar-container">
        <a href="#home" class="navbar-brand">MyApp</a>
        <ul class="navbar-nav">
            <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
            <li class="nav-item dropdown">
                <a id="about-toggle" href="#" class="nav-link dropdown-toggle top-toggle">About<span class="arrow">&#9660;</span></a>
                <ul class="dropdown-menu">
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#team">Our Team</a></li>
                    <li><a href="#history">History</a></li>
                    <li><a href="#mission">Mission & Vision</a></li>
                </ul>
            </li>
            <li class="nav-item"><a href="#services" class="nav-link">Services</a></li>
        
            <li class="nav-item dropdown dropdown-right">
                <a id="account-toggle" href="#" class="nav-link dropdown-toggle top-toggle">Account<span class="arrow">&#9660;</span></a>
                <ul class="dropdown-menu">
                    <li><a href="#">Profile</a></li>
                    <li><a href="#">Settings</a></li>
                    <li class="dropdown-submenu">
                        <a id="more-options-toggle" href="#" class="dropdown-toggle submenu-toggle">More Options<span class="arrow">&#9654;</span></a>
                        <ul class="dropdown-menu submenu">
                            <li><a href="#">Option 3.1</a></li>
                            <li><a href="#">Option 3.2</a></li>
                            <li class="dropdown-submenu">
                                <a id="deeper-toggle" href="#" class="dropdown-toggle submenu-toggle">Deeper<span class="arrow">&#9654;</span></a>
                                <ul class="dropdown-menu submenu">
                                    <li><a href="#">Level 3.1</a></li>
                                    <li><a href="#">Level 3.2</a></li>
                                    <li class="dropdown-submenu">
                                        <a id="deeper-toggle-level3.3" href="#" class="dropdown-toggle submenu-toggle">Deeper Level 3.3<span class="arrow">&#9654;</span></a>
                                        <ul class="dropdown-menu submenu">
                                            <li><a href="#">Level 3.3.1</a></li>
                                            <li><a href="#">Level 3.3.2</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><a href="#">Option 3.3</a></li>
                            <li class="dropdown-submenu">
                                <a id="deeper2-toggle" href="#" class="dropdown-toggle submenu-toggle">Deeper 2<span class="arrow">&#9654;</span></a>
                                <ul class="dropdown-menu submenu">
                                    <li><a href="#">Level 3.1</a></li>
                                    <li><a href="#">Level 3.2</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </li>
        </ul>
        
    </div>
</nav>

<main style="padding: 20px; height: 500px;">
    <h1>Page Content</h1>
    <p>Scroll down or resize window to see navbar behavior.</p>
    <p>Dropdown menus should now animate their height.</p>
</main>

<script src="dropdown.js"></script>
</body>
</html>
```
