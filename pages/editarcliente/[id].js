import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'Yup'
import Swal from 'sweetalert2';

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id:ID!, $input:ClienteInput){
        actualizarCliente(id:$id, input:$input){
            nombre
            email
        }
    }
`
const OBTENER_CLIENTE = gql `
    query obtenerCliente($id:ID!){
        obtenerCliente(id: $id) {
            nombre,
            apellido
            email
            telefono
            empresa
        }
    }
`

const EditarCliente = () => {

    const router = useRouter();
    //obtene rel id actual
    const { query:{id}} = router;
    
    //consultar para obtener cliente
    const {data, loading, error} = useQuery(OBTENER_CLIENTE, {
        variables:{
            id
        }
    });
    //actualizar cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE)
    const schemaValidacion =  Yup.object({
        nombre:Yup.string().required('El nombre es obligatorio'),
        apellido:Yup.string().required('El apellido es obligatorio'),
        empresa:Yup.string().required('El campo empresa es obligatorio'),
        email:Yup.string().email('Email no válido').required('El campo email es obligatorio'),
    })
    if(loading) return 'cargando...';
    
    const  { obtenerCliente } = data
    console.log('dta', data)
    //modifica el cliente en la bd
    const actualizarInfoCliente = async(valores) => {
        const {nombre, apellido, email, empresa, telefono} = valores;
        try {
            const {data} = await actualizarCliente({
                variables:{
                    id,
                    input:{
                        nombre, apellido, email, empresa, telefono
                    }
                }
            })
            Swal.fire(
                'Actualizado!',
                'El cliente se actualizó correctamente',
                'success'
            )
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Layout>
         <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
         <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <Formik
                validationSchema={schemaValidacion}
                enableReinitialize
                initialValues={ obtenerCliente}
                onSubmit = { (valores) => {
                    actualizarInfoCliente(valores)
                }}
            >
                {props => {
                    console.log('props', props)
                    return (
                <form 
                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={props.handleSubmit}
                >
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                        Nombre Cliente
                    </label>
                    <input
                        className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id="nombre"
                        type="text"
                        placeholder='Nombre cliente'
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values?.nombre}
                    />
                </div>
                {props.errors.nombre && props.touched.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.nombre}</p>
                    </div>
                ) : null}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                        Apellido Cliente
                    </label>
                    <input
                        className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id="apellido"
                        type="text"
                        placeholder='Apellido cliente'
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values?.apellido}
                    />
                </div>
                {props.errors.apellido && props.touched.apellido ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.apellido}</p>
                    </div>
                ) : null}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                        Empresa
                    </label>
                    <input
                        className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id="empresa"
                        type="text"
                        placeholder='Nombre Empresa'
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values?.empresa}
                    
                    />
                </div>
                {props.errors.empresa && props.touched.empresa ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.empresa}</p>
                    </div>
                ) : null}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                        Email Cliente
                    </label>
                    <input
                        className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id="email"
                        type="email"
                        placeholder='Email cliente'
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values?.email}
                    />
                </div>
                {props.errors.email && props.touched.email ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.email}</p>
                    </div>
                ) : null}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                        Telefono Cliente
                    </label>
                    <input
                        className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id="telefono"
                        type="tel"
                        placeholder='Telefono cliente'
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values?.telefono}
                    />
                </div>
                
                <input
                    type="submit"
                    className='bg-gray-800 w-full mt-5 p-2 cursor-pointer text-white uppercase font-bold hover:bg-gray-900'
                    value="Editar Cliente"
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

export default EditarCliente