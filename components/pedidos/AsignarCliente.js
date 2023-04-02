import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

//consultando clientes
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

const AsignarCliente = () => {
  const [cliente, setCliente] = useState('')
  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);
  const pedidoContext = useContext(PedidoContext);
  const {agregarCliente} = pedidoContext

  useEffect(() => {
    agregarCliente(cliente)
  },[cliente]);

  const seleccionarCliente = (clientes) => {
    setCliente(clientes)
  }
  if(loading) return null;

  const {obtenerClientesVendedor}= data
  return (
    <div>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.-Asigna un cliente al pedido</p>
      <Select
        className='mt-3'
        options={obtenerClientesVendedor}
        onChange={opcion=>seleccionarCliente(opcion)}
        getOptionLabel = {opciones => opciones.nombre}
        getOptionValue={opciones => opciones.id}
        placeholder="Busque o seleccione el cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </div>
  )
}

export default AsignarCliente