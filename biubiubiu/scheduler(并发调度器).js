/**
 * 并发操作控制管道
 * 可以设置最大并发数，
 * 可以随时新增操作到队列中，
 * 同时并行执行中的任务数不超过限制数量，
 * 有一个执行完，就可以有等待的任务进入执行。
 */
class Scheduler {
    maxLimit = 0;
    taskList = [];
    parrallelNum = 0;
    constructor(limit) {
        this.maxLimit = limit
    }

    add(task, ...args) {
        this.taskList.push({ asyncFn: task, args: args })
        console.log("等待执行的任务数：", this.taskList.length)
        this.flushQueue()
    }

    // start() {
    //     for (let i = 0; i < this.maxLimit; i++) {
    //         this.flushQueue()
    //     }
    // }
    // 执行任务队列
    flushQueue() {
        // 任务列表为空或者并发任务达到最大限制数，则终止当前递归任务执行
        if (!this.taskList.length || this.parrallelNum >= this.maxLimit) return

        const taskInfo = this.taskList.shift()

        this.parrallelNum++

        console.log('当前并发数: ', this.parrallelNum)

        const result = taskInfo.asyncFn.apply(null, taskInfo.args)
        // Promise.resolve 保证任务task.asyncFn函数结果是一个promise实例
        Promise.resolve(result).then(() => {
            this.parrallelNum--
            console.log('剩余等待任务数: ', this.taskList.length)
            this.flushQueue()
        })
    }
}

function sleep(time = 1000) {
    return new Promise((reslove) => {
        setTimeout(() => {
            console.log('time:', time)
            reslove()
        }, time)
    })
}


const scheduler = new Scheduler(3)

scheduler.add(sleep, 1000)
scheduler.add(sleep, 500)
scheduler.add(sleep, 600)
scheduler.add(sleep, 400)
scheduler.add(sleep, 200)
scheduler.add(sleep, 800)