// No default task on purpose.
// Use explicit commands like: gulp build, gulp serve.

const requireDir = require("require-dir");

// Load all tasks from gulp/tasks folder
requireDir("./gulp/tasks", { recurse: true });
