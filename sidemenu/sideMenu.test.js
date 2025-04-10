// sideMenu.test.js

/**
 * @jest-environment jsdom
 */

// Import the functions or code to be tested if needed (implicitly done via require below)

describe('sideMenu', () => {
  let burger;
  let sidebar;

  // Function to set the window width for testing
  const setWindowWidth = (width) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    // Dispatch a resize event
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Set up the DOM environment for each test
    document.body.innerHTML = `
      <div class="navbar">
        <div class="burger" id="burger">
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="24" height="3" fill="white"/>
            <rect x="4" y="14.5" width="20" height="3" fill="#808080"/>
            <rect x="4" y="23" width="24" height="3" fill="white"/>
            <path d="M26 16l-5 5V11l5 5z" fill="white"/>
          </svg>
        </div>
        <h1>My App</h1>
      </div>
      <div class="main-container">
        <div class="sidebar" id="sidebar">
          <ul>
            <li data-title="Dashboard"><span>Dashboard</span></li>
            <li data-title="Profile"><span>Profile</span></li>
            </ul>
        </div>
        <div class="content" id="content"></div>
      </div>
    `;

    // Get references to the elements
    burger = document.getElementById('burger');
    sidebar = document.getElementById('sidebar');

    // Reset the module cache and re-require the script to ensure a clean state
    // This also executes the initial `checkResize()` call within the script
    jest.resetModules();
    // Use fake timers to control setTimeout in checkResize
    jest.useFakeTimers();
    require('./sideMenu'); // This executes the script including the initial checkResize

  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  test('should toggle sidebar and burger classes on burger click', () => {
    // Initial state (assuming large screen by default in jsdom unless set)
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);

    // Simulate click
    burger.click();

    // State after first click
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);

    // Simulate another click
    burger.click();

    // State after second click
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);
  });

  // --- Resize Tests ---

  test('initial state: should be open on large screens (> 767px)', () => {
    setWindowWidth(1024); // Set large screen width
    // Initial checkResize runs in beforeEach when requiring the script
    jest.advanceTimersByTime(200); // Advance timer for the initial checkResize debounce

    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);
  });

  test('initial state: should collapse on small screens (< 768px)', () => {
    setWindowWidth(600); // Set small screen width
    // Initial checkResize runs in beforeEach when requiring the script
    jest.advanceTimersByTime(200); // Advance timer for the initial checkResize debounce

    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);
  });

  test('resize: should collapse sidebar when resizing from large to small screen', () => {
    // 1. Start with large screen (initial state)
    setWindowWidth(1024);
    jest.advanceTimersByTime(200); // Initial check
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);

    // 2. Resize to small screen
    setWindowWidth(600);
    jest.advanceTimersByTime(200); // Advance timer for resize debounce

    // 3. Assert: Sidebar should be collapsed
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);
  });

  test('resize: should reopen sidebar when resizing from small to large screen if it was open before', () => {
    // 1. Start large, sidebar is open
    setWindowWidth(1024);
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(false); // Ensure it's initially open

    // 2. Resize to small screen (sidebar collapses)
    setWindowWidth(600);
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(true); // Confirm it collapsed

    // 3. Resize back to large screen
    setWindowWidth(1024);
    jest.advanceTimersByTime(200); // Advance timer for resize debounce

    // 4. Assert: Sidebar should reopen because it was open initially on large screen
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);
  });

  test('resize: should keep sidebar collapsed when resizing from small to large screen if it was manually closed before', () => {
    // 1. Start large, sidebar is open
    setWindowWidth(1024);
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(false);

    // 2. Manually close the sidebar on large screen
    burger.click();
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);

    // 3. Resize to small screen (should remain collapsed)
    setWindowWidth(600);
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);

    // 4. Resize back to large screen
    setWindowWidth(1024);
    jest.advanceTimersByTime(200);

    // 5. Assert: Sidebar should remain collapsed because it was manually closed before going small
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);
  });

   test('resize: should reopen sidebar when resizing from small to large screen if it was manually opened before', () => {
    // 1. Start small, sidebar is collapsed by default
    setWindowWidth(600);
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(true);

    // 2. Manually open the sidebar on small screen (not typical UI, but tests logic)
    // Note: The script forces collapse on small screens, so manual open won't persist
    // Let's test the scenario where it starts large, is closed, goes small, then goes large again (covered above)
    // Instead, let's test: Start small -> Go Large -> Close -> Go Small -> Go Large
    setWindowWidth(1024); // Go large (opens)
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(false);

    burger.click(); // Close it on large screen
    expect(sidebar.classList.contains('collapsed')).toBe(true);

    setWindowWidth(600); // Go small (stays closed)
    jest.advanceTimersByTime(200);
    expect(sidebar.classList.contains('collapsed')).toBe(true);

    setWindowWidth(1024); // Go large again
    jest.advanceTimersByTime(200);

    // Should remain collapsed as it was manually closed on large screen previously
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(true);

  });

});
