import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import {gql, useQuery, useMutation} from '@apollo/client'
import { Formik } from 'formik';
import * as Yup from 'Yup'
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id:ID!){
        obtenerProducto(id:$id) {
        nombre,
        precio
        existencia
        }
    }
`
const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id:ID!, $input:ProductoInput){
        actualizarProducto(id:$id, input:$input){
        id,
        nombre,
        existencia,
        precio
        }
    }
`
const EditarProducto = () => {
    const router = useRouter();
    const {query: {id}} = router;
    //mutation para actualizar producto
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO)
    //consultar oara ibtener el producto
    const { data, loading, error }= useQuery(OBTENER_PRODUCTO,{
        variables:{
            id
        }
    });
    //scvhema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del producto es obligatorio'),
        existencia: Yup.number().required('La existencia del producto es obligatoria').positive('No se aceptan cantidades menor a cero').integer('La existencia debe ser con números enteros'),
        precio: Yup.number().required('El precio es obligatorio').positive('El precio debe ser mayor a cero')
    });

    if(loading) return 'cargando....'
    const actualizarInfoProducto = async valores => {
        const { nombre, existencia , precio} = valores;
       try {
        const {data} = await actualizarProducto({
            variables:{
                id,
                input:{
                    nombre,
                    existencia,
                    precio
                }
            }
        })
       
        //redirigir hacia productos
        router.push('/productos')
        //mostrar alerta
        Swal.fire(
            'Producto editado correctamente',
            'El producto se actualizó correctamente',
            'success'
        )
       } catch (error) {
        console.log(error)
       }
    }
    const {obtenerProducto} = data
    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
            <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <Formik
                    enableReinitialize
                    initialValues={obtenerProducto}
                    validationSchema={schemaValidacion}
                    onSubmit={valores => {
                        actualizarInfoProducto(valores)
                    }}
                >
                    {props => {
                    return (
                        <form 
                            className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={props.handleSubmit}
                        >
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre Producto
                                </label>
                                <input
                                className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="nombre"
                                type="text"
                                placeholder='Nombre cliente'
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.nombre}
                                />
                            </div>
                            {props.errors.nombre && props.touched.nombre ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{props.errors.nombre}</p>
                                </div>
                            ) : null}
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>
                                    Cantidad disponible
                                </label>
                                <input
                                className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="existencia"
                                type="number"
                                placeholder='Cantidad disponible'
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.existencia}
                                />
                            </div>
                            {props.errors.existencia && props.touched.existencia ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{props.errors.existencia}</p>
                                </div>
                            ) : null}
                            <div className='mb-4'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                                    Precio Producto
                                </label>
                                <input
                                className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="precio"
                                type="number"
                                placeholder='Precio Producto'
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.precio}
                                />
                            </div>
                            {props.errors.precio && props.touched.precio ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{props.errors.precio}</p>
                                </div>
                            ) : null}
                            <input
                                type="submit"
                                className='bg-gray-800 w-full mt-5 p-2 cursor-pointer text-white uppercase font-bold hover:bg-gray-900'
                                value="Guardar cambios"
                            />
                        </form>
                      )
                    }}
                </Formik>
            </div>
        </div>
        </Layout>
        
    )
}

export default EditarProducto