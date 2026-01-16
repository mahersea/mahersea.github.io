Core Prompt: Countries GraphQL Playground Single-Page App

Objective:
Build an interactive single-page application (SPA) that serves as a GraphQL playground for exploring the public Countries API at https://countries.trevorblades.com/. This app should allow users to run GraphQL queries, view live results, and quickly load example queries using a set of quick links.

Technical Requirements:

    Single-File Implementation:

        Everything (HTML, CSS, JavaScript) must reside in a single HTML file.

    Embedded Custom JavaScript and CSS:

        All code must be embedded in the file (no external scripts or stylesheets).

    Responsive & Interactive Design:

        Where needed, include an HTML5 canvas element (hidden by default) that can be usedto handle certain logic.

    Theme Toggle:

        Provide a dark/light mode toggle that updates all relevant elements (including documentation and query result areas) to ensure legibility.

    GraphQL Integration:

        Use the public Countries API endpoint (https://countries.trevorblades.com/) by sending GraphQL queries via a POST request.

    UI Components:

        A query input textarea where users can write their GraphQL queries.

        A Run Query button that triggers the query execution.

        A query result pane to display the fetched JSON results.

        A Quick Links section with clickable examples that automatically load and execute predefined queries.

        An Additional Documentation section providing example queries, search/filter tips, and instructions on interacting with the API.

Example Queries to Include in Quick Links:

    List all countries:

`{ countries { code, name, emoji } }`

Get country details for Brazil:

`{ country(code: "BR") { name, native, capital, currency, languages { code, name } } }`

Get country details for USA:

`{ country(code: "US") { code, name, native, capital, currency, languages { code, name } } }`

List continents with their countries:

`{ continents { code, name, countries { code, name } } }`

Get details for a specific continent (e.g., Europe):

`{ continent(code: "EU") { name, countries { code, name } } }`

List all languages:

`{ languages { code, name } }`

Get language details for English:

`{ language(code: "en") { name, native, rtl } }`

Behavior & Flow:

    Theme Toggle:

        Clicking the "Toggle Dark/Light Mode" button should switch the color scheme for the entire page, ensuring that areas like the query result and documentation remain legible.

    Canvas Toggle:

        A "Show/Hide Canvas" button should toggle the display of a full-screen canvas that displays a centered message (e.g., "Canvas Active").

    Query Execution:

        When a user clicks "Run Query," the app sends the current query in the textarea to the Countries API and displays the JSON result.

    Quick Links:

        Each quick link, when clicked, should load its corresponding example query into the textarea and automatically trigger the query execution.

Outcome:
The final SPA is a hands-on GraphQL playground that lets users experiment with real data from the Countries API. It provides immediate visual feedback through live query results, example queries via quick links, and supporting documentation to help understand query syntax and filtering capabilities.