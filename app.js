import { Request, Response } from 'express';
import { read, readFile, readFileSync } from 'fs';
import app from './index';
 
app.get("/", function (req, res) {

    const readAsBinary = (file, readbuffer) => {
    if (typeof process === 'object' && typeof require === 'function') {
        const binary = require('fs').readFileSync(file);
        return Buffer.from(binary);
    } else
        return typeof readbuffer === 'function'
            ? new Uint8Array(readbuffer(file))
            : readFileSync(file, 'utf-8');
    };

    const response = readAsBinary('./src/staking_contract.wasm')
    res.send(response);
});
 
app.listen(3000);

module.exports.server = sls(app);
