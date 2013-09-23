///<reference path='references.ts' />

module TypeScript {
    class TextSpanWalker extends SyntaxWalker {
        private _position: number = 0;

        constructor(private textSpan: TextSpan) {
            super();
        }

        public visitToken(token: ISyntaxToken): void {
            this._position += token.fullWidth();
        }

        public visitNode(node: SyntaxNode): void {
            var nodeSpan = new TextSpan(this.position(), node.fullWidth());

            if (nodeSpan.intersectsWithTextSpan(this.textSpan)) {
                node.accept(this);
            }
            else {
                // We're skipping the node, so update our position accordingly.
                this._position += node.fullWidth();
            }
        }

        public position(): number {
            return this._position;
        }
    }
}