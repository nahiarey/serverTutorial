
import express from 'express';

export default class Server {

    public app: express.Application;
    public port: number = 3000;

    constructor(){
        this.app = express();
    }

    start( callback:any){ //en el video lo pone como type function pero da error asi que he puesto any
        this.app.listen( this.port, callback ); //aunque de error funciona perferctamente.

    }
}