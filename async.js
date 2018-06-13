//现有 n 个异步任务，这 n 个异步任务是依次执行且下一个异步任务依赖上一个异步任务的结果作参数，问如何实现。

const task = data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      data++;
      resolve(data);
    }, 2000)
  });
};

task(1).then(res => {
  console.log('第一个异步的结果', res);
  return task(res);
}).then(res => {
  console.log('第二个异步的结果', res);
  task(res);
});

// for (let i = 0; i < array.length; i++) {
  
  
// }