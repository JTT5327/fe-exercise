import dayjs from 'dayjs'
export const chatTime = (time) => {
    const targetTime = new Date(time.replace(/-/g, '/')).getTime()

    const nowTime = new Date().getTime()

    const unit = [1000, 60, 60, 24, 7]

    const name = ['刚刚', '刚刚', '分钟前', '小时前', '天前']

    let gap = Math.abs(nowTime - targetTime)

    let index = 0

    for (let i = 0; i < unit.length; i++) {
        index = i
        if (gap <= unit[i]) {
            break
        } else {
            if (i < unit.length - 1) {
                gap = Math.ceil(gap / unit[i])
            }

            // 超过7天，显示日期YYYY-MM-DD
            if(i === unit.length - 1){
                return dayjs(time).format('YYYY-MM-DD')
            }
        }
    }

    // 间隔时间一分钟内，显示刚刚
    return index < 1 ? name[index] : `${gap}${name[index]}`
}

const time = new Date().getTime()

setTimeout(()=>{
    console.log('目标生成时间', chatTime(time))
}, 6000)