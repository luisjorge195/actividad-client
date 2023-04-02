import React from 'react'
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'Yup'
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input:ProductoInput){
        nuevoProducto(input:$input) {
            id
            nombre
            existencia
            precio
        }
    }
`
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

const nuevoProducto = () => {
    //mutation de apollo
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data:{nuevoProducto}}){
            //dos pasos: Obtener el objeto de cache y reescribir el objeto
            const { obtenerProductos } = cache.readQuery({query:OBTENER_PRODUCTOS});
            cache.writeQuery({
                query:OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos:[...obtenerProductos, nuevoProducto]
                }
            })
        }
    });
    const router = useRouter();
    //formulario para nuevos productos
    const formik = useFormik({
        initialValues:{
            nombre:'',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorio'),
            existencia: Yup.number().required('La existencia del producto es obligatoria').positive('No se aceptan cantidades menor a cero').integer('La existencia debe ser con números enteros'),
            precio: Yup.number().required('El precio es obligatorio').positive('El precio debe ser mayor a cero')
        }),
        onSubmit: async valores => {
            const { nombre, existencia, precio} = valores
            try {
                const {data} = await nuevoProducto({
                    variables:{
                        input:{
                            nombre,
                            existencia,
                            precio
                        }
                    }
                })
                //crear una alerta
                Swal.fire(
                    'Creado',
                    'Se creo correctamente el producto',
                    'success'
                )
                //redireccionar hacia los productos
                router.push('/productos');
                
            } catch (error) {
                console.log(error)
            }
        }
    })
  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Crear nuevo producto</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <form 
                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={formik.handleSubmit}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nombre}
                        />
                    </div>
                    {formik.errors.nombre && formik.touched.nombre ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.nombre}</p>
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.existencia}
                        />
                    </div>
                    {formik.errors.existencia && formik.touched.existencia ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.existencia}</p>
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.precio}
                        />
                    </div>
                    {formik.errors.precio && formik.touched.precio ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.precio}</p>
                        </div>
                    ) : null}
                    <input
                        type="submit"
                        className='bg-gray-800 w-full mt-5 p-2 cursor-pointer text-white uppercase font-bold hover:bg-gray-900'
                        value="Agregar Nuevo Producto"
                    />
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default nuevoProducto