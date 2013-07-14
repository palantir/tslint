/// <reference path='fourslash.ts' />

// Bug 673658
////'foo'.replace('o', '3')./*1*/replace/*2*/('f', 5);

/*
verify.errorExistsBetweenMarkers('1', '2');
*/