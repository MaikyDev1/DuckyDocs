import * as readline from "readline";
import * as fs from "fs";
import {Title1, Title2} from "@/app/components/DocsElements";

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

const DuckyMagic = async ({file}) => {
    const filestream = await fs.createReadStream(process.cwd() + `/ducky/${file}`);

    let html = [];

    const rl = readline.createInterface({ input: filestream, crlfDelay: Infinity });
    let proprieties = {}
    let lines = '';
    for await (const line of rl) {
        if(line === undefined) continue;
        if(line.startsWith("apply")) {
            const matcher = line.match(/apply ([^:]*): (.*)/);
            if(matcher) {
                switch (matcher[1]) {
                    case "background":
                        proprieties.background = matcher[2];
                        break;
                    case "padding":
                        proprieties.padding = matcher[2];
                        break;
                }
            } else {
                console.log("Found an error with the line NaN skipped");
            }
        } else if(!line.startsWith("//")) {
            const regex = /\[(\w*)]\W?(.*)?/gm;
            if(line.match(regex)) {
                const matcher = regex.exec(line);
                switch (matcher[1]) {
                    case "h1":
                        html.push(<Title1>{applyFormation(matcher[2])}</Title1>); break;
                    case "h2":
                        html.push(<Title2>{applyFormation(matcher[2])}</Title2>); break;
                    case "h3":
                        html.push(<Title2>{applyFormation(matcher[2])}</Title2>); break;
                    case "divider":
                        html.push(<div className="border-b-2 my-3"/>); break;
                    case "break":
                        html.push(<div className="h-5"/>); break;
                    default:
                        html.push(<p className="text-white">{applyFormation(matcher[2])}</p>);
                }
            }
        }
    }
    return <div style={proprieties}>
        {html}
    </div>;
}

function applyFormation(line) {
    if(line === undefined) return line;
    let string = line;
    let html = [];
    let matcher = null;
    let color = "white";
    while(true) {
        matcher = string.match(/([^{]*){([^}]*)}(.*)/);
        if (!matcher) { html.push(<span style={{color: getColor(color)}}>{parseIndents(string, color)}</span>); break; }
        html.push(<span style={{color: getColor(color)}}>{parseIndents(matcher[1], color)}</span>)
        color = matcher[2];
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
        console.log(next);
        console.log(matcher);
        if (!matcher) { html.push(<span>{next}</span>); break; }
        html.push(<span>{matcher[1]}</span>)
        console.log(matcher[2]);
        switch (matcher[2]) {
            case "none":
                html.push(<span>{matcher[1]}</span>);
                break
            case "**":
                html.push(<span className="font-extrabold">{matcher[3]}</span>);
                break
            case "*":
                html.push(<span className="italic pr-0.5">{matcher[3]}</span>);
                break
            case "`":
                html.push(<span className="p-1 bg-neutral-700/60 rounded text-red-500/90">{matcher[3]}</span>);
                break
            case "|":
                html.push(<span className="p-0.5 rounded drop-shadow-lg text-white backdrop-blur-xl font-semibold" style={{backgroundColor: getColor(color, 0.3), color: getColor(color, 0.9)}}>{matcher[3]}</span>);
                break
        }
        next = matcher[4];
    }
    return html;
}

export default DuckyMagic;