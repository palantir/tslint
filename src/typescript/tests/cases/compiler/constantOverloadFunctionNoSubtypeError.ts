function foo(tagName: 'canvas'): HTMLCanvasElement;
function foo(tagName:  'div'): HTMLDivElement;
function foo(tagName: 'span'): HTMLSpanElement;
function foo(tagName: number): HTMLElement;
function foo(tagName: any): HTMLElement {

    return null;
}
