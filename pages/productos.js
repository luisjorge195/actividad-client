import React, { use } from 'react'
import Layout from '../components/Layout'
import { useQuery, gql } from '@apollo/client';
import Producto from '../components/Producto';
import Link from 'next/link';

//definimos la consulta y pqegamos la consulta
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos {
      existencia,
      id,
      nombre, 
      precio
    }
  }
`

const productos = () => {
  const { data} = useQuery(OBTENER_PRODUCTOS);
  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>
        <Link href="/nuevoProducto" className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm'>
          Nuevo Producto
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="w-1/5 py-2 text-white">Nombre</th>
              <th className="w-1/5 py-2 text-white">Existencia</th>
              <th className="w-1/5 py-2 text-white">Precio</th>
              <th className="w-1/5 py-2 text-white">Eliminar</th>
              <th className="w-1/5 py-2 text-white">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.obtenerProductos.map((item) => (
              <Producto
                key = {item.id}
                producto= {item}
              />
            ))}
          </tbody>
        </table>
    </Layout>
    
  )
}

export default productos