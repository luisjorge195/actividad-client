import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'Yup'
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql `
  mutation nuevoCliente($input:ClienteInput){
    nuevoCliente(input:$input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`
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

const nuevoCliente = () => {
  const router = useRouter();
  const [mensaje, guardarMensaje] = useState(null)
  //mutation para crear nuevo cliente
  const [ nuevoCliente] = useMutation(NUEVO_CLIENTE,{
    //vamos a actualizar una vez se corra el mutation
    update(cache, { data: { nuevoCliente}}){
      //tenemos que obtener el objeto de cache que deseamos actualizar
      const { obtenerClientesVendedor} = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO})
      ///reescribimos el cache ya que este es inmutable y np se debe modificar
      cache.writeQuery({
        query:OBTENER_CLIENTES_USUARIO,
        data:{
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
        }
      })
    }
  })
  const formik = useFormik({
    initialValues:{
      nombre:'',
      apellido:'',
      empresa:'',
      email:'',
      telefono: ''
    },
    validationSchema: Yup.object({
      nombre:Yup.string().required('El nombre es obligatorio'),
      apellido:Yup.string().required('El apellido es obligatorio'),
      empresa:Yup.string().required('El campo empresa es obligatorio'),
      email:Yup.string().email('Email no válido').required('El campo email es obligatorio'),
    }),
    onSubmit: async valores =>{
      const {nombre, apellido,empresa,email,telefono} = valores
      try {
        const {data}= await nuevoCliente({
          variables:{
            input:{
              nombre,
              apellido,
              empresa,
              email,
              telefono
            }
          }
        })
        router.push('/')
        console.log(data.nuevoCliente)
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error:', ''));
        setTimeout(()=>{
          guardarMensaje(null)
        },2000)
      }
    }
  })
  const mostrarMensaje = () => {
    return(
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    )
  }
  return (
    <Layout>
        <h1 className="text-2xl text-gray-800 font-light">nuevocliente</h1>
        {mensaje && mostrarMensaje()}
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <form 
              className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
              onSubmit={formik.handleSubmit}
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
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                  Apellido Cliente
                </label>
                <input
                  className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id="apellido"
                  type="text"
                  placeholder='Apellido cliente'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.apellido}
                />
              </div>
              {formik.errors.apellido && formik.touched.apellido ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.apellido}</p>
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.empresa}
                  
                />
              </div>
              {formik.errors.empresa && formik.touched.empresa ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.empresa}</p>
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.errors.email && formik.touched.email ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.email}</p>
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.telefono}
                />
              </div>
              
              <input
                type="submit"
                className='bg-gray-800 w-full mt-5 p-2 cursor-pointer text-white uppercase font-bold hover:bg-gray-900'
                value="Registrar Cliente"
              />
            </form>
          </div>
        </div>
    </Layout>
  )
}

export default nuevoCliente