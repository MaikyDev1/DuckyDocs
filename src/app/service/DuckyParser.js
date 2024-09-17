import * as readline from "readline";
import * as fs from "fs";

const DuckyMagic = async ({file}) => {
    const filestream = await fs.createReadStream(process.cwd() + `/ducky/${file}`);

    let html = [];

    const rl = readline.createInterface({ input: filestream, crlfDelay: Infinity });

    let lines = '';
    for await (const line of rl) {
        if(!line.startsWith("//")) {
            if(line.match(/<h([1-3])>(.*)<\/h\1>/)) {
                const matcher = line.match(/<h([1-3])>(.*)<\/h\1>/);
                switch (matcher[1]) {
                    case 1:
                        html.push(<h1 className="text-white">{applyFormation(matcher[2])}</h1>); break;
                    default:
                        html.push(<h1 className="text-white">{applyFormation(matcher[2])}</h1>);
                }
            }
        }
    }
    console.log(html);
    return html;
}

function applyFormation(line) {
    let string = line;
    let html = [];
    let matcher = null;
    while(true) {
        matcher = string.match(/\[(.*)](.*)\[\/\1]/);
        if (!matcher) {html.push(line); break;}
        switch (matcher[1]) {
            case "blue":
                html.push()
        }
        // end code
        if(!line.match(/\[(.*)](.*)\[\/\1]/)) {
            break;
        }
    }
    return line;
}

export default DuckyMagic;