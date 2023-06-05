type Task = () => Promise<any>

class PromiseQueue {
  private tasks: Task[] = []

  private isLocking = false

  private executeHead = () => {
    if (this.isLocking) {
      return
    }
    const task = this.tasks.shift()
    if (task !== undefined) {
      this.isLocking = true
      task().finally(() => {
        this.isLocking = false
        this.executeHead()
      })
    }
  }

  add = (task: Task) => {
    this.tasks.push(task)
    this.executeHead()
  }
}

export default PromiseQueue
