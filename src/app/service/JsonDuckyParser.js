// make the duck fly

import * as fs from "node:fs";
import {CodeBlock} from "@/app/components/AdvancedElements";
import {Expandable} from "@/app/components/DocsElements";

const mainTextColor = "#dcdde2"
const mainFontSize = "18"

async function readJsonFile(path) {
    const raw = await fs.readFile(path, 'utf8');
    return JSON.parse(raw);
}

export const DuckyMagic = async ({file}) => {
    const data = fs.readFileSync(process.cwd() + `/ducky/${file}`);
    const obj = JSON.parse(data.toString());
    return renderJsonArray(obj);
}

// This is a recursive function :)
function renderJsonArray(json) {
    let html = [];
    if (!Array.isArray(json)) return html;
    for (const a of json) {
        console.log(a)
        html.push(ObjectToHtml(a));
    }
    return html;
}

function ObjectToHtml (json) {
    switch (json.type) {
        case "title":
            return <p className="text-main-text text-2xl">{applyFormation(json.content)}</p>
        case "title-1":
            return <p className="text-main-text text-xl">{applyFormation(json.content)}</p>
        case "p":
            return <p className="text-main-text">{applyFormation(json.content)}</p>
        case "no-format":
          return <p className="text-main-text">{json.content}</p>
        case "break":
            return <div className="h-5"/>
        case "divider":
            const space= json.space ? json.space : 12;
            const size= json.size ? json.size : 2;
            return <div className="border-stone-200" style={{borderBottomWidth: `${size}px`, margin: `${space}px 0 ${space}px 0`}}/>
        case "table":
            let table_data = [];
            let table_header = [];

            // table header
            for (const a of json.content.header) {
                table_header.push(<th className="border border-black">{a.content}</th>)
            }

            // table content
            let table_rows = [];
            let counter = 0;
            for (const a of json.content.rows) {
                counter ++;
                table_rows.push(<td className="bg-stone-700">{ObjectToHtml(a)}</td>)
                if (counter === json.content.header.length) {
                    counter = 0;
                    table_data.push(<tr className="border-t">{table_rows}</tr>)
                    table_rows = [];
                }
            }
            return (
                <table className="w-full p-2">
                    <thead>
                        <tr className="bg-stone-200 text-stone-800">{table_header}</tr>
                    </thead>
                    <tbody>
                        {table_data}
                    </tbody>
                </table>
            )
        case "code":
            return GenerateCodeBlock(json);
        case "test": {
            return GenerateQuestionBlock(json)
        }
        case "expand":
            let content = [];
            for (const a of json.content) {
                content.push(ObjectToHtml(a))
            }
            return <Expandable title={json.title}>{content}</Expandable>
        default:
            return [];
    }
}

function GenerateQuestionBlock(json) {
    let content = [];
    for (const a of json.questions) {
        content.push(
          <div className="flex gap-2" id={a.correct !== undefined ? a.correct : false}>
              <input type="checkbox"/>
              {ObjectToHtml(a)}
          </div>
        )
    }
    return (
      <div className="p-2 gap-2 flex flex-col">
          {content}
          <button>Check</button>
      </div>
    )
}

function GenerateCodeBlock(json) {
    return (
        <CodeBlock title={json.title ? json.title : null} lineNumbers={json.lines ? json.lines : false} language={json.language ? json.language : "none"}>
            {json.code}
        </CodeBlock>
    )
}

// Color the duck


function getColor(color, alpha) {
    if(color.includes("#")) return hexToRGB(color, alpha)
    switch (color.toLocaleLowerCase()) {
        case "black": return `rgb(0 0 0 / ${alpha ? alpha : 1})`
        case "white": return `rgb(255 255 255 / ${alpha ? alpha : 1})`
        case "red": return `rgb(219 61 33 / ${alpha ? alpha : 1})`
        case "lime": return `rgb(105 227 52 / ${alpha ? alpha : 1})`
        case "green": return `rgb(24 165 88 / ${alpha ? alpha : 1})`
        case "blue": return `rgb(100 149 237 / ${alpha ? alpha : 1})`
        case "yellow": return `rgb(250 237 52 / ${alpha ? alpha : 1})`
        case "cyan": return `rgb(29 196 222 / ${alpha ? alpha : 1})`
        case "orange": return `rgb(242 140 40 / ${alpha ? alpha : 1})`
        case "magenta": return `rgb(236 143 208 / ${alpha ? alpha : 1})`
        case "silver": return `rgb(156 163 175 / ${alpha ? alpha : 1})`
        case "gray": return `rgb(64 64 64 / ${alpha ? alpha : 1})`
        case "purple": return `rgb(47 60 126 / ${alpha ? alpha : 1})`
        case "maroon": return `rgb(92 39 39 / ${alpha ? alpha : 1})`
        case "rose": return `rgb(255 0 128 / ${alpha ? alpha : 1})`
        default: return `rgb(255 255 255 / ${alpha ? alpha : 1})`
    }
}

function hexToRGB(h, a) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length === 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length === 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    return `rgb(${+(r)} ${+g} ${+b} / ${a ? a : 1})`;
}

function applyFormation(line, defaultColor) {
    if(line === undefined) return line;
    let string = line;
    let html = [];
    let matcher = null;
    let color = defaultColor ? defaultColor : mainTextColor;
    while(true) {
        matcher = string.match(/([^{]*){([^}]*)}(.*)/);
        if (!matcher) { html.push(<span style={{color: getColor(color)}}>{parseIndents(string, color)}</span>); break; }
        html.push(<span style={{color: getColor(color)}}>{parseIndents(matcher[1], color)}</span>)
        color = matcher[2].includes("reset") ? defaultColor ? defaultColor : mainTextColor : matcher[2];
        string = matcher[3];
    }
    return html;
}

function parseIndents(text, color) {
    if(text === undefined) return text;
    let html = [];
    let next = text;
    let matcher = null;
    const regex = /([^\*\|`)]*)(\*\*|\*|\||`)([^\*\|`]*)\2(.*)/;
    while(true) {
        matcher = next.match(regex);
        if (!matcher) { html.push(parseOtherStuff(next, color)); break; }
        html.push(parseOtherStuff(matcher[1], color))
        switch (matcher[2]) {
            case "none":
                html.push(<span>{parseOtherStuff(matcher[1], color)}</span>);
                break
            case "**":
                html.push(<span className="font-extrabold">{matcher[3]}</span>);
                break
            case "*":
                html.push(<span className="italic pr-0.5">{matcher[3]}</span>);
                break
            case "`":
                html.push(<span className="p-1 px-2 bg-neutral-700/90 rounded font-normal font-mono text-red-500/90">{matcher[3]}</span>);
                break
            case "|":
                html.push(<span className="p-0.5 px-1 rounded drop-shadow-lg text-white backdrop-blur-xl font-semibold" style={{backgroundColor: getColor(color, 0.3), color: getColor(color, 0.9)}}>{matcher[3]}</span>);
                break
        }
        next = matcher[4];
    }
    return html;
}

function parseOtherStuff(text, color) {
    if(text === undefined) return text;
    let html = [];
    let next = text;
    let matcher = null;
    const regex = /([^\[]*)\[url (?:href|link)="([^\"]*)"\]([^\[]*)\[\/url\](.*)/;
    while(true) {
        matcher = next.match(regex);
        if (!matcher) {
            html.push(<span>{next}</span>);
            break;
        }
        html.push(<span>{matcher[1]}</span>);
        html.push(<a href={matcher[2]} className="underline underline-offset-2 font-semibold" style={{color: color.includes("white") ? "rgb(50 97 199 / 1)" : color}}>{matcher[3]}</a>);
        next = matcher[4];
    }
    return html;
}

function removeIndents(lines) {
    const minIndent = lines.reduce((min, line) => {
        const match = line.match(/^[ \t]+/);
        if (match) return Math.min(min, match[0].length);
        return min;
    }, Infinity);

    if (minIndent === Infinity) return lines;

    const trimmedLines = lines.map(line => line.replace(new RegExp(`^[ \t]{0,${minIndent}}`), ''));

    return trimmedLines.join('\n');
}