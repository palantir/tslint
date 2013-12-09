///<reference path='references.ts' />

module TypeScript.Syntax {
    export class VariableWidthTokenWithNoTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _textOrWidth: any;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, textOrWidth: any) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._textOrWidth = textOrWidth;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithNoTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._textOrWidth);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return this.width(); }
        private start(): number { return this._fullStart; }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }

        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any {
            if ((<any>this)._value === undefined) {
                (<any>this)._value = value(this);
            }

            return (<any>this)._value;
        }

        public valueText(): string {
            if ((<any>this)._valueText === undefined) {
                (<any>this)._valueText = valueText(this);
            }

            return (<any>this)._valueText;
        }

        public hasLeadingTrivia(): boolean { return false; }
        public hasLeadingComment(): boolean { return false; }
        public hasLeadingNewLine(): boolean { return false; }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasTrailingTrivia(): boolean { return false; }
        public hasTrailingComment(): boolean { return false; }
        public hasTrailingNewLine(): boolean { return false; }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class VariableWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _leadingTriviaInfo: number;
        private _textOrWidth: any;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, leadingTriviaInfo: number, textOrWidth: any) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._leadingTriviaInfo,
                this._textOrWidth);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return getTriviaWidth(this._leadingTriviaInfo) + this.width(); }
        private start(): number { return this._fullStart + getTriviaWidth(this._leadingTriviaInfo); }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }

        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any {
            if ((<any>this)._value === undefined) {
                (<any>this)._value = value(this);
            }

            return (<any>this)._value;
        }

        public valueText(): string {
            if ((<any>this)._valueText === undefined) {
                (<any>this)._valueText = valueText(this);
            }

            return (<any>this)._valueText;
        }

        public hasLeadingTrivia(): boolean { return true; }
        public hasLeadingComment(): boolean { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLine(): boolean { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return getTriviaWidth(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): boolean { return false; }
        public hasTrailingComment(): boolean { return false; }
        public hasTrailingNewLine(): boolean { return false; }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class VariableWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _textOrWidth: any;
        private _trailingTriviaInfo: number;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, textOrWidth: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithTrailingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._textOrWidth,
                this._trailingTriviaInfo);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return this.width() + getTriviaWidth(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart; }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }

        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any {
            if ((<any>this)._value === undefined) {
                (<any>this)._value = value(this);
            }

            return (<any>this)._value;
        }

        public valueText(): string {
            if ((<any>this)._valueText === undefined) {
                (<any>this)._valueText = valueText(this);
            }

            return (<any>this)._valueText;
        }

        public hasLeadingTrivia(): boolean { return false; }
        public hasLeadingComment(): boolean { return false; }
        public hasLeadingNewLine(): boolean { return false; }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasTrailingTrivia(): boolean { return true; }
        public hasTrailingComment(): boolean { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLine(): boolean { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return getTriviaWidth(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class VariableWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _leadingTriviaInfo: number;
        private _textOrWidth: any;
        private _trailingTriviaInfo: number;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, leadingTriviaInfo: number, textOrWidth: any, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._leadingTriviaInfo,
                this._textOrWidth,
                this._trailingTriviaInfo);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return getTriviaWidth(this._leadingTriviaInfo) + this.width() + getTriviaWidth(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart + getTriviaWidth(this._leadingTriviaInfo); }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }

        public text(): string {
            if (typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(
                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);
            }

            return this._textOrWidth;
        }

        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any {
            if ((<any>this)._value === undefined) {
                (<any>this)._value = value(this);
            }

            return (<any>this)._value;
        }

        public valueText(): string {
            if ((<any>this)._valueText === undefined) {
                (<any>this)._valueText = valueText(this);
            }

            return (<any>this)._valueText;
        }

        public hasLeadingTrivia(): boolean { return true; }
        public hasLeadingComment(): boolean { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLine(): boolean { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return getTriviaWidth(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): boolean { return true; }
        public hasTrailingComment(): boolean { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLine(): boolean { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return getTriviaWidth(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class FixedWidthTokenWithNoTrivia implements ISyntaxToken {
        public tokenKind: SyntaxKind;

        constructor(kind: SyntaxKind) {
            this.tokenKind = kind;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithNoTrivia(
                this.tokenKind);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return this.width(); }
        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this.text(); }

        public value(): any { return value(this); }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia(): boolean { return false; }
        public hasLeadingComment(): boolean { return false; }
        public hasLeadingNewLine(): boolean { return false; }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasTrailingTrivia(): boolean { return false; }
        public hasTrailingComment(): boolean { return false; }
        public hasTrailingNewLine(): boolean { return false; }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class FixedWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _leadingTriviaInfo: number;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, leadingTriviaInfo: number) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithLeadingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._leadingTriviaInfo);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return getTriviaWidth(this._leadingTriviaInfo) + this.width(); }
        private start(): number { return this._fullStart + getTriviaWidth(this._leadingTriviaInfo); }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return value(this); }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia(): boolean { return true; }
        public hasLeadingComment(): boolean { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLine(): boolean { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return getTriviaWidth(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): boolean { return false; }
        public hasTrailingComment(): boolean { return false; }
        public hasTrailingNewLine(): boolean { return false; }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return 0; }
        public trailingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class FixedWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _trailingTriviaInfo: number;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithTrailingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._trailingTriviaInfo);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return this.width() + getTriviaWidth(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart; }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return value(this); }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia(): boolean { return false; }
        public hasLeadingComment(): boolean { return false; }
        public hasLeadingNewLine(): boolean { return false; }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return 0; }
        public leadingTrivia(): ISyntaxTriviaList { return Syntax.emptyTriviaList; }

        public hasTrailingTrivia(): boolean { return true; }
        public hasTrailingComment(): boolean { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLine(): boolean { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return getTriviaWidth(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    export class FixedWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText: ISimpleText;
        private _fullStart: number;
        public tokenKind: SyntaxKind;
        private _leadingTriviaInfo: number;
        private _trailingTriviaInfo: number;

        constructor(sourceText: ISimpleText, fullStart: number,kind: SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }

        public clone(): ISyntaxToken {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(
                this._sourceText,
                this._fullStart,
                this.tokenKind,
                this._leadingTriviaInfo,
                this._trailingTriviaInfo);
        }

        public isNode(): boolean { return false; }
        public isToken(): boolean { return true; }
        public isList(): boolean { return false; }
        public isSeparatedList(): boolean { return false; }

        public kind(): SyntaxKind { return this.tokenKind; }

        public childCount(): number { return 0; }
        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }

        public fullWidth(): number { return getTriviaWidth(this._leadingTriviaInfo) + this.width() + getTriviaWidth(this._trailingTriviaInfo); }
        private start(): number { return this._fullStart + getTriviaWidth(this._leadingTriviaInfo); }
        private end(): number { return this.start() + this.width(); }

        public width(): number { return this.text().length; }
        public text(): string { return SyntaxFacts.getText(this.tokenKind); }
        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }

        public value(): any { return value(this); }
        public valueText(): string { return valueText(this); }
        public hasLeadingTrivia(): boolean { return true; }
        public hasLeadingComment(): boolean { return hasTriviaComment(this._leadingTriviaInfo); }
        public hasLeadingNewLine(): boolean { return hasTriviaNewLine(this._leadingTriviaInfo); }
        public hasLeadingSkippedText(): boolean { return false; }
        public leadingTriviaWidth(): number { return getTriviaWidth(this._leadingTriviaInfo); }
        public leadingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false); }

        public hasTrailingTrivia(): boolean { return true; }
        public hasTrailingComment(): boolean { return hasTriviaComment(this._trailingTriviaInfo); }
        public hasTrailingNewLine(): boolean { return hasTriviaNewLine(this._trailingTriviaInfo); }
        public hasTrailingSkippedText(): boolean { return false; }
        public trailingTriviaWidth(): number { return getTriviaWidth(this._trailingTriviaInfo); }
        public trailingTrivia(): ISyntaxTriviaList { return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true); }

        public hasSkippedToken(): boolean { return false; }
        public toJSON(key: any): any { return tokenToJSON(this); }
        public firstToken(): ISyntaxToken { return this; }
        public lastToken(): ISyntaxToken { return this; }
        public isTypeScriptSpecific(): boolean { return false; }
        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }
        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }
        private realize(): ISyntaxToken { return realizeToken(this); }
        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }

        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {
            return new PositionedToken(parent, this, fullStart);
        }

        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withLeadingTrivia(leadingTrivia);
        }

        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {
            return this.realize().withTrailingTrivia(trailingTrivia);
        }

        public isExpression(): boolean {
            return isExpression(this);
        }

        public isPrimaryExpression(): boolean {
            return this.isExpression();
        }

        public isMemberExpression(): boolean {
            return this.isExpression();
        }

        public isPostfixExpression(): boolean {
            return this.isExpression();
        }

        public isUnaryExpression(): boolean {
            return this.isExpression();
        }
    }

    function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {
        token.leadingTrivia().collectTextElements(elements);
        elements.push(token.text());
        token.trailingTrivia().collectTextElements(elements);
    }

    export function fixedWidthToken(sourceText: ISimpleText, fullStart: number,
        kind: SyntaxKind,
        leadingTriviaInfo: number,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(kind);
            }
            else {
                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);
        }
        else {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);
        }
    }

    export function variableWidthToken(sourceText: ISimpleText, fullStart: number,
        kind: SyntaxKind,
        leadingTriviaInfo: number,
        width: number,
        trailingTriviaInfo: number): ISyntaxToken {

        if (leadingTriviaInfo === 0) {
            if (trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);
            }
            else {
                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);
            }
        }
        else if (trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);
        }
        else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);
        }
    }

    function getTriviaWidth(value: number): number {
        return value >>> SyntaxConstants.TriviaFullWidthShift;
    }

    function hasTriviaComment(value: number): boolean {
        return (value & SyntaxConstants.TriviaCommentMask) !== 0;
    }

    function hasTriviaNewLine(value: number): boolean {
        return (value & SyntaxConstants.TriviaNewLineMask) !== 0;
    }
}