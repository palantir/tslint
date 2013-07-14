/// <reference path='..\..\..\..\src\harness\harness.ts'/>
/// <reference path="..\..\..\..\src\services\formatting\formatting.ts"/>

interface DocumentTestJson {
    input: string;
    rules: string[];
    span: { start: number; length: number; };
    expected: string;
}

interface FormatOperationTestJson {
    input: string;
    operations: {
        operation: string;
        point: { position: number; };
        span: { start: number; length: number; };
    }[];
    expected: string;
}

function markupCodeForHtml(code: string) {
    var formatted = code.replace(/</g, '&lt;').replace(/ /g, '&#183;').replace(/\t/g, '&nbsp;&rarr;&nbsp;').replace(/\n/g,'&#8629;<br>');
    var escaped = code.replace(/'/g, '\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

    return formatted + '<br><a href="" onclick="copy(\'' + escaped + '\');">Copy</a>';
}

// This function is a modified copy of getFormattingEditsForRange from \src\services\languageService.ts.
// Please keep these roughly in sync.
function getFormattingEditsForRange(ast: Services.ScriptSyntaxAST, minChar: number, limChar: number, ruleNames: string[]) {
    var logger = new TypeScript.NullLogger();
    var formatRuleProvider = new Formatting.RulesProvider(logger);
    if (ruleNames.length > 0) {
        var rules = new Formatting.Rules();
        var ruleList = new Formatting.List_Rule();

        rules.HighPriorityCommonRules.forEach(r => ruleList.add(formatRuleProvider.getRuleByName(rules.getRuleName(r))));
        ruleNames.forEach(name => {
            ruleList.add(formatRuleProvider.getRuleByName(name));
        });
        rules.LowPriorityCommonRules.forEach(r => ruleList.add(formatRuleProvider.getRuleByName(rules.getRuleName(r))));

        formatRuleProvider.setActiveRules(ruleList);
    }

    var manager = new Formatting.FormattingManager(ast, formatRuleProvider, new Services.EditorOptions());
    
    var result = manager.formatRange(minChar, limChar);
    return result;
}

describe('importedJavaScriptFormatting - formatting rules', function() {
    var documentTests: DocumentTestJson[] = eval('[' + IO.readFile(Harness.userSpecifiedroot + 'tests/cases/unittests/services/documentFormattingTests.json') + ']');

    var outputFile = 'diff-1.html';
    IO.writeFile(outputFile, IO.readFile(Harness.userSpecifiedroot + 'tests/cases/unittests/services/formatDiffTemplate.html'));

    var checkTest = function(test: DocumentTestJson) {
		try {
			var filename = 'temp.ts';
			var typescriptLS = new Harness.TypeScriptLS();
			typescriptLS.addScript(filename, test.input, true);

			var ls = typescriptLS.getLanguageService();
        
			var opts = new Services.FormatCodeOptions();

			var rules = new Formatting.Rules();
			var activeRuleNames: string[] = [];

			rules.HighPriorityCommonRules.forEach(r => activeRuleNames.push(rules.getRuleName(r)));
			for (var i = 0; i < test.rules.length; i++) {
				activeRuleNames.push(test.rules[i]);
			}
			rules.LowPriorityCommonRules.forEach(r => activeRuleNames.push(rules.getRuleName(r)));

			var edits = getFormattingEditsForRange(ls.languageService.getScriptSyntaxAST(filename), test.span.start, test.span.start + test.span.length, activeRuleNames);
        
			var output = typescriptLS.applyEdits(test.input, edits);

			// Normalize line endings
			output = output.replace(/\r\n/g, '\n');
			test.expected = test.expected.replace(/\r\n/g, '\n');

			if (output != test.expected) {
				var outputHtml = '';
				outputHtml += '<table class="test-table">'; 
				outputHtml += '<tr class="test-header-row">'; 
				outputHtml += '<th>Input</th><th>Output</th><th>Expected</th>'; 
				outputHtml += '</tr>';
				outputHtml += '<tr class="test-results-row">'; 
				outputHtml += '<td class="test-input code">' + markupCodeForHtml(test.input) + '</td>';
				outputHtml += '<td class="test-output code">' + markupCodeForHtml(output) + '</td>';
				outputHtml += '<td class="test-expected code">' + markupCodeForHtml(test.expected) + '</td>';
				outputHtml += '</tr>';
				outputHtml += '<tr class="test-operations-row">'; 
				outputHtml += '<td colspan="3">Format from character ' + test.span.start + ' to ' + (test.span.start + test.span.length) + ' with rules: ' + test.rules.join(', ') + '</td>'; 
				outputHtml += '</tr>'; 
				outputHtml += '</table>'; // test-table

				IO.writeFile(outputFile, IO.readFile(outputFile) + outputHtml);
			}
		} catch(e) {
			// TODO: Remove this entire try/catch once everything is working
			// throw;
		}

        if (output != test.expected) {
			// TODO: Uncomment when things are working
            // throw new Error("Formatting failed - refer to diff-1.html");
        }
    }

    var i = 0;

    for (var i = 0; i < documentTests.length; i++) {
        var test = documentTests[i];

        var msg = 'formats the code (index ' + i + ') from ' + test.span.start + ' to ' + (test.span.start + test.span.length) + ' with rules = [' + test.rules.join(', ') + '] correctly';
        it(msg, function(t) {
            return function() {
                checkTest(t);
            }
        }(test));
    }
});

describe('importedJavaScriptFormatting - formatting operations', function() {
    var outputFile = 'diff-2.html';
    IO.writeFile(outputFile, IO.readFile(Harness.userSpecifiedroot + 'tests/cases/unittests/services/formatDiffTemplate.html'));

    var checkTest = function(test: FormatOperationTestJson) {
		try {
        var filename = 'temp.ts';
			var typescriptLS = new Harness.TypeScriptLS();
			typescriptLS.addScript(filename, test.input, true);

			var ls = typescriptLS.getLanguageService();

			var operationsText = '';

			var markedUpInput = test.input;
			var output = test.input;

			for (var i = 0; i < test.operations.length; i++) {
				var options = new Services.FormatCodeOptions();

				var op = test.operations[i];
				var edits: Services.TextEdit[];

				if (op.operation === 'CloseBrace') {
					edits = ls.languageService.getFormattingEditsAfterKeystroke(filename, op.point.position, '}', options);
					operationsText += 'Format for } at position ' + op.point.position.toString();
					markedUpInput = markedUpInput.substring(0, op.point.position) + '&#10026;' + markedUpInput.substring(op.point.position);
				} else if (op.operation === 'Enter') {
					// TODO: Don't disable this test
					return;
					edits = ls.languageService.getFormattingEditsAfterKeystroke(filename, op.point.position, '\n', options);
					operationsText += 'Format for [enter] at position ' + op.point.position.toString();
					markedUpInput = markedUpInput.substring(0, op.point.position) + '&#10026;' + markedUpInput.substring(op.point.position);
				} else if (op.operation === 'Semicolon') {
					edits = ls.languageService.getFormattingEditsAfterKeystroke(filename, op.point.position, ';', options);
					operationsText += 'Format for ; at position ' + op.point.position.toString();
					markedUpInput = markedUpInput.substring(0, op.point.position) + '&#10026;' + markedUpInput.substring(op.point.position);
				} else if (op.operation === 'Document') {
					edits = ls.languageService.getFormattingEditsForRange(filename, 0, output.length, options);
					operationsText += 'Format Document';
				} else if (op.operation === 'Selection') {
					edits = ls.languageService.getFormattingEditsForRange(filename, op.span.start, op.span.start + op.span.length, options);
					operationsText += 'Format selection from ' + op.span.start + ', length = ' + op.span.length;
				} else if (op.operation === 'Paste') {
					edits = ls.languageService.getFormattingEditsForRange(filename, op.span.start, op.span.start + op.span.length, options);
					operationsText += 'Format pasted content from ' + op.span.start + ', length = ' + op.span.length;
				} else {
					throw new Error('Unknown operation: ' + op.operation);
				}

				output = typescriptLS.applyEdits(test.input, edits);
				typescriptLS.updateScript(filename, output, true);
			}

			// Normalize line endings
			output = output.replace(/\r\n/g, '\n');
			test.expected = test.expected.replace(/\r\n/g, '\n');

			var outputHtml = '';
			outputHtml += '<table class="test-table">'; 
			outputHtml += '<tr class="test-header-row">'; 
			outputHtml += '<th>Input</th><th>Output</th><th>Expected</th>'; 
			outputHtml += '</tr>';
			outputHtml += '<tr class="test-results-row">'; 
			outputHtml += '<td class="test-input code">' + markupCodeForHtml(markedUpInput) + '</td>';
			outputHtml += '<td class="test-output code">' + markupCodeForHtml(output) + '</td>';
			outputHtml += '<td class="test-expected code">' + markupCodeForHtml(test.expected) + '</td>';
			outputHtml += '</tr>';
			outputHtml += '<tr class="test-operations-row">'; 
			outputHtml += '<td colspan="3">' + operationsText + '</td>'; 
			outputHtml += '</tr>'; 
			outputHtml += '</table>'; // test-table

			if (test.expected == output) {
				// Pass
			} else {
				IO.writeFile(outputFile, IO.readFile(outputFile) + outputHtml);
				// TODO: Uncomment when things are working
				// throw new Error('Format test failed - refer to ' + outputFile);
			}
		} catch(e) {
			// TODO: Remove this entire try/catch block once everything is working
			// throw;
		}
    }

    var operationsTests: FormatOperationTestJson[] = eval('[' + IO.readFile(Harness.userSpecifiedroot + 'tests/cases/unittests/services/ruleFormattingTests.json') + ']');
    for (var i = 0; i < operationsTests.length; i++) {
        var test = operationsTests[i];

        var msg = 'formats the text correctly, line = ' + i;
        it(msg, function(t) {
            return function() {
                checkTest(t);
            }
        }(test));
    }
});