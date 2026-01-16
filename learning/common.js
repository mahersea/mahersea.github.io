// Toggle dark/light mode functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggleSwitch = document.getElementById('themeToggleSwitch');
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleSwitch.checked = true;
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeToggleSwitch.checked = false;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeToggleSwitch.checked = true;
  }
  
  // Theme toggle event listener
  themeToggleSwitch.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
});
