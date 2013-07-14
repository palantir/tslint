class Person {
    children: string[];
 
    constructor (public name: string, children: string[]) {
        this.children = children;
    }
 
    addChild = () => this.children.push("New child");
}
