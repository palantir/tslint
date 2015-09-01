namespace foo {
}

module bar {
}

declare module buzz {
}

declare module "hoge" {
}
declare module 'fuga' {
}

namespace foo.bar {
}
namespace foo.bar.baz {
}
namespace foo {
    namespace bar.baz {
    }
}

namespace foo.bar {
    module baz {
        namespace buzz {
        }
    }
}

module foo.bar {
    namespace baz {
        module buzz {
        }
    }
}

namespace name.namespace {
}
namespace namespace.name {
}

// intentionally malformed for test cases, do not format
declare module declare
.dec{}
declare  module dec . declare  {
}

module  mod.module{}
module module.mod
{
}
