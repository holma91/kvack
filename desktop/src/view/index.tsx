const nameToUrl: { [key: string]: string } = {
  google: 'https://google.com',
  duckduckgo: 'https://duckduckgo.com',
  wolframalpha: 'https://wolframalpha.com',
  static: 'https://realpython.github.io/fake-jobs/',
};

const calculateViewSize = (width: number, height: number) => {
  const viewWidth = (width * 3) / 4;
};

export default function Home() {
  const setView = (id: string) => {
    api.setView(id);
  };

  const addTab = () => {
    console.log('adding tab');
    api.createView();
  };

  return (
    <div className="flex">
      <aside className="w-[225px] bg-gray-200 h-screen">
        <h3 className="text-lg font-medium p-4">Sites</h3>
        <div className="flex flex-col pt-4">
          {Object.keys(nameToUrl).map((name) => {
            return (
              <div
                key={name}
                className="p-2 pl-4 hover:bg-gray-300 cursor-pointer"
                onClick={() => setView(name)}
              >
                <p className="text-gray-700">{name}</p>
              </div>
            );
          })}
        </div>
      </aside>
      <main id="header" className="flex-1 h-[76px] bg-gray-200">
        <h3 className="text-lg font-medium p-4">Main Content</h3>
      </main>
    </div>
  );
}
