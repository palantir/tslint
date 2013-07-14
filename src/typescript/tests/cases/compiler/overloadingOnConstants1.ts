interface Document2 {
    createElement(tagName: string): HTMLElement;
    createElement(tagName: 'canvas'): HTMLCanvasElement;
    createElement(tagName: 'div'): HTMLDivElement;
    createElement(tagName: 'span'): HTMLSpanElement;
}

var d2: Document2;

// these are ok
var htmlElement: HTMLElement = d2.createElement("yo")
var htmlCanvasElement: HTMLCanvasElement = d2.createElement("canvas");
var htmlDivElement: HTMLDivElement = d2.createElement("div");
var htmlSpanElement: HTMLSpanElement = d2.createElement("span");

// these are errors
var htmlElement2: HTMLCanvasElement = d2.createElement("yo")
var htmlCanvasElement2: HTMLSpanElement = d2.createElement("canvas");
var htmlDivElement2: HTMLCanvasElement = d2.createElement("div");
var htmlSpanElement2: HTMLCanvasElement = d2.createElement("span");