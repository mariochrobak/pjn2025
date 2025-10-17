import { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { MenuOutlined, TeamOutlined, BankOutlined, PartitionOutlined } from '@ant-design/icons';
import { PaginaEmpleados } from './pages/PaginaEmpleados';
import { PaginaEdificios } from './pages/PaginaEdificios';
import { PaginaDependencias } from './pages/PaginaDependencias';
import { PaginaHistorialTraslados } from './pages/PaginaHistorialTraslados'; 
import { PaginaEmpleadosPorFiltro } from './pages/PaginaEmpleadosPorFiltro';
import esES from 'antd/locale/es_ES'; 
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '1', icon: <BankOutlined />, label: <Link to="/">Edificios</Link> },
  { key: '2', icon: <PartitionOutlined />, label: <Link to="/dependencias">Dependencias</Link> },  
  { key: '3', icon: <TeamOutlined />, label: <Link to="/empleados">Empleados</Link> },
];

function App() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const routeKeyMap: { [key: string]: string } = {
    '/': '1',
    '/dependencias': '2',
    '/empleados': '3',
 };

  return (
    <ConfigProvider locale={esES}>
      <Layout className="app-layout">
        <Sider  width={180} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: "center" }}>
            <Title level={4}><MenuOutlined /></Title>
          </div>
          <Menu 
            theme="dark" 
            selectedKeys={[routeKeyMap[location.pathname]]} 
            mode="inline"
            items={menuItems}          
          />
        </Sider>      
        <Layout style={{ background: '#fff' }}>
          <Header className="app-header">
            <Title level={3} style={{ margin: 0 }}>Poder Judicial de Neuquén</Title>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<PaginaEdificios />} />
                <Route path="/dependencias" element={<PaginaDependencias />} />
                <Route path="/empleados" element={<PaginaEmpleados />} />
                <Route  path="/empleados/:empleadoId/historial" element={<PaginaHistorialTraslados />} />
                <Route path="/edificios/:edificioId/empleados" element={<PaginaEmpleadosPorFiltro />} />
                <Route path="/dependencias/:dependenciaId/empleados" element={<PaginaEmpleadosPorFiltro />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>    
  );
}

export default App;