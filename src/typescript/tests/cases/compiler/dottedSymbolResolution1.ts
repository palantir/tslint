interface JQuery {
    find(selector: string): JQuery;
}

interface JQueryStatic {
    
    (selector: string): JQuery;
    (object: JQuery): JQuery;
}

function each(collection: string, callback: (indexInArray: any, valueOfElement: any) => any): any;
function each(collection: JQuery, callback: (indexInArray: number, valueOfElement: HTMLElement) => any): any;
function each(collection: any, callback: (indexInArray: any, valueOfElement: any) => any): any {
    return null;
}

function _setBarAndText(): void {
    var x: JQuery, $: JQueryStatic
    each(x.find(" "), function () {
        var $this: JQuery = $(''),
            thisBar = $this.find(".fx-usagebars-calloutbar-this"); // bug lead to 'could not find dotted symbol' here
    } );
}