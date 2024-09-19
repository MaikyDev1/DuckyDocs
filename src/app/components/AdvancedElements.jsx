import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierForestLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const CodeBlock = ({children, language, title, lineNumbers}) => {
  return (
      <SyntaxHighlighter className="border-gray-200/50 my-2 rounded-lg p-1 border" showLineNumbers={lineNumbers} language={language} style={atelierForestLight}>
        {children}
      </SyntaxHighlighter>
  );
};