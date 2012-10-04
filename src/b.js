// Module definition
module myModule {

    // Import declaration
    import { otherVar, otherFunction } from otherModule;

    // Export declarations
    export var myVar = 42;

    // Module reference
    module another = anotherModule;

    // Arrow function
    var f = a => a + 42;

    var value = another.anotherVar;

    var obj = {
        // Shorthand property
        value,

        // Method definition
        method(arg1, arg2) { return arg1 + arg2; },

        // Concise method definition
        concise(arg1, arg2) arg1 + arg2
    };

    // Class declarations
    class A {
        // constructors
        constructor(a) {
            this.a = a;
        }
        method() {
            return this.a;
        }
        // getters and setters
        set a(a) {
            this._a = a;
        }
        get a() {
            return this._a;
        }
        b() {
            // anonymous class expressions
            // and inheritance
            return class extends A {
                constructor() {
                    super('a');
                }
                method() {
                    return 'hi ' + super.method();
                }
            }
        }
    }
    export var B = A
    var b = new (a.b());
    b.method();

}