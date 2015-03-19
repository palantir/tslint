module Module
{
    export enum Enumeration
    {
        A,
        B,
        C,
        D
    }

    export function Call()
    {
        if (x == 3)
        {
            x = 4;
        }
        else {
            x = 5;
        }
        return "called";
    }
}

interface Class
{
    variable: string;
}

var object =
{
    a: 1,
    b: 2
};

for(var x= 0; x < 1; ++x)
{
    ++i;
}

switch(y)
{
    case 0:
        x--;
        break;
    default:
        x++;
        break;
}

try
{
    throw new Error("hi");
}
catch (e)
{
    throw(e);
}

while(x < 10){
    x++;
}

function f():
    number {

    return 5;
}

if (cond1 &&
    cond2)
 {
    i++;
 }

 if (cond1 &&
     cond2)
{
    i++;
}

// valid
if (cond1 &&
    cond2 &&
    cond3)
{
    i++;
}

// valid
while (cond1 &&
       cond2)
{
    count++;
}

// valid
for (var i = 0;
     i < length;
     i++)
{
    count++;
}
     

