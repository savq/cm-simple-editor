import { basicSetup, EditorView } from "codemirror";
import { HighlightStyle, LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { parseMixed } from "@lezer/common";
import { tags as t } from "@lezer/highlight";

import { html, htmlLanguage } from "@codemirror/lang-html";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { julia, juliaLanguage } from "@plutojl/lang-julia";

import codeSample from "./codeSample";

function findLanguageInjection(node, input) {
  if (node.node.name != "NsStringLiteral" && node.node.name != "NsCommandLiteral") {
    return null;
  }
  const prefixNode = node.node.firstChild;
  const prefixStr = input.read(prefixNode.from, prefixNode.to);
  let parser;
  switch (prefixStr) {
    case "html":
      parser = htmlLanguage.parser;
      break;
    case "js":
      parser = javascriptLanguage.parser;
      break;
    default:
      return null;
  }
  const quotes = node.node.getChildren("quote");
  const quoteSize = quotes[0].to - quotes[0].from;
  const from = node.from + quoteSize + prefixStr.length;
  const to = node.to - quoteSize;
  return { parser, overlay: [{ from, to }] };
}

/// Construct language support with mixed parsing
const juliaMixed = (config) => {
  const jl = julia(config);
  jl.language.parser = jl.language.parser.configure({ wrap: parseMixed(findLanguageInjection) });
  return jl;
};

// deno-fmt-ignore
const highlightStyleJulia = HighlightStyle.define([
  { tag: t.blockComment,            color: "var(--cm-color-comment)" },
  { tag: t.lineComment,             color: "var(--cm-color-comment)", fontStyle: "italic" },
  { tag: t.variableName,            color: "var(--cm-color-variable)", fontWeight: "500" },
  { tag: t.propertyName,            color: "var(--cm-color-symbol)", fontWeight: "500" },
  { tag: t.macroName,               color: "var(--cm-color-macro)", fontWeight: "bolder" },
  { tag: t.typeName,                filter: "var(--cm-filter-type)", fontWeight: "lighter" },
  { tag: t.atom,                    color: "var(--cm-color-symbol)" },
  { tag: t.string,                  color: "var(--cm-color-string)" },
  { tag: t.special(t.string),       color: "var(--cm-color-command)" },
  { tag: t.special(t.macroName),    color: "var(--cm-color-macro)" },
  { tag: [t.character, t.literal],  color: "var(--cm-color-literal)" },
  { tag: t.keyword,                 color: "var(--cm-color-keyword)" },
], { scope: juliaLanguage });

// deno-fmt-ignore
const highlightStyleJavascript = HighlightStyle.define([
  { tag: t.blockComment,            color: "var(--cm-color-comment)" },
  { tag: t.lineComment,             color: "var(--cm-color-comment)", fontStyle: "italic" },
  { tag: t.variableName,            color: "var(--cm-color-variable)", fontWeight: "500" },
  { tag: t.propertyName,            color: "var(--cm-color-symbol)", fontWeight: "500" },
  { tag: t.string,                  color: "var(--cm-color-string)" },
  { tag: t.literal,                 color: "var(--cm-color-literal)" },
  { tag: t.keyword,                 color: "var(--cm-color-keyword)" },
], { scope: javascriptLanguage });

// deno-fmt-ignore
const highlightStyleHTML = HighlightStyle.define([
  //{ tag: t.content, },
  { tag: t.comment,                   color: "var(--cm-color-comment)" },
  { tag: [t.tagName, t.documentMeta], color: "var(--cm-color-variable)" },
  //{ tag: t.invalid, }, // MismatchedCloseTag
  //{ tag: t.angleBracket, },
  { tag: t.attributeName,             color: "var(--cm-color-symbol)" },
  { tag: t.attributeValue,            color: "var(--cm-color-string)" },
  //{ tag: t.definitionOperator, }, // =
  //{ tag: t.character, }, // EntityReference
  //{ tag: t.processingInstruction, } // <? ... ?>
], { scope: htmlLanguage });

const editor = new EditorView({
  doc: syntaxSample,
  extensions: [
    basicSetup,
    syntaxHighlighting(highlightStyleJulia),
    syntaxHighlighting(highlightStyleHTML),
    syntaxHighlighting(highlightStyleJavascript),
    juliaMixed({ enableKeywordCompletion: true }),
    html(),
    javascript(),
  ],
  parent: document.body,
});
