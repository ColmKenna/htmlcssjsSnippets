const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');

let wasSidebarOpenBeforeResize = true; // Assume initially open

burger.addEventListener('click', () => {
  const isCollapsed = sidebar.classList.toggle('collapsed');
  burger.classList.toggle('closed', isCollapsed);
});

const checkResize = () => {
  const isSmallScreen = window.innerWidth < 768;

  if (isSmallScreen) {
    wasSidebarOpenBeforeResize = !sidebar.classList.contains('collapsed');
    sidebar.classList.add('collapsed');
    burger.classList.add('closed');

  } else {
    if (wasSidebarOpenBeforeResize) {
      sidebar.classList.remove('collapsed');
      burger.classList.remove('closed');
    } else {
      sidebar.classList.add('collapsed');
      burger.classList.add('closed');
    }
  }
};

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(checkResize, 150);
});

// Initial check on page load
checkResize();
