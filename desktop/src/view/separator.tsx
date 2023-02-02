import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

function Separator() {
  return (
    <div>
      <p> hey</p>
    </div>
  );
}

root.render(<Separator />);
