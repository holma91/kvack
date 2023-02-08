import { useEffect, useRef, useState } from 'react';

const extensions = ['google', 'google-duckduckgo'];
const shortcuts: { [key: string]: string } = {
  google: 'g',
  'google-duckduckgo': 'gd',
};

export default function Search() {
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState('google-duckduckgo');

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
    api.changeSearchInput(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      api.changeSearchInput('Enter');
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const listeners = [
      api.onNextTab(() => {
        const nextIndex = extensions.indexOf(currentGroup) + 1;
        let nextGroup =
          extensions[nextIndex >= extensions.length ? 0 : nextIndex];
        api.setGroup(nextGroup);
        setCurrentGroup(nextGroup);
        inputRef.current.focus();
      }),
      api.onPreviousTab(() => {
        const nextIndex = extensions.indexOf(currentGroup) - 1;
        let nextGroup =
          extensions[nextIndex < 0 ? extensions.length - 1 : nextIndex];

        api.setGroup(nextGroup);
        setCurrentGroup(nextGroup);
        inputRef.current.focus();
      }),
    ];

    return () => {
      listeners.forEach((removeListener: () => void) => removeListener());
    };
  }, [currentGroup, setCurrentGroup]);

  return (
    <div className="p-4 flex justify-center h-screen bg-[#171717] ">
      <div className="w-[700px]">
        <div className="relative mt-1 flex items-center w-full ">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-lg border-gray-400 p-3 shadow-sm  sm:text-lg bg-neutral-800 text-neutral-400 outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
            <kbd className="inline-flex items-center rounded border border-neutral-600 px-2 font-sans text-sm font-medium text-neutral-600">
              {shortcuts[currentGroup]}
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
