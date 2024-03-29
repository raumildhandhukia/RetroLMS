import React, { useEffect, useRef, useState } from "react"
import "./styles.css"

interface Props {
    children: React.ReactNode
    classNames?: string
    onClick?: () => void
}

export default function EightBitArrowButton(props: Props) {
    const { children, classNames, onClick } = props
    const aRef = useRef<HTMLAnchorElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            if (entry.target === aRef.current) {
              setWidth(aRef.current.clientWidth);
            }
          }
        });
    
        if (aRef.current) {
          resizeObserver.observe(aRef.current);
        }

        return () => {
          if (aRef.current) {
            resizeObserver.unobserve(aRef.current);
          }
        };
      }, []);
    
    console.log(width)

    return (
        <div className="flex m-5 items-center">
            <a className={`eightbit-btn arrow bg-green-500 ${classNames}`} onClick={onClick} ref={aRef}>
                {children}
            </a>
            <div className={`arrow-right-wrapper absolute`} style={{
                    transform: `translateX(${width}px)`
                }}
            >
            </div>
            <div className="arrow-right border-l-green-500 border-l-[60px]">
            </div>
        </div>
    )
}
