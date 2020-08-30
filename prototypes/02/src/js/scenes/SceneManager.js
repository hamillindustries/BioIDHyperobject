import EventDispatcher from 'events'
import Scheduler from 'scheduling'
import { getItem, checkItemExist } from './Utils'

class SceneManager extends EventDispatcher {
  constructor () {
    super()

    this._scenes = []
    this._pages = []
    this._openedCount = 0
    this._closedCount = 0
    this.logging = false

    this._bindPageOpened = () => this._pageOpened()
    this._bindPageClose = () => this._pageClosed()
    this._bindLoop = () => this._loop()

    this._efIndex = -1

    // auto start
    this.play()
  }

  play () {
    if (this._efIndex === -1) {
      this._efIndex = Scheduler.addEF(this._bindLoop)
    }
  }

  pause () {
    this._efIndex = Scheduler.removeEF(this._bindLoop)
  }

  addScene (mId, mPageIds) {
    const pages = typeof mPageIds === 'string' ? [mPageIds] : mPageIds
    this._scenes.push({
      id: mId,
      pages
    })
  }

  addPage (mPage) {
    this._pages.push(mPage)
    return mPage
  }

  setScene (mSceneId, mParams = {}) {
    if (!checkItemExist(mSceneId, this._scenes)) {
      console.error('Scene not exist :', mSceneId)
      return
    }

    if (mSceneId === this._currentScene) { return }

    this._openParams = mParams

    this._nextSceneId = mSceneId
    if (this._currentScene !== undefined) {
      this._closeScenes()
    } else {
      this._openScenes()
    }
  }

  _openScenes () {
    if (this.logging) console.log('Open next scene :', this._nextSceneId)
    let pagesCurrent = []
    if (this._currentScene !== undefined) {
      pagesCurrent = getItem(this._currentScene, this._scenes).pages
    }
    let { pages: pagesToOpen } = getItem(this._nextSceneId, this._scenes)
    pagesToOpen = pagesToOpen.without(pagesCurrent)
    if (this.logging) console.log('Pages to open : ', pagesToOpen, pagesCurrent)
    if (pagesToOpen.length === 0) {
      this._emitOpened()
    }

    this._openedCount = 0
    this._numPagesToOpen = pagesToOpen.length

    pagesToOpen.forEach(pageId => {
      const page = getItem(pageId, this._pages)
      page.init(this._openParams)
    })

    pagesToOpen.forEach(pageId => {
      const page = getItem(pageId, this._pages)
      page.once(SceneManager.OPENED, this._bindPageOpened)
      page.open(this._openParams)
    })
  }

  _pageOpened () {
    this._openedCount++
    if (this._openedCount === this._numPagesToOpen) {
      if (this.logging) console.log('Page all opened', this._nextSceneId)
      this._emitOpened()
    }
  }

  _emitOpened () {
    this._prevScene = this._currentScene
    this._currentScene = this._nextSceneId
    this.emit(SceneManager.OPENED, {
      prevScene: this._prevScene,
      currentScene: this._currentScene
    })
  }

  _closeScenes () {
    let { pages: pagesToClose } = getItem(this._currentScene, this._scenes)
    const { pages: pagesToOpen } = getItem(this._nextSceneId, this._scenes)
    pagesToClose = pagesToClose.without(pagesToOpen)
    this._closePages = []
    this._closedCount = 0

    if (this.logging) console.log('Pages to close', pagesToClose)
    if (pagesToClose.length === 0) {
      this._emitClosed()
      return
    }

    this._numPagesToClose = pagesToClose.length
    pagesToClose.forEach(pageId => {
      const page = getItem(pageId, this._pages)
      page.once(SceneManager.CLOSED, this._bindPageClose)
      this._closePages.push(page)
      page.close()
    })
  }

  _pageClosed () {
    this._closedCount++
    if (this._closedCount === this._numPagesToClose) {
      this._emitClosed()
    }
  }

  _emitClosed () {
    this.emit(SceneManager.CLOSED, {
      closePages: this._closePages
    })
    this._openScenes()
  }

  // enter frame
  _loop () {
    this.openPages.forEach(page => {
      page.update()
    })

    this.openPages.forEach(page => {
      page.render()
    })
  }

  get currentScene () { return this._currentScene }
  get prevScene () { return this._prevScene }

  get scenes () { return this._scenes }

  get pages () { return this._pages }
  get openPages () { return this._pages.filter(p => p.isOpened) }
  get openPageIds () { return this._pages.filter(p => p.isOpened).map(p => p.id) }
}

// events
SceneManager.OPEN = 'open'
SceneManager.OPENED = 'opened'
SceneManager.CLOSE = 'close'
SceneManager.CLOSED = 'closed'
export default SceneManager
