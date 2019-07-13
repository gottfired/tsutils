import ts from "typescript";
import {
    createSourceFile,
    printAST,
    syntaxToKind,
    SPACES,
    pad,
    getIdentifier
} from "./compiler";

const state = {
    enumName: ""
};

export function enum2strings(text: string): string {
    const src = createSourceFile(text);
    printAST(src, src);

    return printAsStringGetter(src, src);
}

function printChildren(sourceFile: ts.SourceFile, node: ts.Node, spaces = 0) {
    if (
        node.getChildren(sourceFile) &&
        node.getChildren(sourceFile).length > 0
    ) {
        let ret = "";
        ts.forEachChild(node, child => {
            ret += printAsStringGetter(sourceFile, child, spaces);
        });

        return ret;
    }
}

function printAsStringGetter(
    sourceFile: ts.SourceFile,
    node: ts.Node,
    spaces = 0
) {
    if (!node) {
        return;
    }

    if (node.kind) {
        let str = syntaxToKind(node.kind);
        if (ts.isSourceFile(node)) {
            return printChildren(sourceFile, node, spaces);
        }
        if (ts.isEnumDeclaration(node)) {
            const name = getIdentifier(sourceFile, node);
            state.enumName = name;
            return `
function get${name}Strings(value: ${name}) {
    switch (value) {${printChildren(sourceFile, node)}
    }
}
            `;
        }
        if (ts.isEnumMember(node)) {
            const name = getIdentifier(sourceFile, node);
            return `
        case ${state.enumName}.${name}:
            return "${name}";
                `;
        }
    }

    return "";
}
