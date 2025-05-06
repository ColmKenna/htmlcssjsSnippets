# Sidebar Component

## sideMenu.js

The `sideMenu.js` file handles sidebar interactions. It provides the following functionality:

- Toggles the sidebar's collapsed state when the burger icon is clicked.
- Adjusts the sidebar's state based on the window size to ensure responsiveness.
- Maintains the sidebar's state across window resizes.

## sideMenu.test.js

The `sideMenu.test.js` file tests the sidebar interactions. The tests cover the following scenarios:

- Toggling the sidebar's collapsed state when the burger icon is clicked.
- Ensuring the sidebar is open on large screens (> 767px) initially.
- Ensuring the sidebar is collapsed on small screens (< 768px) initially.
- Collapsing the sidebar when resizing from large to small screen.
- Reopening the sidebar when resizing from small to large screen if it was open before.
- Keeping the sidebar collapsed when resizing from small to large screen if it was manually closed before.
- Reopening the sidebar when resizing from small to large screen if it was manually opened before.
