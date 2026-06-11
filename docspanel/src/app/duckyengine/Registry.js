import Title from "./primitives/Title";
import Paragraph from "./primitives/Paragraph";
import Break from "./primitives/Break";
import Divider from "./primitives/Divider";
import CodeBlock from "./primitives/CodeBlock";
import Expand from "./primitives/Expand";
import Tooltip from "./primitives/Tooltip";
import Tabs from "./primitives/Tabs";
import ApiEndpoint from "./primitives/ApiEndpoint";

const primitives = [Title, Paragraph, Break, Divider, CodeBlock, Expand, Tooltip, Tabs, ApiEndpoint];

const registry = {};
primitives.forEach(mod => {
  mod.element_name.forEach(name => {
    registry[name] = { element: mod.element, editor_element: mod.in_editor };
  });
});

export default registry