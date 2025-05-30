import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import PedidoService from '../../services/PedidoService';
import ProductoService from '../../services/ProductoService';
import '../../styles/dashboard.css';

// Registrar los componentes necesarios de ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardCharts = () => {
  const [pedidosData, setPedidosData] = useState(null);
  const [productosData, setProductosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de pedidos
        const pedidosResponse = await PedidoService.getAllPedidos();
        const pedidos = pedidosResponse.data;
        
        // Obtener datos de productos
        const productosResponse = await ProductoService.getAllProductos();
        const productos = productosResponse.data;
        
        // Procesar datos para el gráfico de estados de pedidos
        const estadosPedidos = {};
        pedidos.forEach(pedido => {
          const estado = pedido.estado.toLowerCase();
          estadosPedidos[estado] = (estadosPedidos[estado] || 0) + 1;
        });
        
        // Datos para el gráfico circular de estados de pedidos
        const pieData = {
          labels: Object.keys(estadosPedidos).map(estado => 
            estado.charAt(0).toUpperCase() + estado.slice(1)
          ),
          datasets: [
            {
              data: Object.values(estadosPedidos),
              backgroundColor: [
                '#4a90e2', // Azul - Pendiente
                '#f0ad4e', // Naranja - En proceso
                '#5cb85c', // Verde - Completado
                '#d9534f', // Rojo - Cancelado
                '#5bc0de', // Celeste - Otros estados
              ],
              borderWidth: 1,
            },
          ],
        };
        
        // Procesar datos para el gráfico de productos más vendidos
        const productoVentas = {};
        pedidos.forEach(pedido => {
          if (pedido.detalles) {
            pedido.detalles.forEach(detalle => {
              if (detalle.producto && detalle.producto.nombre) {
                const nombreProducto = detalle.producto.nombre;
                productoVentas[nombreProducto] = (productoVentas[nombreProducto] || 0) + detalle.cantidad;
              }
            });
          }
        });
        
        // Ordenar productos por cantidad vendida y tomar los 5 más vendidos
        const topProductos = Object.entries(productoVentas)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        
        // Datos para el gráfico de barras de productos más vendidos
        const barData = {
          labels: topProductos.map(([nombre]) => nombre),
          datasets: [
            {
              label: 'Unidades vendidas',
              data: topProductos.map(([, cantidad]) => cantidad),
              backgroundColor: '#4a90e2',
              borderColor: '#3a7bc8',
              borderWidth: 1,
            },
          ],
        };
        
        setPedidosData(pieData);
        setProductosData(barData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos para gráficos:', err);
        setError('No se pudieron cargar los datos para los gráficos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos para gráficos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-charts">
      <h2 className="dashboard-title">Panel de Estadísticas</h2>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Estado de Pedidos</h3>
          <div className="chart-wrapper">
            {pedidosData && <Pie data={pedidosData} options={{ responsive: true }} />}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Productos Más Vendidos</h3>
          <div className="chart-wrapper">
            {productosData && (
              <Bar 
                data={productosData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Unidades vendidas'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Productos'
                      }
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h4>Total de Pedidos</h4>
          <p className="summary-value">
            {pedidosData ? pedidosData.datasets[0].data.reduce((a, b) => a + b, 0) : 0}
          </p>
        </div>
        
        <div className="summary-card">
          <h4>Pedidos Completados</h4>
          <p className="summary-value">
            {pedidosData ? 
              pedidosData.datasets[0].data[pedidosData.labels.findIndex(label => 
                label.toLowerCase() === 'completado')] || 0 : 0}
          </p>
        </div>
        
        <div className="summary-card">
          <h4>Pedidos Pendientes</h4>
          <p className="summary-value">
            {pedidosData ? 
              pedidosData.datasets[0].data[pedidosData.labels.findIndex(label => 
                label.toLowerCase() === 'pendiente')] || 0 : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
