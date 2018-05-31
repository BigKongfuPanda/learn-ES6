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
/**
 * Array.from()方法可以将两类对象转为真正的数组：类似数组的对象和可遍历（iterable）的对象
 * （包括 ES6 新增的数据结构 Set 和 Map）。实际应用中，常见的类似数组的对象是
 *  DOM 操作返回的 NodeList 集合，以及函数内部的arguments对象。
 * 任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换了。
 */
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
//  ES5 的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6 的写法
var arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
//只要是部署了 Iterator 接口的数据结构，Array.from都能将其转为数组。
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
let namesSet = new Set(['a', 'b', 'c']);
Array.from(namesSet); // ['a', 'b']

/**
 * Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，
 * 将处理后的值放入返回的数组。
 */
Array.from(arrayLike, x => x * x);
//等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], x => x * x); // [1, 4, 9]


/**
 * Array.of()方法用于将一组值，转换为数组。
 */
Array.of(1, 2, 3); // [1, 2, 3]
Array.of(4); // [4]  
// 比较 
Array(4); // [ , , , ]
Array.of() // []