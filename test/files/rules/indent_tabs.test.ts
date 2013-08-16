// valid code
module TestModule {
	var func = () => {
		console.warn("hi");
	};

	class TestClass {
		private variable;

		testFunction() {
			this.variable = 3;
		}
	}

	var obj = {
		a: 1,
		b: 2,
		c: 3
	};

	export enum TestEnum {
		VALUE1,
		VALUE2
	}

	switch (integerValue) {
		case 1:
			console.warn("1");
			break;
		default:
			console.warn("default");
			break;
	}

	function loops() {
		for (var i = 0; i < 1; ++i) {
			console.warn(i);
		}

		while (i < 1) {
			console.warn(i);
		}

		do {
			console.warn(i);
		} while (i < 1);

		if (i < 1) {
			console.warn(i);
		} else {
			console.warn(i + 1);
		}
	}
}

// invalid code
module TestModule {
	  var testVariable = 123;
}

function() {
		 var test = 123;
}

class TestClass {
  private variable;

  testFunction() {
		this.variable = 3;
	}
}

var obj = {
	 a: 1,
	  b: 2,
	   c: 3
};

enum TestEnum {
	  VALUE1,
	 VALUE2
}

switch (integerValue) {
	 case 1:
	  console.warn("1");
		break;
  default:
	  console.warn("default");
		break;
}

for (var i = 0; i < 1; ++i) {
  "123";
}

while (i < 1) {
	  "123";
}

do {
	 "123";
} while (i < 1);

if (i < 1) {
	   "123";
}

var arr = [
	{
	  a: 1,
	   b: 2
	}
];

// more valid code
var arr = [
	{
		a: 1,
		b: 2
	},
	{
		a: 3,
		b: 4
	}
];

var arr2 = [1, 2, 3];
var obj = {a: 1, b: 2, c: 3};
var both = {a: [1, 2, 3], b: [4, 5, 6]};
