import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopBar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
