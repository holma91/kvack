const sites = ['google', 'stackoverflow', 'reddit', 'wolframalpha'];

export default function Home() {
  const goToSite = (site: string) => {
    api.openSite(site);
    // load site in a BrowserView?
  };

  return (
    <div className="flex">
      <aside className="w-3/12 bg-gray-200 h-screen">
        <h3 className="text-lg font-medium p-4">Sites</h3>
        <div className="flex flex-col pt-4">
          {sites.map((site) => {
            return (
              <div
                key={site}
                className="p-2 pl-4 hover:bg-gray-300 cursor-pointer"
                onClick={() => goToSite(site)}
              >
                <p className="text-gray-700">{site}</p>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="w-8/12 p-4">
        <h1 className="text-2xl font-medium">Main Content</h1>
        <p className="text-gray-700">Some main content goes here</p>
      </main>
    </div>
  );
}
