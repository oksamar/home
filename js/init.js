const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navigationLinks = [...document.querySelectorAll('.nav-link')];

function closeMenu() {
   sidebar.classList.remove('open');
   menuToggle.setAttribute('aria-expanded', 'false');
   menuToggle.setAttribute('aria-label', 'Open navigation');
}

menuToggle.addEventListener('click', () => {
   const isOpen = sidebar.classList.toggle('open');
   menuToggle.setAttribute('aria-expanded', String(isOpen));
   menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
   if (!sidebar.contains(event.target) && !event.target.closest('.menu-toggle')) closeMenu();
});
document.addEventListener('keydown', event => {
   if (event.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
   }
});

const sections = navigationLinks.map(link => document.querySelector(link.hash));
function updateNavigation() {
   const offset = window.innerWidth <= 900 ? 160 : 120;
   const activeSection = [...sections].reverse().find(section => section.getBoundingClientRect().top <= offset) || sections[0];
   navigationLinks.forEach(link => {
      const active = link.hash === `#${activeSection.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
   });
}
window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', () => {
   if (window.innerWidth > 900) closeMenu();
   updateNavigation();
});
updateNavigation();

const tabList = document.querySelector('.publication-tabs');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
function selectTab(selectedTab) {
   tabs.forEach(tab => {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
   });
}
tabs.forEach((tab, index) => {
   const panel = document.getElementById(tab.getAttribute('aria-controls'));
   panel.setAttribute('role', 'tabpanel');
   panel.setAttribute('aria-labelledby', tab.id);
   panel.tabIndex = 0;
   tab.addEventListener('click', () => selectTab(tab));
   tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex !== undefined) {
         event.preventDefault();
         selectTab(tabs[nextIndex]);
         tabs[nextIndex].focus();
      }
   });
});
tabList.hidden = false;
document.getElementById('publications').classList.add('tabs-ready');
selectTab(tabs[0]);
document.getElementById('year').textContent = new Date().getFullYear();