///<reference path='references.ts' />

module TypeScript {
    export class LineAndCharacter {
        private _line: number = 0;
        private _character: number = 0;

        /// <summary>
        /// Initializes a new instance of a <see cref="LinePosition"/> with the given line and character.
        /// </summary>
        /// <param name="line">
        /// The line of the line position. The first line in a file is defined as line 0 (zero based line numbering).
        /// </param>
        /// <param name="character">
        /// The character position in the line.
        /// </param>
        /// <exception cref="ArgumentOutOfRangeException"><paramref name="line"/> or <paramref name="character"/> is less than zero. </exception>
        constructor(line: number, character: number) {
            if (line < 0) {
                throw Errors.argumentOutOfRange("line");
            }

            if (character < 0) {
                throw Errors.argumentOutOfRange("character");
            }

            this._line = line;
            this._character = character;
        }

        public line(): number {
            return this._line;
        }

        public character(): number {
            return this._character;
        }
    }
}