///<reference path='references.ts' />

/// <summary>
/// Represents an immutable snapshot of text.
/// </summary>
module TypeScript {
    export interface ISimpleText {
        /// <summary>
        /// Total number of characters in the text source.
        /// </summary>
        length(): number;

        /// <summary>
        /// Copy the count contents of IText starting from sourceIndex to destination starting at
        /// destinationIndex.
        /// </summary>
        copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void;

        substr(start: number, length: number, intern: boolean): string;

        /// <summary>
        /// Gets the a new IText that corresponds to the contents of this IText for the given span.
        /// </summary>
        subText(span: TextSpan): ISimpleText;

        charCodeAt(index: number): number;
        lineMap(): LineMap;
    }

    /// <summary>
    /// Represents an immutable snapshot of text.
    /// </summary>
    export interface IText extends ISimpleText {
        /// <summary>
        /// Total number of lines in the text.
        /// </summary>
        lineCount(): number;

        /// <summary>
        /// Returns the collection of line information for the <see cref="T:IText"/> instance.
        /// </summary>
        lines(): ITextLine[];

        /// <summary>
        /// Return the char at position in the IText.
        /// </summary>
        charCodeAt(position: number): number;

        /// <summary>
        /// Gets the line corresponding to the provided line number.
        /// </summary>
        getLineFromLineNumber(lineNumber: number): ITextLine;

        /// <summary>
        /// Gets the line which encompasses the provided position.
        /// </summary>
        getLineFromPosition(position: number): ITextLine;

        /// <summary>
        /// Gets the number of the line that contains the character at the specified position.
        /// </summary>
        getLineNumberFromPosition(position: number): number;

        /// <summary>
        /// Gets a line number, and position within that line, for the character at the 
        /// specified position
        /// </summary>
        getLinePosition(position: number): LineAndCharacter;

        /// <summary>
        /// Returns a string representation of the contents of this IText within the given span.
        /// </summary>
        toString(span?: TextSpan): string;
    }
}