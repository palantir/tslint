class arrTest {
    test(arg1: number[]) {
    }

    callTest() {
      this.test([1,2,"hi", 5, ]);
      this.test([1,2,"hi", 5 ]);
    }
}
