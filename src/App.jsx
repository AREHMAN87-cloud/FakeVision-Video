import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ImageDetection from './pages/ImageDetection'
import VideoDetection from './pages/VideoDetection'
import DetectedMedia from './pages/DetectedMedia'
import Settings from './pages/Settings'
import Auth from './pages/Auth'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/image-detection" element={<ImageDetection />} />
        <Route path="/video-detection" element={<VideoDetection />} />
        <Route path="/detected-media" element={<DetectedMedia />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
