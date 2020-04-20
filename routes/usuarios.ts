import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Token from '../classes/token';
import { Usuario } from '../models/usuario.model';
import { verificaToken } from '../middlewares/autenticacion';


const userRoutes = Router();

//Login
userRoutes.post('/login',(req: Request, res:Response) =>{

    const body = req.body;

    Usuario.findOne({email: body.email}, ( err, userDB)=>{

        if ( err ) throw err;

        if (!userDB){
            return res.json({
                ok:false,
                mensaje:'usuario/contraseña no son correctos'
            });
        }
        
        if(userDB.compararPassword(body.password )){

             const tokenUser = Token.getJwtToken({
                 _id: userDB._id,
                 nombre:userDB.nombre,
                 email:userDB.email,
                 avatar:userDB.avatar
             });
            
            res.json({
                ok:true,
                token: tokenUser
            });

        }else{
            return res.json({
                ok:false,
                mensaje: 'usuario/contraseña no son correctos ***'
            });
        }
    })

});

//Crear un usuario
userRoutes.post('/create', (req: Request,res: Response)=>{
    
    //obtienes la información que entra por el request. lo guardas en la variable user
    const user = {
        nombre: req.body.nombre ,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
        avatar: req.body.avatar
    }


     // --mongoose documentation--
     /**
     * Shortcut for saving one or more documents to the database. MyModel.create(docs)
     * does new MyModel(doc).save() for every doc in docs.
     * Triggers the save() hook.
     */
    //Guardas la variable en la base de datos y te devuelve userDB (la informacion que esta en la base de datos)
    Usuario.create( user ).then( (userDB: any)=>{
        //Transformas a los usuarios en el token correspondiente.
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });
       //Devuelves el ok y el token del usuario.
       res.json({
           ok:true,
           token: tokenUser
       });

    }).catch( err=>{

            res.json({
                ok:false,
                err
            }); 
        });
    
   
});

// Actualizar usuario
userRoutes.post('/update', verificaToken, (req:any, res: Response)=>{
    
    const user ={
        nombre:  req.body.nombre || req.usuario.nombre,
        email:  req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }
    Usuario.findByIdAndUpdate( req.usuario._id, user, { new:true }, (err,userDB)=>{

        if( err ) throw err;

        if( !userDB ){
            return res.json({
                ok:false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
    
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            avatar:userDB.avatar
        });
       
       res.json({
           ok:true,
           token: tokenUser
       });

    });
    
});

export default userRoutes;