---
layout: page
title: Rule Flags
permalink: /usage/rule-flags/
---

You can enable/disable TSLint or a subset of rules within a file with the following comment rule flags:

* `/* tslint:disable */` - Disable all rules for the rest of the file
* `/* tslint:enable */` - Enable all rules for the rest of the file
* `/* tslint:disable:rule1 rule2 rule3... */` - Disable the listed rules for the rest of the file
* `/* tslint:enable:rule1 rule2 rule3... */` - Enable the listed rules for the rest of the file

Rules flags enable or disable rules as they are parsed. A rule is enabled or disabled until a later directive commands otherwise. Disabling an already disabled rule or enabling an already enabled rule has no effect.

For example, imagine the directive `/* tslint:disable */` on the first line of a file, `/* tslint:enable:ban class-name */` on the 10th line and `/* tslint:enable */` on the 20th. No rules will be checked between the 1st and 10th lines, only the `ban` and `class-name` rules will be checked between the 10th and 20th, and all rules will be checked for the remainder of the file.

Here's an example:

```ts
function validRange (range: any) {
   return range.min <= range.middle && range.middle <= range.max;
}

/* tslint:disable:object-literal-sort-keys */
const range = {
   min: 5,
   middle: 10,    // TSLint will *not* warn about unsorted keys here
   max: 20
};
/* tslint:enable:object-literal-sort-keys */

const point = { 
   x: 3,
   z: 5,          // TSLint will warn about unsorted keys here
   y: 4,
}

console.log(validRange(range));
```
