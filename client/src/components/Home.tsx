import { Link } from 'react-router-dom';
import Footer from './Footer';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Yippeeeeeee!</h1>
      <ul className="home-links">
        <li><Link to="/youtube">YouTube Videos</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/games">Games</Link></li>
      </ul>
      <Footer />
    </div>
  );
};

export default Home;
