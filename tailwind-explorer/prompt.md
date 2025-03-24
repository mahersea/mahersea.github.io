Write a complete Next.js web application using the new "app" directory structure and integrating Tailwind CSS. The application should be a playground for experimenting with Tailwind CSS classes. It must have a two-pane layout with the following specifications:

• The left pane is a sidebar that lists Tailwind CSS classes grouped by category (for example, Layout, Spacing, Typography). Each class should be selectable. 
• The right pane is a preview panel that displays multiple UI components (such as a header, buttons, and grid cards) that dynamically apply the selected Tailwind CSS class, so the user can see its effects.
• The app must enforce a light mode theme by disabling dark mode in the Tailwind configuration.

Provide complete, functional code for these files:

For src/app/layout.js, set up the root layout that imports the global CSS file.

For src/app/page.js, implement the main page containing both the Sidebar and Preview components, including sample data for Tailwind CSS classes and multiple UI elements to demonstrate the applied classes.

For styles/globals.css, include the Tailwind CSS directives (for base, components, and utilities) and define custom CSS variables to enforce a light theme.

For tailwind.config.js, configure Tailwind to scan the correct directories (for example, "./src/app/**/*.{js,ts,jsx,tsx}") and disable dark mode (set darkMode to false).

Ensure that the code is well-structured and that the app is fully functional when run. 