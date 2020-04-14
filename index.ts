import Server from './classes/server';
import userRoutes from './routes/usuarios';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body parser 
server.app.use( bodyParser.urlencoded( { extended:true } ));
server.app.use( bodyParser.json());

//Rutas de mi app
server.app.use( '/user', userRoutes );

//Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosGram',
                {useNewUrlParser:true,useCreateIndex: true},
                (err)=>{
                    if(err) throw err;                      //si hay error muestra el error por consola.
                    console.log('Base de datos online');    //si no hay error saca este mensaje
                });

server.start( () => {
    console.log(`Servidor corriendo en puerto ${server.port}`); //las comillas son tildes.

})