import * as readline from "readline";
import * as fs from "fs";
import {Expandable, InfoBox, Title1, Title2} from "@/app/components/DocsElements";
import {CodeBlock} from "@/app/components/AdvancedElements";
import {CodeFailed} from "@/app/components/AdminElements";

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

const mainTextColor = "#000"
const mainFontSize = "18"

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
    let under = 0;
    const underElement = new Map();
    function getContent (substract) {
        if(underElement.has(substract ? under-substract : under)) { return underElement.get(substract ? under-substract : under).content; }
        return html;
    }
    function getProps () {
        if(underElement.has(under)) { return underElement.get(under).props; }
        return null;
    }
    function getName () {
        if(underElement.has(under)) { return underElement.get(under).element; }
        return null;
    }
    function getOther (other, substract) {
        if(underElement.has(substract ? under-substract : under)) { return underElement.get(substract ? under-substract : under)[other]; }
        return null;
    }

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
            if(getName() === "code" && !line.includes("/code")) {
                getContent().push(line); continue;
            }
            const regex = /\[([^ ]*)\W?([^\]]*)?/;
            const content = line.split(/](.*)/s);
            if(line.match(regex)) {
                const matcher = regex.exec(content[0]);
                switch (matcher[1]) {
                    case "h1":
                        getContent().push(<Title1>{applyFormation(content[1])}</Title1>); break;
                    case "h2":
                        getContent().push(<Title2>{applyFormation(content[1])}</Title2>); break;
                    case "h3":
                        getContent().push(<Title2>{applyFormation(content[1])}</Title2>); break;
                    case "p":
                        getContent().push(<p className="text-white">{applyFormation(content[1])}</p>); break
                    case "divider":
                        let space=12, size=2;
                        // check for params
                        if(matcher[2] !== "") {
                            const regex = /(\w*)="([^"]*)"/gm;
                            let mat;
                            while((mat = regex.exec(matcher[2])) !== null) {
                                switch (mat[1]) {
                                    case "size": size = mat[2]; break;
                                    case "space": space = mat[2]; break;
                                }
                            }
                        }
                        getContent().push(<div style={{borderBottomWidth: `${size}px`, margin: `${space}px 0 ${space}px 0`}}/>); break;
                    case "break":
                        getContent().push(<div className="h-5"/>); break;
                    case "info":
                        getContent().push(<InfoBox>{applyFormation(content[1], "#047842")}</InfoBox>); break;
                    case "warning":
                        getContent().push(<InfoBox>{applyFormation(content[1], "#047842")}</InfoBox>); break;
                    case "error":
                        getContent().push(<InfoBox>{applyFormation(content[1], "#047842")}</InfoBox>); break;
                    case "code":
                        let props1 = {language: "javascript", lineNumbers: true, title: null};
                        // check for params
                        if(matcher[2] !== "") {
                            const regex = /(\w*)="([^"]*)"/gm;
                            let mat;
                            while((mat = regex.exec(matcher[2])) !== null) {
                                switch (mat[1]) {
                                    case "language": props1.language = mat[2]; break;
                                    case "line_numbers": props1.lineNumbers = mat[2]; break;
                                    case "title": props1.title = mat[2]; break;
                                }
                            }
                        }
                        if(underElement.has(under)) under++;
                        underElement.set(under, {content: [], element: "code", props: props1});
                        break;
                    case "/code":
                        if(getName() !== "code") return (<CodeFailed reason="Code Failed at an code element"/>);
                        getContent(1).push(<CodeBlock title={getProps().title} lineNumbers={getProps().lineNumbers} language={getProps().language}>{removeIndents(getContent()).toString().replaceAll(",", "\n")}</CodeBlock>);
                        underElement.delete(under);
                        under = under === 0 ? 0 : under-1;
                        break;
                    case "expandable":
                        let props = {title:`No Title add title="Title" as a parameter`};
                        // check for params
                        if(matcher[2] !== "") {
                            const regex = /(\w*)="([^"]*)"/gm;
                            let mat;
                            while((mat = regex.exec(matcher[2])) !== null) {
                                switch (mat[1]) {
                                    case "title": props.title = mat[2]; break;
                                }
                            }
                        }
                        if(underElement.has(under)) under++;
                        underElement.set(under, {content: [], element: "expandable", props: props});
                        break;
                    case "/expandable":
                        if(getName() !== "expandable") return (<CodeFailed reason="Code Failed at an exapandable"/>);
                        getContent(1).push(<Expandable title={getProps().title}>{getContent()}</Expandable>);
                        underElement.delete(under);
                        under = under === 0 ? 0 : under-1;
                        break;
                    case "table":
                        if(underElement.has(under)) under++;
                        underElement.set(under, {content: [], element: "table"});
                        break;
                    case "/table":
                        if(getName() !== "table") return (<CodeFailed reason="Code Failed at an Table"/>);
                        getContent(1).push(
                            <div className="flex flex-col">
                                <table className="w-full">
                                    <tbody className="">{getContent()}</tbody>
                                </table>
                            </div>
                        );
                        underElement.delete(under);
                        under = under === 0 ? 0 : under-1;
                        break;
                    case "table_row":
                        if(underElement.has(under)) under++;
                        underElement.set(under, {content: [], element: "table_row"});
                        break;
                    case "/table_row":
                        if(getName() !== "table_row") return (<CodeFailed reason="Code Failed at a TableRow"/>);
                        getContent(1).push(<tr className="border-t border-t-gray-600/60">{
                            getContent().map((item, index) => (
                                <td className="border-r border-r-gray-600/60 p-2" key={index}>{item}</td>
                            ))
                        }</tr>);
                        underElement.delete(under);
                        under = under === 0 ? 0 : under-1;
                        break;
                    default:
                        getContent().push(<p className="text-white">{applyFormation(content[1])}</p>);
                }
            }
        }
    }
    return <div style={{fontSize: `${mainFontSize}px`}}>
        {html}
    </div>;
}

// FORMATING TUTORIALS

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
                html.push(<span className="p-0.5 rounded drop-shadow-lg text-white backdrop-blur-xl font-semibold" style={{backgroundColor: getColor(color, 0.3), color: getColor(color, 0.9)}}>{matcher[3]}</span>);
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

export default DuckyMagic;