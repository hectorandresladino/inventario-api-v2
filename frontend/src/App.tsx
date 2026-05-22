import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Search, Filter, Trash2, Edit, X } from 'lucide-react'
import axios from 'axios'

interface Pedido {
  id?: number
  cliente: string
  producto: string
  cantidad: number
  precio: number
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO'
  fecha: string
}

function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS')
  const initialFormState: Pedido = {
    cliente: '',
    producto: '',
    cantidad: 0,
    precio: 0,
    estado: 'PENDIENTE',
    fecha: new Date().toISOString().split('T')[0]
    }
  const [formData, setFormData] = useState<Pedido>(initialFormState)

  const fetchPedidos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/pedidos')
      setPedidos(response.data)
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
      setError('No se pudieron cargar los pedidos. Por favor, verifica el backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingPedido?.id) {
        await axios.put(`/api/pedidos/${editingPedido.id}`, formData)
      } else {
        await axios.post('/api/pedidos', formData)
      }
      fetchPedidos()
      closeModal()
    } catch (error) {
      console.error('Error al guardar pedido:', error)
      alert('Error al guardar el pedido. Revisa los datos.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Esta seguro de eliminar este pedido?')) {
      try {
        await axios.delete(`/api/pedidos/${id}`)
        fetchPedidos()
      } catch (error) {
        setError('No se pudo eliminar el pedido. Inténtalo de nuevo.')
        console.error(error)
      }
    }
  }

  const openModal = (pedido?: Pedido) => {
    if (pedido) {
      setEditingPedido(pedido)
      setFormData(pedido)
    } else {
      setEditingPedido(null)
      setFormData(initialFormState)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPedido(null)
  }

  const pedidosFiltrados = useMemo(() => pedidos.filter(pedido => {
    const cumpleBusqueda = 
      pedido.cliente.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      pedido.producto.toLowerCase().includes(searchTerm.trim().toLowerCase())
    const cumpleFiltro = filtroEstado === 'TODOS' || pedido.estado === filtroEstado
    return cumpleBusqueda && cumpleFiltro
  }), [pedidos, searchTerm, filtroEstado])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800'
      case 'COMPLETADO': return 'bg-green-100 text-green-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = useMemo(() => ({
    total: pedidosFiltrados.length,
    ventas: pedidosFiltrados.reduce((sum, p) => sum + (p.cantidad * p.precio), 0),
    pendientes: pedidosFiltrados.filter(p => p.estado === 'PENDIENTE').length
  }), [pedidosFiltrados])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Gestion de Pedidos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Pedidos</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Ventas Totales</h3>
            <p className="text-3xl font-bold text-green-600">${stats.ventas.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendientes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="COMPLETADO">Completado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Nuevo Pedido
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={fetchPedidos}
                className="mt-4 text-blue-600 underline hover:text-blue-800">Reintentar</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Producto</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cantidad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{pedido.id}</td>
                      <td className="px-4 py-3 text-sm">{pedido.cliente}</td>
                      <td className="px-4 py-3 text-sm">{pedido.producto}</td>
                      <td className="px-4 py-3 text-sm">{pedido.cantidad}</td>
                      <td className="px-4 py-3 text-sm">${pedido.precio.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">${(pedido.cantidad * pedido.precio).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                          {pedido.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(pedido.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(pedido)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => pedido.id && handleDelete(pedido.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pedidosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay pedidos que coincidan con los filtros
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    required
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <input
                    type="text"
                    required
                    value={formData.producto}
                    onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Guardando...' : (editingPedido ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
