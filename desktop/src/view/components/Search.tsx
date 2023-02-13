import { useEffect, useRef, useState } from 'react';
import { FaLock, FaExternalLinkAlt, FaRegCopy } from 'react-icons/fa';
import { searchqueries } from '../utils/searchqueries';

const shortcuts: { [key: string]: string } = {
  google: 'g',
  'google-duckduckgo': 'gd',
  wolframalpha: 'w',
  chatgpt: 'c',
  'google-chatgpt': 'gc',
  twitter: 't',
};

const groupToImage: { [key: string]: string } = {
  google: '/assets/images/google.png',
  duckduckgo: '/assets/images/ddg.png',
  chatgpt: '/assets/images/openaipink.png',
  wikipedia: '/assets/images/wikipedia.png',
  stackoverflow: '/assets/images/stackoverflow.png',
  twitter: '/assets/images/twitter.png',
};

const groupToImages: { [key: string]: string[] } = {
  google: [groupToImage['google']],
  'google-duckduckgo': [groupToImage['google'], groupToImage['duckduckgo']],
  chatgpt: [groupToImage['chatgpt']],
  'google-chatgpt': [groupToImage['google'], groupToImage['chatgpt']],
  twitter: [groupToImage['twitter']],
};

const groupToHaveTabs: { [key: string]: boolean } = {
  google: false,
  'google-duckduckgo': true,
  chatgpt: false,
  'google-chatgpt': false,
  twitter: false,
};

export default function Search() {
  const [input, setInput] = useState('');
  const [currentGroup, setCurrentGroup] = useState('chatgpt');
  const [currentTab, setCurrentTab] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [groups, setGroups] = useState([]);

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
    api.changeSearchInput(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      api.changeSearchInput('Enter');
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();

    // catch the config here

    const listeners = [
      api.onGroupsChange((_: any, newGroups: string[]) => {
        setGroups(newGroups);
      }),
      api.onSelectedGroupChange((_: any, newSelectedGroup: string) => {
        setCurrentGroup(newSelectedGroup);
        inputRef.current.focus();
      }),
      api.onSelectedTabChange((_: any, newSelectedTab: number) => {
        setCurrentTab(newSelectedTab);
      }),
      api.onShowSidebarChange((_: any, newShowSidebarValue: boolean) => {
        setShowSidebar(newShowSidebarValue);
      }),
    ];

    return () => {
      listeners.forEach((removeListener: () => void) => removeListener());
    };
  }, [
    currentGroup,
    setCurrentGroup,
    currentTab,
    setCurrentTab,
    showSidebar,
    setShowSidebar,
  ]);

  const tabs = [];
  // const groups = [];

  return (
    <div className="flex bg-[#171717]">
      {showSidebar && (
        <div className="w-[275px] flex flex-col gap-2 text-neutral-500 h-screen pt-1">
          <div className="pl-4 pt-4 pr-1 flex gap-3 flex-wrap">
            {groups.map((group) => {
              const extensions = group.split('-');
              let style =
                'flex gap-2 p-3 rounded-md cursor-pointer hover:bg-[#34373A]';
              if (group === currentGroup) {
                style += ' bg-[#34373A]';
              } else {
                style += ' bg-[#1e2022]';
              }
              return (
                <div className={style}>
                  {extensions.map((extension: string) => {
                    return (
                      <img
                        src={groupToImage[extension]}
                        className="w-[18px] h-[18px]"
                      ></img>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="pl-4 pr-4 pt-2">
            <div className="flex gap-2 p-2 pl-3 pr-3 rounded-md bg-[#1e2022] cursor-pointer hover:bg-[#34373A] justify-between items-center">
              {/* here we need to get all the urls from the selected group */}
              <div className="flex gap-2 items-center text-sm">
                <FaLock className="w-3 h-3" />
                google.com/?q=hello
              </div>
              <div className="flex gap-2 items-center text-sm">
                <FaRegCopy className="w-3 h-3" />
                <FaExternalLinkAlt className="w-3 h-3" />
              </div>
            </div>
          </div>
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
            <div className="w-full">
              <div className="relative mt-1 flex items-center w-full ">
                <input
                  value="search history"
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-lg border-gray-400 p-3 shadow-sm  sm:text-lg bg-[#1e2022] text-neutral-500 outline-none"
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
              className="block w-full rounded-lg border-gray-400 p-3 shadow-sm  sm:text-lg bg-[#1e2022] text-neutral-400 outline-none"
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
