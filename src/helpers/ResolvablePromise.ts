class PromiseHelper {
  getResolvablePromise<T>(): ResolvablePromise<T> {
    let resolver: (data: T) => void
    const promise: Promise<T> = new Promise<T>((resolve) => {
      resolver = resolve
    })
    const assign = Object.assign(promise, {
      resolve: (data: T) => {
        resolver(data)
      },
      resolved: false,
    })
    assign.then(() => {
      assign.resolved = true
    })
    return assign
  }
}

const promiseHelper = new PromiseHelper()
export type ResolvablePromise<T> = Promise<T> & {
  resolved: boolean
  resolve(data: T): void
}

export default promiseHelper
