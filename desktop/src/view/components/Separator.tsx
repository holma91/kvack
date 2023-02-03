import { useState, useRef, useEffect } from 'react';

export default function Separator() {
  const [mouseDown, setMouseDown] = useState(false);
  const [positions, setPositions] = useState([]);
  const [prevX, setPrevX] = useState(null);
  const [prevT, setPrevT] = useState(null);

  // let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // const [pos, setPos] = useState([0, 0, 0, 0]);

  const resize = (e: any) => {
    e.preventDefault();
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
    e.preventDefault();
    setMouseDown(false);
    setPrevX(null);
    setPrevT(null);
  };

  const resizer = useRef(null);
  let pos1 = useRef(0);
  let pos2 = useRef(0);
  let pos3 = useRef(0);
  let pos4 = useRef(0);

  const dragMouseDown = (e: any) => {
    e = e || window.event;
    e.preventDefault();

    pos3.current = e.clientX;
    pos4.current = e.clientY;
    document.onmouseup = closeDragElement;

    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  };

  const elementDrag = (e: any) => {
    e = e || window.event;
    e.preventDefault();
    pos1.current = pos3.current - e.clientX;
    pos2.current = pos4.current - e.clientY;
    pos3.current = e.clientX;
    pos4.current = e.clientY;

    const minMax = Math.max(
      40,
      Math.min(resizer.current.offsetLeft - pos1.current, 780)
    );
    resizer.current.style.left = minMax + 'px';

    // ipcRenderer.send("resize-bar", minMax)
    api.resizeBar(minMax);
  };

  const closeDragElement = () => {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  };

  useEffect(() => {
    const initValue = 650; // get this value from the current group
    resizer.current.style.left = initValue + 'px';

    // listen for resize event
  }, []);

  return (
    <div className="absolute z-10 bg-red-400 text-center" ref={resizer}>
      <div
        className="p-0 cursor-move w-[5px] h-screen z-20 bg-red-400 text-white"
        onMouseDown={dragMouseDown}
      ></div>
    </div>
    // <div className="h-full w-full">
    //   <div className="flex w-full overflow-hidden">
    //     <div
    //       className="h-screen w-3 m-0 p-0 relative cursor-col-resize"
    //       onMouseMove={resize}
    //       onMouseDown={() => setMouseDown(true)}
    //       onMouseUp={mouseUpOrOut}
    //       // onMouseOut={mouseUpOrOut}
    //     ></div>
    //   </div>
    // </div>
  );
}
