import { useEffect, useRef, useState } from 'react';
import { searchqueries } from '../utils/searchqueries';
const defaultExtensions = ['google', 'google-duckduckgo', 'google-chatgpt'];
const otherExtensions = ['google', 'chatgpt', 'google-chatgpt'];
const shortcuts: { [key: string]: string } = {
  google: 'g',
  'google-duckduckgo': 'gd',
  wolframalpha: 'w',
  chatgpt: 'c',
  'google-chatgpt': 'gc',
};

const groupToImage: { [key: string]: string } = {
  g: '/assets/images/google.png',
  d: '/assets/images/ddg.png',
  c: '/assets/images/openaipink.png',
  w: '/assets/images/openaipink.png',
};

const groupToImages: { [key: string]: string[] } = {
  google: [groupToImage['g']],
  'google-duckduckgo': [groupToImage['g'], groupToImage['d']],
  chatgpt: [groupToImage['c']],
  'google-chatgpt': [groupToImage['g'], groupToImage['c']],
};

const groupToHaveTabs: { [key: string]: boolean } = {
  google: false,
  'google-duckduckgo': true,
  chatgpt: false,
  'google-chatgpt': false,
};

export default function Search() {
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState('google-duckduckgo');
  const [currentTab, setCurrentTab] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);

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
  const extensions = defaultExtensions;

  useEffect(() => {
    inputRef.current.focus();

    const listeners = [
      api.onNextTab((_: any, newSelectedTab: number) => {
        // alert(newSelectedTab);
        setCurrentTab(newSelectedTab);
      }),
      api.onNextGroup(() => {
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
      api.onShowSidebar(() => {
        setShowSidebar(true);
      }),
      api.onHideSidebar(() => {
        setShowSidebar(false);
      }),
    ];

    return () => {
      listeners.forEach((removeListener: () => void) => removeListener());
    };
  }, [currentGroup, setCurrentGroup]);

  return (
    <div className="flex bg-[#171717]">
      {showSidebar && (
        <div className="w-[275px] flex flex-col gap-2 text-neutral-500 h-screen">
          <div className="h-[90%] overflow-auto scrollbar-hide p-3">
            {searchqueries.map((query) => {
              return (
                <div className="p-3 flex items-center gap-3 hover:bg-neutral-700 rounded-md cursor-pointer">
                  <img
                    src={groupToImage[query.group]}
                    className="w-[18px] h-[18px]"
                  ></img>
                  <p>{query.query.slice(0, 40)}</p>
                </div>
              );
            })}
          </div>
          <div className="p-5 pt-0">
            {/* <p className=" text-neutral-300 text-2xl">History</p> */}
            <div className="w-full">
              <div className="relative mt-1 flex items-center w-full ">
                <input
                  value="search history"
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-lg border-gray-400 p-3 shadow-sm  sm:text-lg bg-neutral-800 text-neutral-500 outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
                  <kbd className="inline-flex items-center rounded border border-neutral-600 px-2 font-sans text-sm font-medium text-neutral-600">
                    ⌘H
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={'p-4  flex h-screen flex-1 ' + (showSidebar ? 'pl-0' : '')}
      >
        <div className="w-full">
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
            <div className="absolute inset-y-0 right-0 flex gap-4 py-2 pr-2 items-center">
              <kbd className="inline-flex items-center rounded border border-neutral-600 p-2 font-sans text-sm font-medium text-neutral-600">
                ⌘K
              </kbd>
              <div className="flex items-center gap-2 border-l-2 border-neutral-700 mr-2 p-1 pl-4">
                {groupToImages[currentGroup].map((image, i) => {
                  let style = '';
                  if (image === '/assets/images/ddg.png') {
                    style = 'w-[30px] h-[30px]';
                  } else {
                    style = 'w-[22px] h-[22px]';
                  }
                  if (i !== currentTab && groupToHaveTabs[currentGroup]) {
                    style += ' grayscale';
                  }
                  return <img src={image} className={style}></img>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
