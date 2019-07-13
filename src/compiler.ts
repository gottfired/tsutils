import ts from "typescript";

export const SPACES = 4;

export function createSourceFile(text: string) {
    return ts.createSourceFile("temp.ts", text, ts.ScriptTarget.Latest);
}

export function pad(str: string, spaces: number) {
    return str.padStart(str.length + spaces);
}

// helper to give us Node string type given kind
export function syntaxToKind(kind: ts.Node["kind"]) {
    return ts.SyntaxKind[kind];
}

export function printAST(sourceFile: ts.SourceFile, node: ts.Node, spaces = 0) {
    if (!node) {
        return;
    }

    if (node.kind) {
        let str = syntaxToKind(node.kind);
        if (str === "Identifier") {
            str += ": " + node.getText(sourceFile);
        }
        const padded = str.padStart(str.length + spaces, " ");
        console.log(padded);
        //printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }

    if (
        node.getChildren(sourceFile) &&
        node.getChildren(sourceFile).length > 0
    ) {
        ts.forEachChild(node, child => {
            printAST(sourceFile, child, spaces + SPACES);
        });
    }
}

export function getIdentifier(sourceFile: ts.SourceFile, node: ts.Node) {
    if (
        node.getChildren(sourceFile) &&
        node.getChildren(sourceFile).length > 0
    ) {
        let ret = "";
        ts.forEachChild(node, child => {
            if (ts.isIdentifier(child)) {
                ret = child.text;
            }
        });

        return ret;
    }

    return "NO_IDENTIFIER";
}
