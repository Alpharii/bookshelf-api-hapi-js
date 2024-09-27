import Hapi from '@hapi/hapi';
import routes from './routes.js';
import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 9000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
