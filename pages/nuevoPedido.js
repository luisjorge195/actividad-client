import {useState, useEffect, useContext} from 'react'
import Layout from '../components/Layout'
import Select from 'react-select'
import PedidoContext from '../context/pedidos/PedidoContext'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProductos from '../components/pedidos/AsignarProductos'
import ResumenPedido from '../components/ResumenPedido'
import Total from '../components/Total'
import {gql, useMutation} from '@apollo/client';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input:PedidoInput){
    nuevoPedido(input:$input){
      id
    }
  }
`

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

const nuevoPedido = () => {
    //utilizar context y extraer sus valores y gfunciones
    const pedidoContext = useContext(PedidoContext);
    const router = useRouter();
    const {cliente, productos, total} = pedidoContext;
    const {id} = cliente;
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO,{
      update(cache,{data:{nuevoPedido}}){
        const {obtenerPedidosVendedor} = cache.readQuery(({
          query:OBTENER_PEDIDOS
        }));
        cache.writeQuery({
          query:OBTENER_PEDIDOS,
          data:{
            obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
          }
        })
      }
    })
    const [mensaje, setMensaje] = useState(null);
    const validarPedido = ()=>{
      return !productos.every(producto => producto.cantidad>0 || total === 0 || cliente.length ===0) ? " opacity-50 cursor-not-allowed" : ' ';
    }
    const crearNuevoPedido = async() =>{
      //remover lo no deseado del producto
      const pedido = productos.map(({existencia,__typename, ...producto})=> producto)

      try {
        const {data} = await nuevoPedido({
          variables:{
            input:{
              cliente:id,
              total,
              pedido
            }
          }
        })
        Swal.fire(
          'Correcto',
          'El pedido se registró correctamente',
          'success'
        )
        router.push('/pedidos')
      } catch (error) {
        setMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(()=>{
          setMensaje('')
        },3000)
      }
    }
    const mostrarMensaje = ()=>{
      return(
        <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
          <p>{mensaje}</p>
        </div>
      )
    }
  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 text-light'>Nuevo Pedido</h1>
        {mensaje && mostrarMensaje()}
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <AsignarCliente/>
            <AsignarProductos/>
            <ResumenPedido/>
            <Total/>
            <button
              className={`bg-gray-700 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
              type='button'
              onClick={()=>crearNuevoPedido()}
            >
              Registrar Pedido
            </button>
          </div>
        </div>
    </Layout>
  )
}

export default nuevoPedido