import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get('/api/')
      .then(res => setMessage(res.data))
      .catch(console.error);
  }, []);

  return <div>{message}</div>;
}

export default App;
