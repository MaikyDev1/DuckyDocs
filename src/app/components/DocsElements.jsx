'use client'

import {ExpandableArrow, InfoIcon} from "@/app/components/IconsDB";
import {useState} from "react";
import {CodeBlock} from "@/app/components/AdvancedElements";

export function Title1({ children }) {
    return <div className="text-white text-3xl">{children}</div>;
}

export function Title2({ children }) {
    return <div className="text-white text-2xl">{children}</div>;
}

export function Title3({ children }) {
    return <div className="text-white text-lg">{children}</div>;
}

export function InfoBox ({ children }) {
    return (
        <div className="font-semibold p-3 bg-green-500/80 border border-green-400/30 gap-2 rounded-lg my-2 flex break-all">
            <InfoIcon className="text-green-800 min-h-4 max-h-4 min-w-4 max-w-4 mt-1.5"/>
            {children}
        </div>
    )
}

export function WarningBox ({ children }) {
    return (
        <div className="font-semibold p-3 bg-green-500/80 border border-green-400/30 gap-2 rounded-lg my-2 flex break-all">
            <InfoIcon className="text-green-800 min-h-4 max-h-4 min-w-4 max-w-4 mt-2"/>
            {children}
        </div>
    )
}

export function Expandable ({ children, title }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-gray-100/50 my-2 border backdrop-blur-2xl rounded-lg p-3 border-gray-400/30">
            <div className="text-neutral-800/80 font-semibold cursor-pointer flex items-center select-none" onClick={() => setOpen(!open)}>
                <ExpandableArrow className={`h-5 transition-all duration-500 ${!open ? 'rotate-90' : 'rotate-180'}`}/>
                {title}
            </div>
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out px-5 ${open ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="py-2">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function Code ({ children, title }) {
    return (
        <CodeBlock/>
    );
}