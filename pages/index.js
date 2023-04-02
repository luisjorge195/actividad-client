
import Layout from "../components/Layout";
import {gql, useQuery} from '@apollo/client'
import { useRouter } from "next/router";
import Link from "next/link";
import Cliente from "../components/Cliente";

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
export default function Home() {
  const router = useRouter()
  //consulta de Apollo 
  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);
  if(loading) return 'cargando...'
 
  const vistaProtegida = () => {
    router.push('/login')
  }

  return (
    <>
     { data.obtenerClientesVendedor ? (
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link href="/nuevoCliente" className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
          Nuevo cliente
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="w-1/5 py-2 text-white">Nombre</th>
              <th className="w-1/5 py-2 text-white">Empresa</th>
              <th className="w-1/5 py-2 text-white">Email</th>
              <th className="w-1/5 py-2 text-white">Eliminar</th>
              <th className="w-1/5 py-2 text-white">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.obtenerClientesVendedor.map((cliente) => (
              <Cliente
                key={cliente.id}
                cliente={cliente}
              />
            ))}
          </tbody>

        </table>
      </Layout>
     ): vistaProtegida()
      }
    </>
  )
}
