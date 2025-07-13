import { FC, useState, JSX } from "react";

type Props = {
  tabLabels: string[];
  tabContents: JSX.Element[];
};

export const Tabs: FC<Props> = (props) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-mint flex-grow -m-2 overflow-x-hidden rounded-md border border-lightGreen">
      <div 
        aria-label="Pipeline"
        className="flex flex-col max-h-full"
      >
        <div className="w-full max-w-sm mx-auto pt-2 self-start">
          <div className="flex" role="tablist">
            {props.tabLabels.map((label, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={index === i}
                aria-controls={`tabpanel-${i}`}
                id={`tab-${i}`}
                onClick={() => setIndex(i)}
                className={`
                  px-4 py-2 border-0 bg-transparent outline-none cursor-pointer
                  text-darkGreen transition-colors duration-200
                  hover:bg-lightGreen hover:text-mint
                  ${index === i 
                    ? 'text-green font-semibold relative' 
                    : ''
                  }
                `}
              >
                {label}
                {index === i && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-green rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-lightGreen" />
        
        <div className="px-2 py-2 overflow-y-auto bg-mint shadow-inner">
          {props.tabContents.map((content, i) => (
            <div
              key={i}
              role="tabpanel"
              id={`tabpanel-${i}`}
              aria-labelledby={`tab-${i}`}
              className={`overflow-auto max-h-full ${index === i ? 'block' : 'hidden'}`}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
