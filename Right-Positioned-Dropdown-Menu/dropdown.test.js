/**
 * @jest-environment jsdom
 */

// Import the refactored functions, including the initializer
const {
    initializeDropdowns,
    closeAllDropdowns,
} = require('./dropdown');

// Helper function to set up the HTML structure (same as before)
const setupHTML = () => {
    document.body.innerHTML = `
<nav class="navbar">
    <div class="navbar-container">
        <a href="#home" class="navbar-brand">MyApp</a>
        <ul class="navbar-nav">
            <li class="nav-item">
                <button id="theme-toggle" class="nav-link theme-toggle">🌙</button>
            </li>
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
    <main><h1>Page Content</h1></main>
  `;
    // *** No manual event listener additions here! ***
};

// Centralized selectors (DOM elements)
const selectors = {};

const initializeSelectors = () => {
    selectors.aboutToggle = document.getElementById('about-toggle');
    selectors.accountToggle = document.getElementById('account-toggle');
    selectors.moreOptionsToggle = document.getElementById('more-options-toggle');
    selectors.deeperToggle = document.getElementById('deeper-toggle');
    selectors.deeperToggleLevel3_3 = document.getElementById('deeper-toggle-level3.3');
    selectors.deeper2Toggle = document.getElementById('deeper2-toggle');
};

// Helper function to check if a dropdown is open
const isDropdownOpen = (toggleElement) => {
    expect(toggleElement.classList.contains('rotate')).toBe(true);
    expect(toggleElement.closest('li').classList.contains('show')).toBe(true);
};

// Helper function to check if a dropdown is closed
const isDropdownClosed = (toggleElement) => {
    expect(toggleElement.classList.contains('rotate')).toBe(false);
    expect(toggleElement.closest('li').classList.contains('show')).toBe(false);
};

// Helper function to check if a submenu is open
const isSubmenuOpen = (submenuElement, toggleElement) => {
    expect(submenuElement.classList.contains('show')).toBe(true);
    expect(toggleElement.classList.contains('rotate')).toBe(true);
};

// Helper function to check if a submenu is closed
const isSubmenuClosed = (submenuElement, toggleElement) => {
    expect(submenuElement.classList.contains('show')).toBe(false);
    expect(toggleElement.classList.contains('rotate')).toBe(false);
};

// Helper function to check if all dropdowns are closed
const areAllDropdownsClosed = (dropdownToggles) => {
    dropdownToggles.forEach((toggle) => {
        isDropdownClosed(toggle);
    });
};

// Helper function to check if all submenus are closed
const areAllSubmenusClosed = (submenuElements) => {
    submenuElements.forEach((submenu) => {
        expect(submenu.classList.contains('show')).toBe(false);
    });
};

describe('Dropdown Functionality', () => {
    beforeEach(() => {
        // Set up fresh HTML before each test
        setupHTML();
        // Initialize the selectors after the HTML is set up
        initializeSelectors();
        // *** Call the initializer to attach listeners from dropdown.js ***
        initializeDropdowns();
    });
    afterEach(() => {
        document.body.innerHTML = '';
        // Crucially reset the module cache after each test
        jest.resetModules();
    });

    // test that clicking on the top-level dropdown toggles the dropdown menu use id about-toggle
    test('Clicking top-level dropdown toggles the menu', () => {
        const aboutToggle = selectors.aboutToggle;
        // Simulate a click on the toggle
        aboutToggle.click();

        // Check if the dropdown menu is now visible
        isDropdownOpen(aboutToggle);

        // Click again to close it
        aboutToggle.click();

        // Check if the dropdown menu is now hidden
        isDropdownClosed(aboutToggle);
    });

    test('Clicking on another top-level dropdown closes the first one', () => {
      const aboutToggle = selectors.aboutToggle;
      const accountToggle = selectors.accountToggle;
      const aboutLi = aboutToggle.closest('li');
      const accountLi = accountToggle.closest('li');

      // Open the About dropdown
      aboutToggle.click();
      isDropdownOpen(aboutToggle);

      // Click on the Account dropdown
      accountToggle.click();

      // Check if the Account dropdown is open and About is closed
      isDropdownOpen(accountToggle);
      isDropdownClosed(aboutToggle);
  });

    test('Clicking submenu toggles the submenu', () => {
        const moreOptionsToggle = selectors.moreOptionsToggle;
        const submenu = moreOptionsToggle.nextElementSibling;

        // Simulate a click on the submenu toggle
        moreOptionsToggle.click();

        // Check if the submenu is now visible
        isSubmenuOpen(submenu, moreOptionsToggle);

        // Click again to close it
        moreOptionsToggle.click();

        // Check if the submenu is now hidden
        isSubmenuClosed(submenu, moreOptionsToggle);
    });

    test('Clicking submenu closes other open submenus', () => {

        // account-toggle
        const accountToggle = selectors.accountToggle;

        const moreOptionsToggle = selectors.moreOptionsToggle;

        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;

        const deeper2Toggle = selectors.deeper2Toggle;
        const deeper2UL = deeper2Toggle.nextElementSibling;


        // Open the Account dropdown
        accountToggle.click();

        // Open the first submenu
        moreOptionsToggle.click();

        // Open the second submenu
        deeperToggle.click();
        isSubmenuOpen(deeperUL, deeperToggle);
        // Check if the second submenu is open
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Click on the second submenu toggle
        deeper2Toggle.click();
        // Check if the second submenu is now open
        isSubmenuOpen(deeper2UL, deeper2Toggle);
        // Check if the first submenu is closed
        isSubmenuClosed(deeperUL, deeperToggle);

    });

    test('Clicking submenu closes other open submenus and their children', () => {

        // account-toggle
        const accountToggle = selectors.accountToggle;

        const moreOptionsToggle = selectors.moreOptionsToggle;

        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;
        //deeper-toggle-level3.3
        const deeperToggleLevel3_3 = selectors.deeperToggleLevel3_3;
        const deeperULLevel3_3 = deeperToggleLevel3_3.nextElementSibling;

        const deeper2Toggle = selectors.deeper2Toggle;
        const deeper2UL = deeper2Toggle.nextElementSibling;

        // Open the Account dropdown
        accountToggle.click();
        // Open the first submenu
        moreOptionsToggle.click();
        // Open the second submenu
        deeperToggle.click();
        deeperToggleLevel3_3.click();

        isSubmenuOpen(deeperULLevel3_3, deeperToggleLevel3_3);
        // Check if the second submenu is open
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Click on the second submenu toggle
        deeper2Toggle.click();
        // Check if the second submenu is now open
        isSubmenuOpen(deeper2UL, deeper2Toggle);
        // Check if the first submenu is closed
        isSubmenuClosed(deeperUL, deeperToggle);
        // Check if the deeper submenu is closed
        isSubmenuClosed(deeperULLevel3_3, deeperToggleLevel3_3);
        // Check if the Account dropdown is still open
        isDropdownOpen(accountToggle);
    });

    test('Clicking root menu closes other open menus and their children', () => {

        //about-toggle
        const aboutToggle = selectors.aboutToggle;
        const aboutLi = aboutToggle.closest('li');
        // account-toggle
        const accountToggle = selectors.accountToggle;

        const moreOptionsToggle = selectors.moreOptionsToggle;

        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;
        //deeper-toggle-level3.3
        const deeperToggleLevel3_3 = selectors.deeperToggleLevel3_3;
        const deeperULLevel3_3 = deeperToggleLevel3_3.nextElementSibling;

        const deeper2Toggle = selectors.deeper2Toggle;
        const deeper2UL = deeper2Toggle.nextElementSibling;

        // Open the Account dropdown
        accountToggle.click();
        // Open the first submenu
        moreOptionsToggle.click();
        // Open the second submenu
        deeperToggle.click();
        deeperToggleLevel3_3.click();
        isSubmenuOpen(deeperULLevel3_3, deeperToggleLevel3_3);
        // Check if the second submenu is open
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Click on the root menu toggle
        aboutToggle.click();
        // Check if the first submenu is now closed
        isSubmenuClosed(deeperUL, deeperToggle);
        // Check if the deeper submenu is closed
        isSubmenuClosed(deeperULLevel3_3, deeperToggleLevel3_3);
        // Check if the second submenu is closed
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Check if the Account dropdown is closed
        isDropdownClosed(accountToggle);
        // Check if the About dropdown is open
        isDropdownOpen(aboutToggle);

    });

    test('Clicking on a parent submenu closes its child submenus', () => {
        const accountToggle = selectors.accountToggle;
        const moreOptionsToggle = selectors.moreOptionsToggle;
        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;
        const deeper2Toggle = selectors.deeper2Toggle;
        const deeper2UL = deeper2Toggle.nextElementSibling;
        // Open the Account dropdown
        accountToggle.click();
        // Open the first submenu
        moreOptionsToggle.click();
        // Open the second submenu
        deeperToggle.click();
        isSubmenuOpen(deeperUL, deeperToggle);
        // Check if the second submenu is open
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Click on the parent submenu toggle
        moreOptionsToggle.click();
        // Check if the first submenu is now closed
        isSubmenuClosed(deeperUL, deeperToggle);
        // Check if the second submenu is closed
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Check if the Account dropdown is still open
        isDropdownOpen(accountToggle);
    }
    );

    test('Clicking on a root menu closes its child submenus', () => {
        const accountToggle = selectors.accountToggle;
        const moreOptionsToggle = selectors.moreOptionsToggle;
        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;
        const deeper2Toggle = selectors.deeper2Toggle;
        const deeper2UL = deeper2Toggle.nextElementSibling;
        // Open the Account dropdown
        accountToggle.click();
        // Open the first submenu
        moreOptionsToggle.click();
        // Open the second submenu
        deeperToggle.click();
        isSubmenuOpen(deeperUL, deeperToggle);
        // Check if the second submenu is open
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Click on the root menu toggle
        accountToggle.click();
        // Check if the first submenu is now closed
        isSubmenuClosed(deeperUL, deeperToggle);
        // Check if the second submenu is closed
        isSubmenuClosed(deeper2UL, deeper2Toggle);
        // Check if the Account dropdown is still open
        isDropdownClosed(accountToggle);
    }
    );

    test('Clicking outside closes all dropdowns', () => {
        const accountToggle = selectors.accountToggle;
        const moreOptionsToggle = selectors.moreOptionsToggle;
        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;

        accountToggle.click(); // Open the Account dropdown
        moreOptionsToggle.click(); // Open the More Options submenu
        deeperToggle.click(); // Open the Deeper submenu

        // Check if all dropdowns are open
        isDropdownOpen(accountToggle);
        isSubmenuOpen(moreOptionsToggle.nextElementSibling, moreOptionsToggle);
        isSubmenuOpen(deeperUL, deeperToggle);
        // Simulate a click outside the dropdowns
        document.body.click();
        // Check if all dropdowns are closed
        areAllDropdownsClosed([accountToggle]);
        areAllSubmenusClosed([moreOptionsToggle.nextElementSibling, deeperUL]);

    });

    test('Pressing Escape closes all dropdowns', () => {
        const accountToggle = selectors.accountToggle;
        const moreOptionsToggle = selectors.moreOptionsToggle;
        const deeperToggle = selectors.deeperToggle;
        const deeperUL = deeperToggle.nextElementSibling;

        accountToggle.click(); // Open the Account dropdown
        moreOptionsToggle.click(); // Open the More Options submenu
        deeperToggle.click(); // Open the Deeper submenu

        // Check if all dropdowns are open
        isDropdownOpen(accountToggle);
        isSubmenuOpen(moreOptionsToggle.nextElementSibling, moreOptionsToggle);
        isSubmenuOpen(deeperUL, deeperToggle);

        // Simulate pressing Escape
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        // Check if all dropdowns are closed
        areAllDropdownsClosed([accountToggle]);
        areAllSubmenusClosed([moreOptionsToggle.nextElementSibling, deeperUL]);
    }
    );




});
