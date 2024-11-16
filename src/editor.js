import { basicSetup, EditorView } from "codemirror";
import { HighlightStyle, LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { parseMixed } from "@lezer/common";
import { tags as t } from "@lezer/highlight";

import { html, htmlLanguage } from "@codemirror/lang-html";
import { css, cssLanguage } from "@codemirror/lang-css";
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
    default:
      return null;
  }
  const quotes = node.node.getChildren("QuotationMark");
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

  { tag: t.operator,                color: "var(--cm-color-operator)" },
  { tag: t.definitionOperator,      color: "var(--cm-color-keyword)" },
  { tag: t.logicOperator,           color: "var(--cm-color-keyword)" },
  { tag: t.controlOperator,         color: "var(--cm-color-keyword)" },

  { tag: t.punctuation,             color: "var(--cm-color-keyword)" },
  { tag: t.bracket,                 color: "var(--cm-color-bracket)" },
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

const highlightStyleCSS = HighlightStyle.define([
  { tag: t.comment,           color: "var(--cm-color-comment)" },
  { tag: t.keyword,           color: "var(--cm-color-keyword)" },
  { tag: t.variableName,      color: "var(--cm-color-variable)" },
  { tag: [t.literal, t.unit], color: "var(--cm-color-literal)" },

  { tag: t.propertyName,      color: "var(--cm-color-property)" },
  { tag: t.className,         color: "var(--cm-color-property)" },
  { tag: t.tagName,           color: "var(--cm-color-property)" },

  { tag: t.definitionOperator, color: "var(--cm-color-string)" },

  //{ tag: t.keyword, color: "var(--cm-css-color)" },
  //{ tag: t.modifier, color: "var(--cm-css-accent-color)" },
  //
  //{ tag: t.className, color: "var(--cm-css-why-doesnt-codemirror-highlight-all-the-text-aaa)" },
  //{ tag: t.constant(tags.className), color: "var(--cm-css-why-doesnt-codemirror-highlight-all-the-text-aaa)" },

], { scope: cssLanguage })

const editor = new EditorView({
  doc: codeSample,
  extensions: [
    basicSetup,
    syntaxHighlighting(highlightStyleCSS),
    syntaxHighlighting(highlightStyleHTML),
    syntaxHighlighting(highlightStyleJavascript),
    syntaxHighlighting(highlightStyleJulia),
    juliaMixed({ enableKeywordCompletion: true }),
    css(),
    html(),
    javascript(),
  ],
  parent: document.body,
});
