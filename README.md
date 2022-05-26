# gantt-chart-vanillajs

This is a web component for a simple, interactive Gantt Chart.

## Features

- you can switch between two views: month-day view and day-time view
- tasks can be configured via JavaScript, they are displayed as draggable bars in the selected view
- by double-clicking on a task, an editing dialogue is opened in which the start and end of the task can be adjusted

## Usage

Since the code contains JavaScript modules, you can only run the example from an HTTP server and not from the local file system. For testing on your local PC, I’d recommend the module [live-server](https://www.npmjs.com/package/live-server), which you can install via npm.

To configure tasks, edit the file "index.js".

To run the project, start your web server and open the file "index.html" in the browser.

Alternatively, you can try out the example [here](https://aprenzel.github.io/gantt-chart-vanillajs/) directly in your browser without installation.

## License

[MIT](https://choosealicense.com/licenses/mit/)
