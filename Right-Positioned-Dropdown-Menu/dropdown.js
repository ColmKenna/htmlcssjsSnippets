// dropdown.js

// --- Constants ---
const CLASS_SHOW = 'show';
const CLASS_ROTATE = 'rotate';
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_TOP_TOGGLE = '.top-toggle';
const SELECTOR_SUBMENU_CONTAINER = '.dropdown-menu.submenu';
const SELECTOR_SUBMENU_ITEM = '.dropdown-submenu';
const SELECTOR_SUBMENU_TOGGLE = '.submenu-toggle';
const SELECTOR_SUBMENU_ITEM_TOGGLE = `${SELECTOR_SUBMENU_ITEM} > ${SELECTOR_SUBMENU_TOGGLE}`;

// --- Helper Functions ---

/**
 * Helper function to determine if an element should be opened or closed.
 * @param {HTMLElement} element - The element to check.
 * @param {string} showClass - The class indicating the element is open.
 * @returns {boolean} - True if the element should be opened, false otherwise.
 */
function shouldOpenElement(element, showClass) {
    return !element.classList.contains(showClass);
}

/**
 * Closes a specific element (dropdown or submenu) and resets its toggle.
 * Also closes all nested submenus within the element.
 * @param {HTMLElement} element - The element (.dropdown or .dropdown-menu.submenu) to close.
 */
function closeElementAndChildren(element) {
    if (!element) return;

    // Internal helper to find the toggle for an element
    function findToggleForElement(el) {
        if (el.matches(SELECTOR_DROPDOWN)) {
            return el.querySelector(SELECTOR_TOP_TOGGLE);
        } else if (el.matches(SELECTOR_SUBMENU_CONTAINER)) {
            const parentLi = el.closest(SELECTOR_SUBMENU_ITEM);
            return parentLi ? parentLi.querySelector(SELECTOR_SUBMENU_TOGGLE) : null;
        }
        return null;
    }

    // Close the element itself
    element.classList.remove(CLASS_SHOW);
    const toggle = findToggleForElement(element);
    if (toggle) {
        toggle.classList.remove(CLASS_ROTATE);
    }

    // Close all descendant submenus and their toggles within this element
    element.querySelectorAll(`${SELECTOR_SUBMENU_CONTAINER}.${CLASS_SHOW}`).forEach(submenu => {
        submenu.classList.remove(CLASS_SHOW);
        const subToggle = findToggleForElement(submenu);
        if (subToggle) {
            subToggle.classList.remove(CLASS_ROTATE);
        }
    });
}

/**
 * Closes all open sibling submenus relative to a given submenu item LI.
 * @param {HTMLElement} currentSubmenuLi - The LI whose siblings should be checked.
 */
function closeSiblingSubmenus(currentSubmenuLi) {
    const parentUl = currentSubmenuLi.parentElement;
    if (!parentUl) return;

    Array.from(parentUl.children)
        .filter(siblingLi => siblingLi !== currentSubmenuLi && siblingLi.matches(SELECTOR_SUBMENU_ITEM))
        .forEach(siblingLi => {
            const submenuToClose = siblingLi.querySelector(SELECTOR_SUBMENU_CONTAINER);
            if (submenuToClose && submenuToClose.classList.contains(CLASS_SHOW)) {
                closeElementAndChildren(submenuToClose);
            }
        });
}

// --- Core Closing Logic ---

/**
 * Closes all open dropdowns and submenus globally.
 */
function closeAllDropdowns() {
    // Close all top-level dropdowns (which will also close their children via closeElementAndChildren)
    document.querySelectorAll(`${SELECTOR_DROPDOWN}.${CLASS_SHOW}`).forEach(closeElementAndChildren);
    // Close any potentially orphaned open submenus (shouldn't happen with good logic, but safe)
    document.querySelectorAll(`${SELECTOR_SUBMENU_CONTAINER}.${CLASS_SHOW}`).forEach(closeElementAndChildren);
}

// --- Document Level Event Handlers ---

/**
 * Closes all dropdowns if a click occurs outside any dropdown element.
 * @param {MouseEvent} e - The click event.
 */
function handleClickOutside(e) {
    if (!e.target.closest(SELECTOR_DROPDOWN)) {
        closeAllDropdowns();
    }
}

/**
 * Closes all dropdowns when the Escape key is pressed.
 * @param {KeyboardEvent} e - The keydown event.
 */
function handleEscapeKey(e) {
    if (e.key === "Escape") {
        closeAllDropdowns();
    }
}

// --- Toggle Event Handler Logic ---

/**
 * Handles clicks on top-level dropdown toggles (.top-toggle).
 * @param {MouseEvent} e - The click event.
 */
function handleTopToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const toggle = this;
    const parentDropdown = toggle.closest(SELECTOR_DROPDOWN);
    if (!parentDropdown) {
        console.error("Could not find parent .dropdown for toggle:", toggle);
        return;
    }

    const shouldOpen = shouldOpenElement(parentDropdown, CLASS_SHOW);

    // Close other *main* dropdowns first *before* potentially opening the new one.
    document.querySelectorAll(`${SELECTOR_DROPDOWN}.${CLASS_SHOW}`).forEach(otherDropdown => {
        if (otherDropdown !== parentDropdown) {
            closeElementAndChildren(otherDropdown);
        }
    });

    // Toggle the current dropdown's state
    parentDropdown.classList.toggle(CLASS_SHOW, shouldOpen);
    toggle.classList.toggle(CLASS_ROTATE, shouldOpen);

    // If we just closed this dropdown, ensure children are closed.
    if (!shouldOpen) {
        closeElementAndChildren(parentDropdown);
    }
}

/**
 * Handles clicks on submenu toggles (.submenu-toggle).
 * @param {MouseEvent} e - The click event.
 */
function handleSubmenuToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const toggle = this;
    const parentLi = toggle.closest(SELECTOR_SUBMENU_ITEM);
    const submenu = parentLi ? parentLi.querySelector(SELECTOR_SUBMENU_CONTAINER) : null;

    if (!parentLi || !submenu) {
        console.error("Submenu toggle handler structure error. Could not find parent LI or submenu container for:", toggle);
        return;
    }

    const shouldOpen = shouldOpenElement(submenu, CLASS_SHOW);

    // Close sibling submenus *before* opening this one.
    closeSiblingSubmenus(parentLi);

    // Toggle this submenu's state
    submenu.classList.toggle(CLASS_SHOW, shouldOpen);
    toggle.classList.toggle(CLASS_ROTATE, shouldOpen);

    // If we just *closed* this submenu, ensure its children are closed.
    if (!shouldOpen) {
        closeElementAndChildren(submenu);
    }
}

// --- Initialization Function ---

/**
 * Attaches all necessary event listeners for dropdown functionality.
 * Removes existing listeners first to prevent duplicates on re-initialization.
 */
function initializeDropdowns() {
    console.log("Initializing dropdowns...");

    // --- Remove Old Listeners (Robustness) ---
    document.querySelectorAll(SELECTOR_TOP_TOGGLE).forEach(toggle => {
        toggle.removeEventListener('click', handleTopToggleClick);
    });
    document.querySelectorAll(SELECTOR_SUBMENU_ITEM_TOGGLE).forEach(toggle => {
        toggle.removeEventListener('click', handleSubmenuToggleClick);
    });
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscapeKey);

    // --- Attach Toggle Listeners ---
    document.querySelectorAll(SELECTOR_TOP_TOGGLE).forEach(toggle => {
        toggle.addEventListener('click', handleTopToggleClick);
    });
    document.querySelectorAll(SELECTOR_SUBMENU_ITEM_TOGGLE).forEach(toggle => {
        toggle.addEventListener('click', handleSubmenuToggleClick);
    });

    // --- Attach Document-Level Listeners ---
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    console.log("Dropdowns initialized.");
}

// --- Script Entry Point ---

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDropdowns);
} else {
    initializeDropdowns();
}

// --- Exports for Testing (CommonJS module format) ---
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core Logic
        closeAllDropdowns,
        closeElementAndChildren,
        closeSiblingSubmenus,
        // Document Handlers
        handleClickOutside,
        handleEscapeKey,
        // Toggle Handlers
        handleTopToggleClick,
        handleSubmenuToggleClick,
        // Initializer
        initializeDropdowns,
    };
}
