import React from 'react'
import { useState, useEffect} from 'react';
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO =gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput){
    actualizarPedido(id: $id, input:$input){
      estado
      id
    }
  }
`
const ELIMINAR_PEDIDO =gql`
  mutation eliminarPedido($id:ID!){
    eliminarPedido(id:$id)
  }
`
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor {
      id,
    }
  }
`

const Pedido = ({pedido}) => {
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO)
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache){
      const {obtenerPedidosVendedor} = cache.readQuery({
        query: OBTENER_PEDIDOS
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data:{
          obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido=>pedido.id!==id)
        }
      })
    }
  })
  const {id, total, cliente, estado} = pedido;
  const {nombre, apellido, email, telefono} = cliente;
  const [estadoPedido, setEstadoPedido]= useState(estado)
  const [clase, setClase]= useState('')
  useEffect(()=>{
    if(estadoPedido){
      setEstadoPedido(estadoPedido)
    }
    clasePedido()
  },[estadoPedido])

  //funcion que modifica el color del pedido de acuerdo a su estado
  const clasePedido = ()=>{
    if(estadoPedido==='PENDIENTE'){
      setClase('border-yellow-500')
    }
    else if(estadoPedido==='COMPLETADO'){
      setClase('border-green-500')
    }else{
      setClase('border-red-800')
    }
  } 
  const cambiarEstadoPedido = async(nuevoEstado) =>{
    try {
      const {data}= await actualizarPedido({
        variables:{
          id,
          input:{
            estado:nuevoEstado,
            cliente: cliente.id
          }
        }
      })
      setEstadoPedido(data.actualizarPedido.estado)
    } catch (error) {
      console.log(error)
    }
  }
  const confirmarEliminarPedido = ()=>{
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
          const data = await eliminarPedido({
            variables:{
              id
            }
          })
          Swal.fire(
            'Eliminado',
            data.eliminarPedido,
            'success'
          )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
  return (
    <div className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className='font-bold text-gray-800'>cliente: {nombre} {apellido}</p>
        {email && (
          <p>{email}</p>
        )}
        {telefono && (
          <p>{telefono}</p>
        )}
        <h2 className='text-gray-800 font-bold mt-10'>Estado Pedido:</h2>
        <select
          value={estadoPedido}
          className='mt-2 appereance-none bg-blue-600 border border-blue-600 font-bold text-white p-2 text-center rounden leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs'
          onChange={(e)=> cambiarEstadoPedido(e.target.value)}
        >
          <option value='COMPLETADO'>COMPLETADO</option>
          <option value='PENDIENTE'>PENDIENTE</option>
          <option value='CANCELADO'>CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className='text-gray-800 font-bold mt-2'>Resumen del pedido</h2>
        {pedido.pedido.map((articulo)=>(
          <div>
            <p className='text-sm text-gray-600'>Producto: {articulo.nombre}</p>
            <p className='text-sm text-gray-600'>Cantidad: {articulo.cantidad}</p>
          </div>
        ))}
        <p className='text-gray-800 mt-3 font-bold'>Total a pagar:
          <span className='font-light'> ${total}</span>
        </p>
        <button
          className='flex uppercasse text-xs font-bold items-center mt-4 bg-red-800 px-5 py-2 inline block text-white rounded leading-tight'
          onClick={()=>confirmarEliminarPedido()}
        >
          Eliminar pedido
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pedido