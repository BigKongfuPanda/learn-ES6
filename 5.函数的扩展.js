/**
 * 目录
 * 1. 函数参数的默认值
 * 2. rest参数
 * 3. 严格模式
 * 4. name属性
 * 5. 箭头函数
 * 6. 双冒号运算符
 */

 // 1. 函数参数的默认值

 //  1.1 给函数参数设置默认值的意思是，当没有传参时，参数取设定的默认值.

// ES5写法
function log(x, y) {
    if (y === 'undefined') {
        y = 'world';
    }
    console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello 

// ES6写法
function log (x, y = 'world') {
    console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

// 1.2 与解构赋值默认值结合使用
function foo({x = 1, y = 5} = {}) {
    console.log(x, y);
}
foo({x: 7}) // 7  5
foo({y: 6})  // 1  6
foo({x: 3, y: 8}) // 3  8
foo({}) // 1  5
foo() // 1 5
// 上述函数中参数的解构赋值有两层含义： 首先参数为一个对象，其中两个属性 x 和 y 都有默认值，其次，这个对象作为一个参数也有默认值，其默认值为一个空对象{}。因此，当没有传参而调用函数时，该参数取默认的空对象，然后呢，在空对象中，去读取 x 和 y 两个属性的时候，发现均为定义，为 undefined，则此时 x 和 y 分别去取各自的默认值，即 1 和 5。

// 1.3 参数默认值的位置
// 通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
function f(x, y = 5, z) {
    return [x, y, z];
}
f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]

// 1.4 函数的 length 属性
// 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2

// 1.5 作用域
// 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
let x = 1;
function f(y = x){
    let x = 2;
    console.log(y);
}
f(); // 1
// 上面代码中，函数f调用时，参数 y = x 形成一个单独的作用域。这个作用域里面，变量 x 本身没有定义，所以指向外层的全局变量x。函数调用时，函数体内部的局部变量x影响不到默认值变量x。

// 更复杂的例子
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}
foo() // 3
x // 1
//上面代码中，函数foo的参数形成一个单独作用域。这个作用域里面，首先声明了变量x，然后声明了变量y，y的默认值是一个匿名函数。这个匿名函数内部的变量x，指向同一个作用域的第一个参数x。函数foo内部又声明了一个内部变量x，该变量与第一个参数x由于不是同一个作用域，所以不是同一个变量，因此执行y后，内部变量x和外部全局变量x的值都没变。


//如果将var x = 3的var去除，函数foo的内部变量x就指向第一个参数x，与匿名函数内部的x是一致的，所以最后输出的就是2，而外层的全局变量 x 依然不受影响。
var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}
foo() // 2
x // 1


// 2. rest 参数
// ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。
function f(a, ...arr, b) {
    // ...
}  // 报错


// 4. name属性

var f = function () {};
// ES5
f.name // ""
// ES6
f.name // "f"


// 5. 箭头函数

// 当函数体中的代码只有一行的时候，可以省略 return 和 大括号 {}
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};

// 所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
// 报错
let getTempItem = id => { id: id, name: "Temp" };
// 不报错
let getTempItem = id => ({ id: id, name: "Temp" });

// 下面是一种特殊情况，虽然可以运行，但会得到错误的结果
let foo = () => { a: 1 };
foo() // undefined
/**
 * 上面代码中，原始意图是返回一个对象{ a: 1 }，但是由于引擎认为大括号是代码块，
 * 所以执行了一行语句a: 1。这时，a可以被解释为语句的标签，因此实际执行的语句是1;，然后函数就结束了，没有返回值。
 */


//使用注意点
//箭头函数有几个使用注意点。
//（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
//（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
//（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
//（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
//（5）由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。
//上面五点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。

// 箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。下面是几个例子
function foo() {
  setTimeout(() => {
    console.log('id:': this.id);
  }, 100);
}
var id = 21;
foo.call({id: 42}); // id: 42
/**
 * 上面代码中，setTimeout的参数是一个箭头函数，这个箭头函数的定义生效是在foo函数生成时，而它的真正执行要等
 * 到 100 毫秒后。如果是普通函数，执行时this应该指向全局对象window，这时应该输出21。但是，箭头函数导致
 * this总是指向函数定义生效时所在的对象（本例是{id: 42}），所以输出的是42。
 */

 //箭头函数可以让setTimeout里面的this，绑定定义时所在的作用域，而不是指向运行时所在的作用域。下面是另一个例子。
 function Timer() {
   this.s1 = 0;
   this.s2 = 0;
   // 剪头函数
   setInterval(() => this.s1++, 1000);
   // 普通函数
   setInterval(function(){
     this.s2++;
   }, 1000);
 }
 var timer = new Timer();
 setTimeout(() => console.log('s1:', timer.s1), 3100); // s1: 3
 setTimeout(() => console.log('s2:', timer.s2), 3100);// s2: 0
 /**
  * 在剪头函数中, this 指向 构造函数中的this，即指向实例化对象 timer，所以当 3100 ms后输出 timer.s1 时，其实就是输出 this.s1，故结果为3。
  * 而，在普通函数中, this 指向的是 window对象。所以setInterval函数中的 this.s2++ 等同于 是 window.s2++，故，输出 timer.s2时，其结果为 0。
  */


  // 6. 双冒号运算符
// 双冒号运算符用来取代 call, apply, bind 调用
obj::fun; 
// 等同于 
obj.bind(fun);

obj::fun(...arguments);
// 等同于
obj.apply(fun, arguments);

//如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。 
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);