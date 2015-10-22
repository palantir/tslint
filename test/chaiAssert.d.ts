/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */

declare var assert: Chai.Assert;

declare namespace NodeJS {
    interface Global {
        assert: Chai.Assert;
    }
}
