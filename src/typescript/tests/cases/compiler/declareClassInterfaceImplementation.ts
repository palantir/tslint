// bug 16556: Compiler complains about a declare class not implementing an interface
// should not be an error, declared classes don't have an implementation

interface IBuffer {
    [index: number]: number;
}

declare class Buffer implements IBuffer {

}
