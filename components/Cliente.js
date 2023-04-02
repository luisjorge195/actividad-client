import React from 'react'
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE =gql`
    mutation eliminarCliente($id:ID!){
        eliminarCliente(id:$id)
    }
`
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`

const Cliente = ({cliente}) => {
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        refetchQueries:[{
            query:OBTENER_CLIENTES_USUARIO
        }]
        // update(cache){
        //     //obtener una copia del objeto de cache
        //     const {obtenerClientesVendedor} = cache.readQuery({query:OBTENER_CLIENTES_USUARIO})
        //     //REESCRIBIR EL CACHE
        //     cache.evict({broadcast:false})
        //     cache.writeQuery({
        //         query:OBTENER_CLIENTES_USUARIO,
        //         data: {
        //             obtenerClientesVendedor: obtenerClientesVendedor.filter(clienteActual => clienteActual.id !== id)
        //         }
        //     })
        // }
    })
    console.log(cliente)
    const {nombre, apellido, empresa, email} = cliente;
    const confirmarEliminarCliente = (id) => {
        Swal.fire({
            title: '¿Deseas eliminar este cliente?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
          }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    //eliminar por ID 
                    //data es la rota del servidor
                    const {data} = await eliminarCliente({
                        variables:{
                            id
                        }
                    })
                    console.log(data)
                    //mostrar la alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    
                }
              
            }
          })
    }
    const editarCliente = (id) => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: {id}
        })
    }
    return (
        <tr >
            <td className="border px-4 py-2 text-center">{nombre} {apellido}</td>
            <td className="border px-4 py-2 text-center">{empresa}</td>
            <td className="border px-4 py-2 text-center">{email}</td>
            <td className="border px-4 py-2 text-center">
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={()=>confirmarEliminarCliente(cliente.id)}
                >
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2 text-center">
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={()=>editarCliente(cliente.id)}
                >
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>

                </button>
            </td>
        </tr>
    )
}

export default Cliente