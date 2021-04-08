const core = require('@actions/core');
const github = require('@actions/github');
const xpath = require('xpath');
const DOMParser = require('xmldom').DOMParser;
const fs = require('fs');

try {
    const filename = core.getInput('filename');
    const expression = '/ns:phpunit/ns:project/ns:directory/ns:totals/ns:lines/@percent';
    const namespaces = '{"ns" : "https://schema.phpunit.de/coverage/1.0"}';

    const content = fs.readFileSync(filename, 'utf8');
    const document = new DOMParser().parseFromString(content);
    const select = namespaces
        ? xpath.useNamespaces(JSON.parse(namespaces))
        : xpath.select;
    const nodes = select(expression, document);

    const result = nodes.map(node => node.toString()).join("\n");
    core.setOutput("result", result);
} catch (error) {
    core.setFailed(error.message);
}