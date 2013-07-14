/// <reference path='fourslash.ts' />

//@file_0.ts
////export enum Topic{ One, Two }
////var topic = Topic.One;

//@file_1.ts
////import t = module('file_0');
////var topic = t.Topic./*1*/

goTo.file("file_1.ts");
goTo.marker('1');
verify.memberListContains("One");