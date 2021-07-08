// setTimeout(function(){
//     console.log("timer1");
//     Promise.resolve().then(function(resolve){
//         console.log("promise1");
//     })
// },0)

// setTimeout(function(){
//     console.log("timer2");
//     Promise.resolve().then(function(){
//         console.log("promise2");
//     })
// },0)

// console.log('script start')

// async function async1() {
// 	await async2()
// 	console.log('async1 end')
// }

// async function async2() {
// 	console.log('async2 end')
// }
// async1()

// setTimeout(function() {
// 	console.log('setTimeout')
// }, 0)

// new Promise(resolve => {
// 	console.log('Promise')
// 	resolve()
// }).then(function() {
// 	console.log('promise1')
// }).then(function() {
// 	console.log('promise2')
// })

// console.log('script end')

// console.log('script start')

// async function async1() {
//     await async2()
//     console.log('async1 end')
// }
// async function async2() {
//     console.log('async2 end')
//     return Promise.resolve().then(()=>{
//         console.log('async2 end1')
//     })
// }
// async1()

// setTimeout(function() {
//     console.log('setTimeout')
// }, 0)

// new Promise(resolve => {
//     console.log('Promise')
//     resolve()
// }).then(function() {
//     console.log('promise1')
// }).then(function() {
//     console.log('promise2')
// })

// console.log('script end')

setImmediate(() => {
    console.log('timeout1')
    Promise.resolve().then(() => console.log('promise resolve'))
    process.nextTick(() => console.log('next tick1'))
});
setImmediate(() => {
    console.log('timeout2')
    process.nextTick(() => console.log('next tick2'))
});
setImmediate(() => console.log('timeout3'));
setImmediate(() => console.log('timeout4'));