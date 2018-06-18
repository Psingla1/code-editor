var CodeMirror = require('codemirror');

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require("codemirror/mode/htmlmixed/htmlmixed");
require('codemirror/mode/clike/clike');
require("codemirror/addon/dialog/dialog");
require("codemirror/addon/search/searchcursor");
require("codemirror/addon/search/search");
require("codemirror/addon/search/jump-to-line");
require("codemirror/addon/search/matchesonscrollbar");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/edit/matchtags");
require("codemirror/addon/edit/trailingspace");
require("codemirror/addon/edit/closetag");
require("codemirror/addon/edit/continuelist");
require("codemirror/addon/comment/comment");
require("codemirror/addon/fold/foldcode");
require("codemirror/addon/fold/foldgutter");
require("codemirror/addon/fold/brace-fold");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/anyword-hint");
require("codemirror/addon/search/match-highlighter");
require("codemirror/addon/lint/lint");
require("codemirror/addon/lint/javascript-lint");


// Foding settings.
var braceFoldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);

function saveFile() {
  fs.writeFile(codeMirror.getDoc().openedFilePath, codeMirror.getValue(), (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("The file has been succesfully saved");
  });
}

var codeMirror = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode: 'javascript',
  theme: 'solarized light',
  indentWithTabs: false,
  lineNumbers: true,
  lineWrapping: true,
  smartIndent: true,
  electricChars: true,
  cursorScrollMargin: 5,
  showMatchesOnScrollbar: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  matchTags: true,
  showTrailingSpace: true,
  autoCloseTags: true,
  foldGutter: true,
  showHint: true,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
    "Cmd-S": saveFile,
    "Ctrl-Q": function(cm) {
      braceFoldFunc(cm, cm.getCursor().line);
    },
  },
  lint: CodeMirror.lint.javascript,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
});

const {
  ipcRenderer
} = require('electron');
const fs = require('fs');

ipcRenderer.on('show-file', function(event, args) {
  const {
    filePath,
    content
  } = args;
  // Store the filePath for later use.
  codeMirror.getDoc().openedFilePath = filePath;
  codeMirror.setValue(content);

  if (filePath.endsWith('.js')) {
    codeMirror.setOption("mode", "javascript");
  } else if (filePath.endsWith('.css')) {
    codeMirror.setOption("mode", "css");
  } else if (filePath.endsWith('.java')) {
    codeMirror.setOption("mode", "text/x-java");
  } else if (filePath.endsWith('.c')) {
    codeMirror.setOption("mode", "text/x-c");
  } else if (filePath.endsWith('.h')) {
    codeMirror.setOption("mode", "text/x-c++hdr");
  } else if (filePath.endsWith('.cpp')) {
    codeMirror.setOption("mode", "text/x-c++src");
  } else {
    codeMirror.setOption("mode", "");
  }
});


ipcRenderer.on('save-file', saveFile);
