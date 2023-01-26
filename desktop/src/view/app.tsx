import { createRoot } from 'react-dom/client';
import Home from './index';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Home />);
