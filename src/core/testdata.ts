var jsCodeArr = [
    "// ------------------------------",
    "// ------------------------------",
    "function Person(age) {",
    "	if (age) {",
    "		this.age = age;",
    "	}",
    "}",
    "Person.prototype.getAge = function () {",
    "	return this.age;",
    "};",
    "",
    "",
];

jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));
jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));
jsCodeArr = jsCodeArr.concat(jsCodeArr.slice(0));

jsCodeArr[49] +=
    "And this is some long line. And this is some long line. And this is some long line. And this is some long line. And this is some long line. ";


export const jsCode = jsCodeArr.join("\n");