/// <reference path="fourslash.ts"/>

////{| "itemName": "Bar", "kind": "class", "parentName": "" |}export class Bar {
////    {| "itemName": "s", "kind": "property", "parentName": "Bar" |}public s: string;
////}

verify.navigationItemsCount(3); // external module node + class + property

test.markers().forEach((marker) => {
    verify.navigationItemsListContains(marker.data.itemName, marker.data.kind, marker.fileName, marker.data.parentName);
});
