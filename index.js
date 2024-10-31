global.RootPath = __dirname;
require("./src/func/userMap")
const client = require("./src/my_client")
const server = require("./src/server")
server.start(client);
