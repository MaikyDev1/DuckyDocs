import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierForestLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const CodeBlock = ({children, language, title, lineNumbers}) => {
  return (
      <div className="flex flex-col my-2">
          {title ? <div className="flex">
              <div className="bg-[#f1efee] rounded-tl-lg rounded-tr-lg p-0.5 px-4">
                  {title}
              </div>
          </div> : null }
          <SyntaxHighlighter className={`border-gray-200/50 p-1 border ${title ? "rounded-bl-lg rounded-br-lg rounded-tr-lg" : "rounded-lg"}`} showLineNumbers={lineNumbers === "true"} language={language} style={atelierForestLight}>
              {children}
          </SyntaxHighlighter>
      </div>
  );
};

export const Table = ({children, language, title, lineNumbers}) => {
    return (
        <div className="flex flex-col my-2">
            {title ? <div className="flex">
                <div className="bg-[#f1efee] rounded-tl-lg rounded-tr-lg p-0.5 px-4">
                    {title}
                </div>
            </div> : null }
            <SyntaxHighlighter className={`border-gray-200/50 p-1 border ${title ? "rounded-bl-lg rounded-br-lg rounded-tr-lg" : "rounded-lg"}`} showLineNumbers={lineNumbers === "true"} language={language} style={atelierForestLight}>
                {children}
            </SyntaxHighlighter>
        </div>
    );
};
