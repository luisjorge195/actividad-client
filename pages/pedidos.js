import React from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import {gql, useQuery} from '@apollo/client';
import Pedido from '../components/Pedido';

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor {
      id,
      cliente{
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor,
      pedido {
        cantidad
        nombre
      }
      total
      estado
    }
  }
`
const pedidos = () => {
  const {loading, error, data} = useQuery(OBTENER_PEDIDOS);
  if(loading) return 'cargando...';
  const  {obtenerPedidosVendedor} = data;
  console.log(obtenerPedidosVendedor)
  return (
    <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
        <Link href="/nuevoPedido" className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
          Nuevo Pedido
        </Link>
        {obtenerPedidosVendedor.length === 0 ? (
          <p className='mt-5 text-center text-2xl'>No hay Pedidos aun</p>
        ):(obtenerPedidosVendedor.map((pedido)=>(
          <Pedido
            key={pedido.id}
            pedido={pedido}
          />
        )))}
    </Layout>
  )
}

export default pedidos