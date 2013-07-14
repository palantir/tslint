// bug 685324: 
// @declaration:true
class List<T extends {}>{
    static empty<T extends {}>(): List<T>{return null;}
}




