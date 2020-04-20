//uso de la base de datos
import { Schema, model, Document } from 'mongoose';
//Paquete de encriptado
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario'] // el nombre es necesario al introducir un usuario
    },
    avatar:{
        type:String,
        default:'av-1.png'      //por defecto se utiliza el avatar av-1.png
    },
    email:{
        type:String,
        unique:true,            // hace que el correo no se pueda repetir entre usuarios
        required:[true,'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es necesaria'] //La contraseña es obligatoria al crear un usuario
    }

});


//creamos metodo para comparar contraseñas
usuarioSchema.method('compararPassword', function( password:string = '' ):boolean{
    if( bcrypt.compareSync( password, this.password) ){
        return true;
    }else{
        return false;
    }
});


//Permite que tengas una "documentación" de la clase que has crado y visualStudio te ayude a usar los objetos que vayas creando
interface IUsuario extends Document {
    nombre: string;
    email: string;
    password: string;
    avatar:string;

    compararPassword(password: string):boolean; 
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);