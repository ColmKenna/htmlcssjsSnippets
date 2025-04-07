const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');


burger.addEventListener('click', () => {
  const isLargeScreen = window.innerWidth >= 768;

  const isCollapsed = sidebar.classList.toggle('collapsed');
  content.classList.toggle('collapsed', isCollapsed);
  content.classList.toggle('shifted', !isCollapsed);
  burger.classList.toggle('closed', isCollapsed);
});


