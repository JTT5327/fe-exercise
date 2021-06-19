setTimeout(function(){
    console.log("timer1");
    Promise.resolve().then(function(resolve){
        console.log("promise1");
    })
},0)

setTimeout(function(){
    console.log("timer2");
    Promise.resolve().then(function(){
        console.log("promise2");
    })
},0)