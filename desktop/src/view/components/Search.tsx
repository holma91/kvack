import { useState } from 'react';

export default function Search() {
  const [input, setInput] = useState('');

  const handleInputChange = (e: any) => {
    console.log(e.target.value);

    setInput(e.target.value);
  };

  return (
    <div className="p-4 flex justify-center h-screen bg-neutral-900">
      <div className="w-[700px]">
        <div className="relative mt-1 flex items-center w-fu ">
          <input
            value={input}
            onChange={handleInputChange}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-lg border-gray-400 p-3 shadow-sm  sm:text-lg bg-neutral-800 text-neutral-400 outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
            <kbd className="inline-flex items-center rounded border border-neutral-600 px-2 font-sans text-sm font-medium text-neutral-600">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}