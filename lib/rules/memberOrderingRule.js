var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var ts = require("typescript");
var OPTION_VARIABLES_BEFORE_FUNCTIONS = "variables-before-functions";
var OPTION_STATIC_BEFORE_INSTANCE = "static-before-instance";
var OPTION_PUBLIC_BEFORE_PRIVATE = "public-before-private";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MemberOrderingWalker(sourceFile, this.getOptions()));
    };
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
function getModifiers(isMethod, modifiers) {
    return {
        isInstance: !Lint.hasModifier(modifiers, 111),
        isMethod: isMethod,
        isPrivate: Lint.hasModifier(modifiers, 108)
    };
}
function toString(modifiers) {
    return [
        modifiers.isPrivate ? "private" : "public",
        modifiers.isInstance ? "instance" : "static",
        "member",
        modifiers.isMethod ? "function" : "variable"
    ].join(" ");
}
var MemberOrderingWalker = (function (_super) {
    __extends(MemberOrderingWalker, _super);
    function MemberOrderingWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
    }
    MemberOrderingWalker.prototype.visitClassDeclaration = function (node) {
        this.resetPreviousModifiers();
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitInterfaceDeclaration = function (node) {
        this.resetPreviousModifiers();
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitMethodSignature = function (node) {
        this.checkModifiersAndSetPrevious(node, getModifiers(true, node.modifiers));
        _super.prototype.visitMethodSignature.call(this, node);
    };
    MemberOrderingWalker.prototype.visitPropertyDeclaration = function (node) {
        this.checkModifiersAndSetPrevious(node, getModifiers(false, node.modifiers));
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    MemberOrderingWalker.prototype.visitPropertySignature = function (node) {
        this.checkModifiersAndSetPrevious(node, getModifiers(false, node.modifiers));
        _super.prototype.visitPropertySignature.call(this, node);
    };
    MemberOrderingWalker.prototype.visitTypeLiteral = function (node) {
    };
    MemberOrderingWalker.prototype.resetPreviousModifiers = function () {
        this.previousMember = {
            isInstance: false,
            isMethod: false,
            isPrivate: false
        };
    };
    MemberOrderingWalker.prototype.checkModifiersAndSetPrevious = function (node, currentMember) {
        if (!this.canAppearAfter(this.previousMember, currentMember)) {
            var failure = this.createFailure(node.getStart(), node.getWidth(), "Declaration of " + toString(currentMember) + " not allowed to appear after declaration of " + toString(this.previousMember));
            this.addFailure(failure);
        }
        this.previousMember = currentMember;
    };
    MemberOrderingWalker.prototype.canAppearAfter = function (previousMember, currentMember) {
        if (previousMember == null || currentMember == null) {
            return true;
        }
        if (this.hasOption(OPTION_VARIABLES_BEFORE_FUNCTIONS) && previousMember.isMethod !== currentMember.isMethod) {
            return Number(previousMember.isMethod) < Number(currentMember.isMethod);
        }
        if (this.hasOption(OPTION_STATIC_BEFORE_INSTANCE) && previousMember.isInstance !== currentMember.isInstance) {
            return Number(previousMember.isInstance) < Number(currentMember.isInstance);
        }
        if (this.hasOption(OPTION_PUBLIC_BEFORE_PRIVATE) && previousMember.isPrivate !== currentMember.isPrivate) {
            return Number(previousMember.isPrivate) < Number(currentMember.isPrivate);
        }
        return true;
    };
    return MemberOrderingWalker;
})(Lint.RuleWalker);
exports.MemberOrderingWalker = MemberOrderingWalker;
