/**
 * 目录
 * 1.扩展运算符
 * 2.Array.from() 和 Array.of()
 * 3.
 */

 // 1.扩展运算符

 // 扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。
 console.log(...[1, 2, 3])
// 1 2 3
console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

// 由于扩展运算符可以展开数组，所以不再需要使用apply方法，将数组转为函数的参数了。
// ES5写法
function f(x, y, z){}
var args = [0,1,2];
f.apply(null, args);
//ES6写法
function f(x, y, z){}
var args = [0,1,2];
f(...args);

// 扩展运算符还可以将字符串转为真正的数组。
[...'hello'] // ['h', 'e', 'l', 'l', 'o']


// 2. Array.from() 和 Array.of()
