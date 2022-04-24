import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from '../source/config/logging';
import config from '../source/config/config';

const NAMESPACE = 'Server';
const router = express();

// Log da requisição
// Middleware: função que permite a modificação de requisições
router.use((req, res, next) => {
    /** Log da requisicão */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log da resposta */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
});

/** Parse do corpo da requisicão */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Regras da API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Tratamento de erros */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));