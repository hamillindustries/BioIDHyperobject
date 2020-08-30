import EventDispatcher from 'events'
import SceneManager from './SceneManager'

class Page extends EventDispatcher {
  constructor (mId) {
    super()
    this._id = mId
    this._isOpened = false
  }

  init (mParams) {
    console.log('Init page', mParams)
  }

  open (mParams) {
    console.log('Open Page :', this.id, mParams)
    this._isOpened = true
    this.opened()
  }

  opened () {
    this.emit(SceneManager.OPENED)
  }

  close () {
    this._isOpened = false
    console.log('Close Page :', this.id)
    this.closed()
  }

  closed () {
    this.emit(SceneManager.CLOSED)
  }

  destory () {

  }

  update () { }

  render () { }

  get isOpened () { return this._isOpened }

  get id () { return this._id }
}

export default Page
