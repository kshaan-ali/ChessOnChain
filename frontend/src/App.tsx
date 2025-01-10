import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Game from './page/game'
import Dashboard from './page/dashboard'
import { RecoilRoot } from 'recoil'
import Inventory from './page/inventory'
import Crates from './page/crates'

function App() {

  return (
    <div>
      <RecoilRoot>
      <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/game" element={<Game />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/crates" element={<Crates />} />
    </Routes>
  </BrowserRouter>
  </RecoilRoot>
    </div>
  )
}

export default App
