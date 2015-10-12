var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var ts = require("typescript");
var OPTION_CHECK_PARAMETERS = "check-parameters";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var languageService = Lint.createLanguageService(sourceFile.fileName, sourceFile.getFullText());
        return this.applyWithWalker(new NoUnusedVariablesWalker(sourceFile, this.getOptions(), languageService));
    };
    Rule.FAILURE_STRING = "unused variable: ";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoUnusedVariablesWalker = (function (_super) {
    __extends(NoUnusedVariablesWalker, _super);
    function NoUnusedVariablesWalker(sourceFile, options, languageService) {
        _super.call(this, sourceFile, options);
        this.languageService = languageService;
        this.skipVariableDeclaration = false;
        this.skipParameterDeclaration = false;
    }
    NoUnusedVariablesWalker.prototype.visitBindingElement = function (node) {
        var isSingleVariable = node.name.kind === 67;
        if (isSingleVariable && !this.skipBindingElement) {
            var variableIdentifier = node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }
        _super.prototype.visitBindingElement.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitImportDeclaration = function (node) {
        if (!Lint.hasModifier(node.modifiers, 80)) {
            var importClause = node.importClause;
            if (importClause != null && importClause.name != null) {
                var variableIdentifier = importClause.name;
                this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
            }
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (!Lint.hasModifier(node.modifiers, 80)) {
            var name_1 = node.name;
            this.validateReferencesForVariable(name_1.text, name_1.getStart());
        }
        _super.prototype.visitImportEqualsDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitCatchClause = function (node) {
        this.visitBlock(node.block);
    };
    NoUnusedVariablesWalker.prototype.visitNamedImports = function (node) {
        var _this = this;
        node.elements.forEach(function (namedImport) {
            _this.validateReferencesForVariable(namedImport.name.text, namedImport.name.getStart());
        });
        _super.prototype.visitNamedImports.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitNamespaceImport = function (node) {
        this.validateReferencesForVariable(node.name.text, node.name.getStart());
        _super.prototype.visitNamespaceImport.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitVariableDeclaration = function (node) {
        var isSingleVariable = node.name.kind === 67;
        if (isSingleVariable && !this.skipVariableDeclaration) {
            var variableIdentifier = node.name;
            this.validateReferencesForVariable(variableIdentifier.text, variableIdentifier.getStart());
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.skipParameterDeclaration = true;
        _super.prototype.visitInterfaceDeclaration.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitIndexSignatureDeclaration = function (node) {
        this.skipParameterDeclaration = true;
        _super.prototype.visitIndexSignatureDeclaration.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitVariableStatement = function (node) {
        if (Lint.hasModifier(node.modifiers, 80, 120)) {
            this.skipBindingElement = true;
            this.skipVariableDeclaration = true;
        }
        _super.prototype.visitVariableStatement.call(this, node);
        this.skipBindingElement = false;
        this.skipVariableDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitFunctionType = function (node) {
        this.skipParameterDeclaration = true;
        _super.prototype.visitFunctionType.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.visitFunctionDeclaration = function (node) {
        if (!Lint.hasModifier(node.modifiers, 80, 120)) {
            var variableName = node.name.text;
            this.validateReferencesForVariable(variableName, node.name.getStart());
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitParameterDeclaration = function (node) {
        var isSingleVariable = node.name.kind === 67;
        var isPropertyParameter = Lint.hasModifier(node.modifiers, 110, 108, 109);
        if (!isSingleVariable && isPropertyParameter) {
            this.skipBindingElement = true;
        }
        if (this.hasOption(OPTION_CHECK_PARAMETERS)
            && isSingleVariable
            && !this.skipParameterDeclaration
            && !Lint.hasModifier(node.modifiers, 110)) {
            var nameNode = node.name;
            this.validateReferencesForVariable(nameNode.text, node.name.getStart());
        }
        _super.prototype.visitParameterDeclaration.call(this, node);
        this.skipBindingElement = false;
    };
    NoUnusedVariablesWalker.prototype.visitPropertyDeclaration = function (node) {
        if (node.name != null && node.name.kind === 67) {
            var modifiers = node.modifiers;
            var variableName = node.name.text;
            if (Lint.hasModifier(modifiers, 108)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    NoUnusedVariablesWalker.prototype.visitMethodDeclaration = function (node) {
        if (node.name != null && node.name.kind === 67) {
            var modifiers = node.modifiers;
            var variableName = node.name.text;
            if (Lint.hasModifier(modifiers, 108)) {
                this.validateReferencesForVariable(variableName, node.name.getStart());
            }
        }
        if (Lint.hasModifier(node.modifiers, 113)) {
            this.skipParameterDeclaration = true;
        }
        _super.prototype.visitMethodDeclaration.call(this, node);
        this.skipParameterDeclaration = false;
    };
    NoUnusedVariablesWalker.prototype.validateReferencesForVariable = function (name, position) {
        var fileName = this.getSourceFile().fileName;
        var highlights = this.languageService.getDocumentHighlights(fileName, position, [fileName]);
        if (highlights == null || highlights[0].highlightSpans.length <= 1) {
            this.addFailure(this.createFailure(position, name.length, Rule.FAILURE_STRING + "'" + name + "'"));
        }
    };
    return NoUnusedVariablesWalker;
})(Lint.RuleWalker);
