import { useState } from 'react';

import { idToUrl } from '../utils/utils';

export default function Home() {
  const [currentView, setCurrentView] = useState('chatgpt');
  const setView = (id: string) => {
    api.setView(id);
    setCurrentView(id);
  };

  const addTab = () => {
    console.log('adding tab');
    api.createView();
  };

  // listens for tab changes here and make the state change

  return (
    <div className="flex">
      <main id="header" className="flex-1 h-[76px] bg-gray-200 flex">
        {/* <h3 className="text-lg font-medium p-6">Extensions</h3> */}
        {Object.keys(idToUrl).map((name) => {
          return (
            <div
              key={name}
              className={
                `p-6 hover:bg-gray-300 cursor-pointer ` +
                (currentView === name ? 'bg-gray-300' : '')
              }
              onClick={() => setView(name)}
            >
              <p className="text-gray-700">{name}</p>
            </div>
          );
        })}
      </main>
    </div>
  );
}
