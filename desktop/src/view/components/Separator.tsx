import { useState } from 'react';

export default function Separator() {
  const [mouseDown, setMouseDown] = useState(false);
  const [positions, setPositions] = useState([]);
  const [prevX, setPrevX] = useState(null);
  const [prevT, setPrevT] = useState(null);

  const resize = (e: any) => {
    if (mouseDown) {
      let currentT = new Date().getTime();
      let currentX = e.screenX;
      if (prevX && prevT) {
        console.log('clientX:', e.clientX);

        api.resizeGroup(prevX, currentX, prevT, currentT, e.clientX);
      }
      setPrevX(currentX);
      setPrevT(currentT);
    }
  };

  const mouseUpOrOut = (e: any) => {
    setMouseDown(false);
    setPrevX(null);
    setPrevT(null);
  };

  return (
    <div className="h-full w-full">
      <div className="flex w-full overflow-hidden">
        <div
          className="h-screen w-3 m-0 p-0 relative cursor-col-resize"
          onMouseMove={resize}
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={mouseUpOrOut}
          // onMouseLeave={mouseUpOrOut}
        ></div>
      </div>
    </div>
  );
}
