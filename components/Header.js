import React from 'react'
import {gql, useQuery} from '@apollo/client'
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;
const Header = () => {
    const router = useRouter()
    const {data,loading,error} = useQuery(OBTENER_USUARIO)
    //proteger que no accedamos a data antes de tener resultado
    if(loading) return null;
    if(!data){
        return console.log('direccionando a login')
    }
    const {nombre, apellido} = data?.obtenerUsuario;
    // si no hay  informacion 
   
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login')
    }
    return (
        <div className='flex justify-between mb-6'>
            <p className='mr-4'>Bienvenido: {nombre} {apellido}</p>
            <button
                onClick={()=>cerrarSesion()}
                type='button'
                className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
            >
                Cerrar Sesión
            </button>
        </div>
    )
}

export default Header