import { useState, useRef, useEffect } from 'react';

export default function VSeparator() {
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

    document.onmousemove = elementDrag;
  };

  const elementDrag = (e: any) => {
    e = e || window.event;
    e.preventDefault();
    pos1.current = pos3.current - e.clientX;
    pos2.current = pos4.current - e.clientY;
    pos3.current = e.clientX;
    pos4.current = e.clientY;

    const currentWidth = window.innerWidth;

    const minMax = Math.max(
      40,
      Math.min(resizer.current.offsetLeft - pos1.current, currentWidth - 40)
    );
    resizer.current.style.left = minMax + 'px';
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
    <div id="resizer" className="absolute z-10 text-center" ref={resizer}>
      <div
        className="p-0 cursor-col-resize w-[50px] bg-blue-200 h-screen z-20 text-white hover:bg-blue-300"
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
