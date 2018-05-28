/**
 * 目录
 * 1. includes(), startsWith(), endsWith()
 * 2. repeat()
 * 3. 模板字符串
 */

 // 1. includes(), startWith(), endsWith()

/**
 * includes()：返回布尔值，表示是否找到了参数字符串。
 * startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
 * endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
 */
 let s = 'Hello world';
 s.includes('o') // true
 s.startsWith('Hello') // true
 s.endsWith('!') // true

 // 这三个方法都支持第二个参数，表示开始搜索的位置。
let ss = 'Hello world!';
ss.startsWith('world', 6) // true
ss.endsWith('Hello', 5) // true
ss.includes('Hello', 6) // false
//上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。

// 2. repeat()

//repeat方法返回一个新字符串，表示将原字符串重复n次。
'na'.repeat(2) // 'nana'
'na'.repeat(0) // ''

//参数如果是小数，会被取整。 
'na'.repeat(2.9) // 'nana'
'na'.repeat(2.1) // 'nana'

//如果repeat的参数是负数或者Infinity，会报错。
'na'.repeat(Infinity)
// RangeError
'na'.repeat(-1)
// RangeError

//但是，如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。0 到-1 之间的小数，取整以后等于-0，repeat视同为 0。
'na'.repeat(-0.9) // ''
//参数NaN等同于 0。
'na'.repeat(NaN) // ""

//如果repeat的参数是字符串，则会先转换成数字。
'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"


// 3. 模板字符串

//模板字符串之中还能调用函数。
function fun() {
  return 'Hello world';
}
`foo ${fun()} bar`
// foo Hello world bar
