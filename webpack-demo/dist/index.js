(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["index"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _add__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add */ \"./src/add.js\");\n/* harmony import */ var _multiply__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multiply */ \"./src/multiply.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ \"./node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nconst onceAdd = Object(lodash__WEBPACK_IMPORTED_MODULE_2__[\"once\"])(_add__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\nconst addResult = onceAdd(1, 2)\n\nconst mulResult = Object(_multiply__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(2, 2)\n\nconsole.log(addResult)\nconsole.log(mulResult)\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/multiply.js":
/*!*************************!*\
  !*** ./src/multiply.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return multiply; });\n/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ \"./src/common.js\");\n\n\nfunction multiply(a, b){\n    return Object(_common__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(a * b)\n}\n\n//# sourceURL=webpack:///./src/multiply.js?");

/***/ })

},[["./src/index.js","runtime","commons~index~other","vendor"]]]);