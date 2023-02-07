import { createRoot } from 'react-dom/client';
import Home from './entries/index';
import Blank from './components/Blank';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Home />);
