import { useEffect, useState } from 'react';

import { defaultSettings } from '../../utils/settings';
const extensions = ['wikipedia', 'google-duckduckgo'];

export default function Home() {
  const [currentView, setCurrentView] = useState('google-duckduckgo');
  const setView = (id: string) => {
    api.setGroup(id);
    setCurrentView(id);
  };

  useEffect(() => {
    const listeners = [
      api.onNextTab(() => {
        const nextIndex = extensions.indexOf(currentView) + 1;
        let nextView =
          extensions[nextIndex >= extensions.length ? 0 : nextIndex];

        api.setGroup(nextView);
        setCurrentView(nextView);
      }),
      api.onPreviousTab(() => {
        const nextIndex = extensions.indexOf(currentView) - 1;
        let nextView =
          extensions[nextIndex < 0 ? extensions.length - 1 : nextIndex];

        api.setGroup(nextView);
        setCurrentView(nextView);
      }),
    ];

    return () => {
      listeners.forEach((removeListener: () => void) => removeListener());
    };
  }, [currentView, setCurrentView]);

  return (
    <div className="flex">
      <main id="header" className="flex-1 h-[76px] bg-gray-200 flex">
        {/* <h3 className="text-lg font-medium p-6">Extensions</h3> */}
        {Object.keys(defaultSettings.groups).map((name) => {
          return (
            <div
              id="tab"
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
