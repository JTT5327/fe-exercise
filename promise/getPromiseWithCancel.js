/**
 * 通过扩展promise，支持手动终止promise.then 成功回调
 * 实际应用中，还有这样一种场景：
 * 我们正在发送多个请求用于请求数据，等待完成后将数据插入到不同的 dom 元素中，
 * 而如果在中途 dom 元素被销毁了（比如 react 在 useEffect 中请求的数据时，组件销毁），
 * 这时就可能会报错。因此我们需要提前中断正在请求的 Promise，不让其进入到 then 中执行回调。
 */
function getPromiseWithCancel(originalPromise) {
  let cancel = null;
  let isCancel = false;
  const cancelPromise = new Promise((resolve, reject) => {
    cancel = (...args) => {
      isCancel = true;
      reject(...args);
    };
  });

  const unionPromise = Promise.race([originalPromise, cancelPromise]).catch(
    (e) => {
      if (isCancel) {
        // 主动取消，则不触发外层的catch(也不会触发外层then)
        return new Promise(() => {});
      } else {
        return Promise.reject(e);
      }
    }
  );

  return Object.assign(unionPromise, { cancel });
}

// 示例
import { unmounted } from "vue";

const originPromise = axios.get("url");

const unionPromise = getPromiseWithCancel(originPromise);

unionPromise.then((data)=>{
    console.log("渲染数据", data);
})

unmounted(()=>{
    // 页面卸载时，主动取消promise异步请求，将不会再执行then回调渲染数据
    unionPromise.cancel();
})



