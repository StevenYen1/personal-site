import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import YoutubeVideos from './components/videos/YoutubeVideos';
import Blog from './components/Blog';
import Games from './components/Games';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/youtube" element={<YoutubeVideos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/games" element={<Games />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;