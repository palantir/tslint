///<reference path='references.ts' />

/// <summary>
/// Immutable representation of a line in an IText instance.
/// </summary>
module TypeScript {
    export interface ITextLine {
        /// <summary>
        /// Start of the line.
        /// </summary>
        start(): number;

        /// <summary>
        /// End of the line not including the line break.
        /// </summary>
        end(): number;

        /// <summary>
        /// End of the line including the line break.
        /// </summary>
        endIncludingLineBreak(): number;

        /// <summary>
        /// Extent of the line not including the line break.
        /// </summary>
        extent(): TextSpan;

        /// <summary>
        /// Extent of the line including the line break.
        /// </summary>
        extentIncludingLineBreak(): TextSpan;

        /// <summary>
        /// Gets the text of the line excluding the line break.
        /// </summary>
        toString(): string;

        /// <summary>
        /// Gets the line number for this line.
        /// </summary>
        lineNumber(): number;
    }
}