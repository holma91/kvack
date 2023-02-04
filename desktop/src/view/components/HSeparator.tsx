import { useState, useRef, useEffect } from 'react';

export default function HSeparator() {
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
      Math.min(resizer.current.offsetLeft - pos1.current, 1100)
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
    api.onWindowResize((leftOffset: number) => {
      resizer.current.style.left = leftOffset + 'px';
    });
  }, []);

  return (
    <div
      id="resizer"
      className="absolute z-10 bg-red-400 text-center"
      ref={resizer}
    >
      <div
        className="p-0 cursor-move w-[50px] h-screen z-20 bg-red-400 text-white"
        onMouseDown={dragMouseDown}
      ></div>
    </div>
  );
}
