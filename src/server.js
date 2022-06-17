const { Server } = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
	const server = new Server({
		port: 5000,
		host: "localhost",
	});

	server.route(routes);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

init();
