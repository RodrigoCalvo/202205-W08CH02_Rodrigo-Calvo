import http from 'http';
import { AddressInfo } from 'net';

import { app } from './app.js';

const PORT = process.env.PORT || 3200;

const onError = (err: Error) => {
    console.error({ name: err.name, message: err.message });
};
const onListening = () => {
    const address = server.address();
    let bind: string;
    if (typeof address == 'string') {
        bind = 'pipe ' + address;
    } else {
        bind =
            address?.address === '::'
                ? 'http://localhost:' + (address as AddressInfo).port
                : (address as AddressInfo).address +
                  (address as AddressInfo).port;
    }
    console.log('Listening on ' + bind);
};

app.set('port', PORT);
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT);
