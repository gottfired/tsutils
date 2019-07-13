import ts from "typescript";
import {
    createSourceFile,
    printAST,
    syntaxToKind,
    SPACES,
    pad,
    getIdentifier
} from "./compiler";

const JOI = "Joi";

export function ts2joi(text: string): string {
    const src = createSourceFile(text);
    printAST(src, src);

    return printAsJoi(src, src);
}

function printAsJoiChildren(
    sourceFile: ts.SourceFile,
    node: ts.Node,
    spaces = 0
) {
    if (
        node.getChildren(sourceFile) &&
        node.getChildren(sourceFile).length > 0
    ) {
        let ret = "";
        ts.forEachChild(node, child => {
            ret += printAsJoi(sourceFile, child, spaces);
        });

        return ret;
    }
}

function getOptional(sourceFile: ts.SourceFile, node: ts.Node) {
    if (
        node.getChildren(sourceFile) &&
        node.getChildren(sourceFile).length > 0
    ) {
        let ret = "required()";
        ts.forEachChild(node, child => {
            if (syntaxToKind(child.kind) === "QuestionToken") {
                ret = "optional()";
            }
        });

        return ret;
    }

    return "required()";
}

function printAsJoi(sourceFile: ts.SourceFile, node: ts.Node, spaces = 0) {
    if (!node) {
        return;
    }

    if (node.kind) {
        let str = syntaxToKind(node.kind);
        if (str === "NumberKeyword") {
            return JOI + ".number()";
        }
        if (str === "StringKeyword") {
            return JOI + ".string()";
        }
        if (str === "BooleanKeyword") {
            return JOI + ".boolean()";
        }
        if (ts.isInterfaceDeclaration(node)) {
            return (
                "// " +
                getIdentifier(sourceFile, node) +
                "\n" +
                JOI +
                ".object()." +
                getOptional(sourceFile, node) +
                ".keys({\n" +
                printAsJoiChildren(sourceFile, node, spaces + SPACES) +
                "})\n"
            );
        }
        if (ts.isVariableDeclaration(node)) {
            return (
                getIdentifier(sourceFile, node) +
                ": " +
                printAsJoiChildren(sourceFile, node, spaces) +
                "." +
                getOptional(sourceFile, node) +
                ",\n"
            );
        }
        if (ts.isPropertySignature(node)) {
            const str =
                getIdentifier(sourceFile, node) +
                ": " +
                (
                    printAsJoiChildren(sourceFile, node, spaces) || ""
                ).trimLeft() +
                "." +
                getOptional(sourceFile, node) +
                ",\n";
            return pad(str, spaces);
        }
        if (ts.isTypeLiteralNode(node)) {
            return (
                pad(JOI + ".object().keys({\n", spaces) +
                printAsJoiChildren(sourceFile, node, spaces + SPACES) +
                pad("})", spaces)
            );
        }
        if (ts.isArrayTypeNode(node)) {
            return (
                JOI +
                ".array().items(\n" +
                printAsJoiChildren(sourceFile, node, spaces + SPACES) +
                "\n" +
                pad(")", spaces)
            );
        }
        if (ts.isSourceFile(node)) {
            return printAsJoiChildren(sourceFile, node, spaces);
        }
        if (ts.isTypeReferenceNode(node)) {
            const identifier = getIdentifier(sourceFile, node);
            if (identifier === "Date") {
                return JOI + ".date()";
            }
            if (identifier === "Array") {
                return (
                    JOI +
                    ".array().items(\n" +
                    printAsJoiChildren(sourceFile, node, spaces + SPACES) +
                    "\n" +
                    pad(")", spaces)
                );
            }
        }
    }

    return "";
}
