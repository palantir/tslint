
switch (foo) {
case 1:
    bar();
    break;
}

switch (foo) {
case 1:
    bar();
    break;
case 2:
    bar();
    break;
case 3:
    bar();
    break;
}

// valid
switch (foo) {
case 1:
    bar();
    break;
default:
    break;
}

// valid
switch (foo) {
default:
    bar();
    break;
case 1:
    bar();
    break;
}

// valid
switch (foo) {
case 1:
    bar();
    break;
default:
    break;
case 2:
    break;
}

// valid
baz:
switch(foo) {
case 1:
    bar();
    continue baz;
default:
    break;
}

