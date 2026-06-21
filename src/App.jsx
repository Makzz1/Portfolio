import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ExperienceDetail from './pages/ExperienceDetail'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
      </Routes>
    </Router>
  )
}
