import { Children, useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";
import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {
    //state de pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total:0
    }
    const [state, dispatch] = useReducer(PedidoReducer, initialState);
    //el dispatch es una funcion que conectado con los types evalua todo a partir de los cases y actualiza el state en el reducer
   
    //modifica el cliente
    const agregarCliente = (cliente) =>{
        dispatch({
            type:SELECCIONAR_CLIENTE,
            payload:cliente
        })
    }

    //modifica producto
    const agregarProducto = (productosSeleccionados) =>{
        let nuevoState;
        if(state.productos.length>0){
            //tomar del segundo arreglo una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map(producto=>{
                const nuevoObjeto = state.productos.find( productoState =>productoState.id === producto.id);
                return {...producto, ...nuevoObjeto}
            })
        }
        else{
            nuevoState=productosSeleccionados;
        }
        dispatch({
            type :SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    //modifica las cantidades de los productos
    const cantidadProductos = (nuevoProducto) => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }
    const actualizarTotal = () =>{
        dispatch({
            type:ACTUALIZAR_TOTAL
        })
    }
    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal,
                productos: state.productos,
                total:state.total
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState