// sideMenu.test.js

/**
 * @jest-environment jsdom
 */


describe('sideMenu', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = `
    <body>
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
        <li data-title="Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>
          <span>Dashboard</span>
        </li>
        <li data-title="Profile">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5.6 1.3 6 4v2H6v-2c.4-2.7 3.3-4 6-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/></svg>
          <span>Profile</span>
        </li>
        <li data-title="Messages">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          <span>Messages</span>
        </li>
        <li data-title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8-5H4a2 2 0 00-2 2v14l4-4h12a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
          <span>Settings</span>
        </li>
        <li data-title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm4-10H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
          <span>Logout</span>
        </li>
      </ul>
    </div>

    <div class="content" id="content">
      <h2>Responsive Page</h2>
      <p>This is the main content area.</p>
    </div>
  </div>

</body>
</html>`
    // Reset the module cache to ensure a fresh state for each test
    jest.resetModules();
    // Re-require the module after resetting the cache
    require('./sideMenu');
  });

  test('should toggle classes on click', () => {
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Initial state
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(content.classList.contains('collapsed')).toBe(false);
    expect(content.classList.contains('shifted')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(false);

    // Simulate click
    burger.click();

    // State after click
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('shifted')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(true);

    // Simulate another click
    burger.click();

    // State after second click
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(content.classList.contains('collapsed')).toBe(false);
    expect(content.classList.contains('shifted')).toBe(true);
    expect(burger.classList.contains('closed')).toBe(false);
  });

  test('should handle large screen', () => {
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Mock window.innerWidth to simulate a large screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Simulate click
    burger.click();

    // State after click
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('shifted')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(true);
  });

  test('should handle small screen', () => {
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Mock window.innerWidth to simulate a small screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700,
    });

    // Simulate click
    burger.click();

    // State after click
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('collapsed')).toBe(true);
    expect(content.classList.contains('shifted')).toBe(false);
    expect(burger.classList.contains('closed')).toBe(true);
  });
});
