import {useContext, useEffect, useState} from 'react'
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS =gql`
    query obtenerProductos{
        obtenerProductos {
            existencia,
            id,
            nombre, 
            precio
        }
    }
`;

const AsignarProductos = () => {
    //state local del componente
    const [productos, setProductos] = useState([])
    //consulta a la bd
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);
    const pedidoContext = useContext(PedidoContext)
    const {agregarProducto} = pedidoContext;
    useEffect(()=>{
        //TODO: Funcion para pasar a pedidostate
        agregarProducto(productos)
    },[productos])
    const seleccionarProducto = producto => {
        setProductos(producto)
    }
    if(loading) return null;
    const {obtenerProductos}= data;
    return (
        <div>
        <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.-Selecciona o busca los productos</p>
        <Select
            className='mt-3'
            isMulti
            options={obtenerProductos}
            onChange={opcion=>seleccionarProducto(opcion)}
            getOptionLabel = {opciones => `${opciones.nombre} - ${opciones.existencia} disponibles`}
            getOptionValue={opciones => opciones.id}
            placeholder="Busque o seleccione el producto"
            noOptionsMessage={() => "No hay resultados"}
        />
        </div>
    )
}

export default AsignarProductos