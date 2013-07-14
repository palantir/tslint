
var o = {

    counter: 0,

    start: function() {

        window.onmousemove = () => {

            console.log("iteration: " + this.counter++);

            var f = () => this.counter;

        }

    }

}



class X {
	private value = "value";

	public foo() {
		var outer= () => {
			console.log(this.value); // works as expected

			var inner= () => {
				console.log(this.value); // is undefined
			}

			inner();

		};
		outer();
	}

}
