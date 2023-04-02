import {useState} from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input:UsuarioInput){
    nuevoUsuario(input:$input){
      id,
      nombre,
      apellido,
      email
    }
  }
`
const NuevaCuenta = () => {
  const router = useRouter();
  //state para el mensaje
  const [mensaje, setMensaje] = useState(null)
  //mutation para crear nuevos usuarios. A USEMUTATION LE PASAMOS COMO PARAMETRO EL MUTATION QUE SE QUIERE UTILIZAR
  
  const [ nuevoUsuario] = useMutation(NUEVA_CUENTA)
  //validacion del formulario
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido : '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
                  .required('Este campo es obligatorio'),
      apellido: Yup.string()
                  .required('Este campo es obligaotrio'),
      email:Yup.string()
                  .email('Este email no es válido').required('este campo es obligatorio'),
      password: Yup.string()
                  .required('El password no debe or vacio').min(6,'El password debe tener al menos 6 caracteres')

    }),
    onSubmit: async valores => {
      const {nombre, apellido,email,password} = valores
      try {
        const {data} = await nuevoUsuario({
          variables:{
            input:{
              nombre,
              apellido,
              email,
              password
            }
          }
        })
        //Usuario creado correctamente
        setMensaje(`Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}`)
        setTimeout(()=>{
          setMensaje(null)
          router.push('/login')//redirecciona con push al usuario
        },3000)

        //redirigir al usuario
      } catch (error) {
        setMensaje(error.message.replace('GraphQL error: ', ''))
        setTimeout(()=>{
          setMensaje('')
        },3000)
      }
    }
  });
  const mostrarMensaje = () => {
    return(
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    )
  }
  return (
    <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className='text-center text-2xl text-white font-black'>Crear Nueva Cuenta</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form 
              className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
              onSubmit={formik.handleSubmit}
            >
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                  Nombre
                </label>
                <input
                  className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id="nombre"
                  type="text"
                  value= {formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='Nombre Usuario'
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
                  Apellido
                </label>
                <input
                  className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id="apellido"
                  type="text"
                  placeholder='Apellido Usuario'
                  value= {formik.values.apellido}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.apellido && formik.touched.apellido ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.apellido}</p>
                </div>
              ) : null}
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                  Email
                </label>
                <input
                  className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id="email"
                  type="email"
                  placeholder='Email Usuario'
                  value= {formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.email && formik.touched.email ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                  password
                </label>
                <input
                  className='shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id="password"
                  type="password"
                  placeholder='Password del Usuario'
                  value= {formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.password && formik.touched.password ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}
              <input
                className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer'
                value='Crear Cuenta'
                type="submit"
                
              />
            </form>
          </div>
        </div>
    </Layout>
    
  )
}

export default NuevaCuenta