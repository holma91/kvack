import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    <div className="bg-red-200">Hello from reactovic!!</div>
  </>
);
