import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import app from './index';
 
app.get("/", function (req: Request, res: Response) {

    const readAsBinary = (file: string, readbuffer?: any) => {
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