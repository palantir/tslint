class Clazz { //this is not a block comment
    /* block comment
     *Not a jsdoc and not subject to the rules lalala
   * oh look I'm over here and you can't do anything about me
            *and now I'm here, wheeee
I've even got characters where I shouldn't. How fun!    *
    You can't stop me!    */
    public funcxion() {
        /**
         * This is jsdoc
         * and it is correct
         * so should be no errors here
         *
         * not on the above line either
         */
    }

    /**
     * this is also jsdoc
     *and it has a problem on this line
     */

    /**
     * this jsoc is fine
     * up until the last line when it isn't
   */

    /**
     * this jsdoc has characters where it really should
not  */

    /**
     * same thing with this
one  *
     */

    /**
     * what else can go wrong?
   * oh right this
     */

    /**a bad one liner */

    /** another bad one liner*/

    /** */

    /**  */

    /** a good one */

}
