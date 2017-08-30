'use strict'

/**
* Util that handles all the mosaic logic
* @class
*/
class Mosaicer {
  constructor() {
    this.wrapper = document.getElementsByClassName('wrapper')[0]
    this.canvas = document.getElementById('canvas')
    this.offcanvas = document.getElementById('offcanvas')
    this.octx = offcanvas.getContext('2d')
    this.ctx = canvas.getContext('2d')

    this._handleMainWorker = this._handleMainWorker.bind(this)
    this._handleRowWorker = this._handleRowWorker.bind(this)
    this._handleLoaded = this._handleLoaded.bind(this)
    this._setupCanvas = this._setupCanvas.bind(this)
    this._createWorkers = this._createWorkers.bind(this)
    this._createImageCache = this._createImageCache.bind(this)
    this._startMain = this._startMain.bind(this)

    this.draw = this.draw.bind(this)
    this.resetCanvas = this.resetCanvas.bind(this)

    this.image = new Image()
    this.image.onload = this._handleLoaded

    this.imageCache = []
  }


  /**
  * Terminates workers and resets the canvas
  * @public
  */
  resetCanvas() {
    if(this.rowWorker && this.mainWorker){
      this.rowWorker.terminate()
      this.mainWorker.terminate()
    }
    this.imageCache = []
    this.octx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.width = ''
    this.canvas.style.height = ''
    this.canvas.width = ''
    this.canvas.height = ''
    this.wrapper.style.display = 'flex'
  }


  /**
  * Set the src for the image to be used
  * @public
  */
  draw(src) {
    this.image.src = src
  }


  /**
  * Sets up the canvas and wrapper
  * @private
  */
  _setupCanvas(){
    let width = Math.floor(this.image.width/TILE_WIDTH) * TILE_WIDTH
    let height = Math.floor(this.image.height/TILE_HEIGHT) * TILE_HEIGHT
    height = height > 0 ? height : TILE_HEIGHT
    width = width > 0 ? width : TILE_WIDTH

    this.offcanvas.style.width = width + 'px'
    this.offcanvas.style.height = height + 'px'
    this.offcanvas.width = width
    this.offcanvas.height = height

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
    this.canvas.width = width
    this.canvas.height = height

    if(this.canvas.width > window.innerWidth ){
      this.wrapper.style.display = 'block'
    }
  }


  /**
  * Creates the row image cache
  * @private
  */
  _createImageCache(){
    for (let i = 0; i < this.canvas.width/TILE_WIDTH; i++) {
      this.imageCache.push(new Image())
    }
  }


  /**
  * Creates the WebWorkers
  * @private
  */
  _createWorkers() {
    this.mainWorker = new Worker('js/workers/MosaicWorker.js')
    this.mainWorker.onmessage = this._handleMainWorker
    this.rowWorker = new Worker('js/workers/RowWorker.js')
    this.rowWorker.onmessage = this._handleRowWorker
  }


  /**
  * Gets the image data and starts the main worker
  * @private
  */
  _startMain() {
    this.octx.drawImage(this.image, 0, 0)
    let pixels = this.octx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
    this.mainWorker.postMessage(
      [
        pixels.buffer, 
        {width: this.canvas.width, height: this.canvas.height}, 
        TILE_WIDTH, TILE_HEIGHT
      ], 
      [pixels.buffer]
    )
  }


  /**
  * Handler for when the main image has loaded
  * @private
  * @param {ProgressEvent} event
  */
  _handleLoaded(event) {
    this.startTime = Date.now()

    this._setupCanvas()
    this._createWorkers()
    this._createImageCache()
    this._startMain()
  }


  /**
  * Handler for when main worker postMessage
  * @private
  * @param {MessageEvent} event
  */
  _handleMainWorker(event){
    this.rowWorker.postMessage([event.data[0], this.canvas.width/TILE_WIDTH])
  }


  /**
  * Handler for when row worker postMessage
  * @private
  * @param {MessageEvent} event
  */
  _handleRowWorker(event) {
    let row = event.data[event.data.length - 1]
    for (let col = 0; col < event.data.length - 1; col++) {
      this.imageCache[col].src = event.data[col]
      this.imageCache[col].onload = this._handleTileReady.bind(this, col, row)
    }

    this.rowWorker.postMessage([])

    if(row + 1 >= Math.floor(this.canvas.height/TILE_HEIGHT)){
      this.imageCache = []
      console.log(Date.now() - this.startTime)
    }
  }


  /**
  * Handler for when tile image is ready
  * @private
  * @param {ProgressEvent} event
  */
  _handleTileReady(col, row, event) {
    this.ctx.drawImage(event.target, TILE_WIDTH*col, TILE_HEIGHT*row, TILE_WIDTH, TILE_HEIGHT)
  }
}
