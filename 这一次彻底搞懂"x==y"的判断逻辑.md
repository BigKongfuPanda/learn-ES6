javascript 是弱类型语言，在进行 == 运算的时候 ，如果等号两边的数值类型不同的时候，会进行类型转换。

## 1. 类型转换的逻辑算法

关于如何进行类型转换，ECMA 的标准里面有说明，如下所示：

```
The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:
1. If Type(x) is the same as Type(y), then
    - If Type(x) is undefined, return true;
    - If Type(x) is null, return true;
    - If Type(x) is Number, then
        - If x is NaN, return false;
        - If y is NaN, return false;
        - If x is the same Number value as y, return true;
        - If x is +0 and y is -0, return true;
        - If x is -0 and y is +0, return true;
        - Return false.
    - If Type(x) is String, then return true if x and y are exactly the same sequence of characters(same length and same characters in corresponding positions). Otherwise, return false;
    - If Type(x) is Boolean, return true if x and y are both true or both false. Otherwise, return false;
    - Return true if x and y refer to the same object. Otherwise, return false;

2. If x is null and y is undefined, return true;
3. If x is undefined and y is null, return true;
4. If Type(x) is Number and Type(y) is String, return result of the comparison of x == ToNumber(y);
5. If Type(x) is String and Type(y) is Number, return result of the comparison of ToNumber(x) == y;
6. If Type(x) is Boolean, return result of the comparison of ToNumber(x) == y;
7. If Type(y) is Boolean, return result of the comparison of x == ToNumber(y);
8. If Type(x) is either String or Number and Type(y) is Object, return result of the comparison of x == ToPrimitive(y);
9. If Type(x) is Object and Type(y) is either String or Number, return result of the comparison of ToPrimitive(x) == y;
10. Return false.
```

归纳起来，是按照以下的顺序来执行判断逻辑的：

1. 首先判断 `x` 和 `y` 的数据类型，如果数据类型相同，则判断值是否相同，如果相同则为 `true` , 否则为 `false`。其中需要注意的是 `Number` 类型，如果 x 和 y，二者中至少有一个为 `NaN`，则为 `false；`。如果类型不同，则会进行类型转换。
2. 如果 `x` 和 `y`，二者中一个为 `null` ，一个为 `undefined` ，则为 `true`；
3. 如果 `x` 和 `y` 中，一个是 `Number` 类型，一个是 `String` 类型，则将 `String` 类型的数据转换为 `Number` 类型；
4. 如果 `x` 和 `y` 中，一个是 `Boolearn` 类型，则将 `Boolearn` 类型的数据转换为 `Number` 类型，`true -> 1`，`false -> 0`；
5. 如果 `x` 和 `y`，二者中一个为 `Object` ，另一个为 `Number` 或 `String` ，则为会调用 `ToPrimitive(Object)`，然后再将其返回值跟另一个值进行比较；
6. 如果不满足上述的判断，则返回 `false` 。除了 `null` 和 `undefined` 以外，其他类型的数据，与 `null` 和 `undefined`
 进行 `==` 比较时，直接返回 `false`。

## 2. ToPrimitive

上述中，当 `x` 和 `y` 中有一个是 `Object` 类型时，会先进行 `ToPrimitive()` 的运算，于是继续查找 `ToPrimitive()` 的标准。

> 7.1.1 ToPrimitive ( input [ , PreferredType ] )

> The abstract operation ToPrimitive takes an input argument and an optional argument PreferredType. The abstract operation ToPrimitive converts its input argument to a non-Object type. If an object is capable of converting to more than one primitive type, it may use the optional hint PreferredType to favour that type. Conversion occurs according to the following algorithm:
> 1. Assert: input is an ECMAScript language value.
> 2. If Type(input) is Object, then
>    - If PreferredType is not present, let hint be "default".
>    - Else if PreferredType is hint String, let hint be "string".
>    - Else PreferredType is hint Number, let hint be "number".
>    - Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
>    - If exoticToPrim is not undefined, then
>       - Let result be ? Call(exoticToPrim, input, « hint »).
>       - If Type(result) is not Object, return result.
>       - Throw a TypeError exception.
>    - If hint is "default", set hint to "number".
>    - Return ? OrdinaryToPrimitive(input, hint).
> 3. Return input. 

> When ToPrimitive is called with no hint, then it generally behaves as if the hint were Number. However, objects may over-ride this behaviour by defining a @@toPrimitive method. Of the objects defined in this specification only Date objects (see 20.3.4.45) and Symbol objects (see 19.4.3.4) over-ride the default ToPrimitive behaviour. Date objects treat no hint as if the hint were String.

关于 `OrdinaryToPrimitive(input, hint)`，标准如下： 

> 7.1.1.1 OrdinaryToPrimitive ( O, hint )

>When the abstract operation OrdinaryToPrimitive is called with arguments O and hint, the following steps are taken:
> 1. Assert: Type(O) is Object.
> 2. Assert: Type(hint) is String and its value is either "string" or "number".
> 3. If hint is "string", then
>    - Let methodNames be « "toString", "valueOf" ».
> 4. Else,
>    - Let methodNames be « "valueOf", "toString" ».
> 5. For each name in methodNames in List order, do
>    - Let method be ? Get(O, name).
>    - If IsCallable(method) is true, then
>        - Let result be ? Call(method, O).
>        - If Type(result) is not Object, return result.
> 6. Throw a TypeError exception. 

看了以上的标准，关键信息总结如下：

- 如果传入的 `hint` 是 `String` ，先判断 `toString` 能否调用，再判断 `toString`() 的结果，是基本类型才返回，再判断 `valueOf` 能否调用，再判断 `valueOf()` 的结果，是基本类型才返回，否则报错。
- 如果传入的 `hint` 是 `Number`（或者没有 `hint` ，默认是 `Number` ），先判断 `valueOf` ，再判断 `toString` 。
- 对于普通 `Object` ，默认用 `hint` 为 `Number` 的方式来转换，对于 `Date` 类型的 `Object` ，用 `hint` 为 `String` 的方式来转换。
- 同时，因为 `Object` 的 `valueOf` 和 `toString` 方法有可能会被重写，所以会调用重写后的 `valueOf` 和 `toString` 。

## 3. 常见 Object 类型的 valueOf() 和 toString() 返回值

```js
// 普通 object
let obj1 = {};
let obj2 = {a: 1, b: 'obj', c: function(){}, d: undefined, e: null};
let obj3 = new Object('test');
let obj4 = new Object(1);
let obj5 = new Object({a: 1});
// 普通 object 的 valueOf
obj1.valueOf(); // {}
obj2.valueOf(); // {a: 1, b: 'obj', c: function(){}, d: undefined, e: null}
obj3.valueOf(); // test
obj4.valueOf(); // 1
obj5.valueOf(); // {a: 1}
// 普通 object 的 toString
obj1.toString(); // "[object Object]"
obj2.toString(); // "[object Object]"
obj3.toString();// "test"
obj4.toString();// "1"
obj5.toString();// "[object Object]"

// 数组
let arr1 = [];
let arr2 = [undefined];
let arr3 = [null];
let arr4 = [1, '1'];
let arr5 = [{a: 1}, {fn: function(){}}];
// 数组的 valueOf
arr1.valueOf(); // []
arr2.valueOf(); // [undefined]
arr3.valueOf(); // [null]
arr4.valueOf(); // [1, '1']
arr5.valueOf(); // [{a: 1}, {fn: function(){}}]
// 数组的 toString
arr1.toString(); // ""
arr2.toString(); // ""
arr3.toString(); // ""
arr4.toString(); // "1,1"
arr5.toString(); // "[object Object],[object Object]"

// 函数
let fn = function(){};
// 函数默认的 valueOf
fn.valueOf(); // function(){}
// 函数默认的 toString
fn.toString(); // "function(){}"

// 函数的 valueOf 和 toString 方法可以被改写
let fn1 = function() {};
fn1.valueOf = function(){
  return '改写后的valueOf';
};
fn1.toString = function(){
  return '改写后的toString';
};
fn1.valueOf(); // "改写后的valueOf"
fn1.toString(); // "改写后的toString"
```

## 4. 实例

```js
[] == ![]; // true
//判断逻辑：首先 ![] 为 Boolean 类型，等号两边的数据类型不同，会将 ![] 进行类型转换，因为 ![] 为 false，所以转为数值类型 0, 此时等式变为了 [] == 0，[] 为 Object类型，而 0 为数值类型，所以调用 [] 的 ToPrimitive 方法，先执行 [].valueOf()，返回值为 []，不是基本数据类型，继续调用 [].toString()，返回值为 ""，此时等式变为了 "" == 0，然后将 "" 空字符串转换为数值类型 0，从而等式变为了 0 == 0，为 true。
[] == []; // false
[] == {}; // false

'' == '0'; // false
'' == 0; // true

false == 'false'; // false
false == '0'; // true
false == undefined; // false
false == null; // false
undefined == null; // true

{} + 1; // 1
// 有人会认为答案应该是'[object Object]1'，因为对Object进行ToPrimary()，先看valueOf()，发现是自身，不是基本类型，再看toString()，发现是'[object Object]'，返回这个值，然后再相加；但是问题出在编译器会认为前面的{}是一个代码块，后面是一元操作符加号和1，所以结果为1

{} + '1'; // 1
// 没错，这里证明了这个加号是一元的，将'1'转化为了number

var a = {};
a + 1; // '[object Object]1'
// 老铁，这次就对了

[1,2] + 1; // '1,21' 
// [1,2]，先对Object进行ToPrimary()，先看valueOf()，发现是自身，不是基本类型，再看toString，Array的toString()相当于join(',')，所以得到'1,2'再和1相加得到'1,21'

// 普通的Object
var a = {}; // 普通类型的ToPrimitive会遵从hint Number的转换规则
a.toString = () => 100;
a.valueOf = () => '10';

a + 2; // '102' -> 相当于 '10' + 2 为 '102'
a + '2'; // '102'
a > 3; // true -> 进行ToPrimitive() hint为Number操作之后 -> 比较 '10' > 3 -> 不都是String类型，对'10'进行ToNumber(), 10 > 3为true 
a > '3'; // false -> 实际比较的是 '10' > '3' 第一个字符的ascii码小，直接为false
a == 100; // false -> 相当于 '10' == 100为false

// Date类型的Object
var b = new Date(); // Date类型的ToPrimitive会遵从hint String的转换规则
b.toString = () => 100; // 这里的搞怪为了测试
b.valueOf = () => '10';

b + 2; // 102 -> 加号是ToPrimitive(), 100 + 2 为102
b + '2'; // '1002' -> 相当于 100 + '2'为'1002'
b > 3; // true -> 进行ToPrimitive() hint为Number操作之后 -> 比较 '10' > 3 -> 不都是String类型，对'10'进行ToNumber(), 10 > 3为true 
b > '3'; // false -> 实际比较的是 '10' > '3' 第一个字符的ascii码小，直接为false
b == 100; // true -> 进行ToPrimitive()操作
```

实现下面的题目：

```js
// 实现一个add方法
function add() {
    // ...
}

// 满足以下类型的调用和计算
add(1)(2)(3) + 1; // 7

var addTwo = add(2);
addTwo + 5; // 7
addTwo(3) + 5; // 10
add(4)(5) + add(2); // 11
```

答案：

```js
function add (n) {
  function fn (x) {
    return add(n + x);
  }
  fn.valueOf = function(){
    return n;
  }
  return fn;
}
```

## 参考资料：

[ECMA-262 edition 9](https://www.ecma-international.org/ecma-262/9.0/index.html#Title)

[深入理解Javascript中Object类型的转换](https://zhuanlan.zhihu.com/p/29730094)