'use strict'

/**
* Util that handles when a user uploads a file
* @class
*/
class Uploader {
  constructor() {
    this.inputBox = document.getElementsByClassName('input-box')[0]
    this.resetB = document.getElementById('reset-button')
    this.minB = document.getElementById('min-button')

    this._handleLoaded = this._handleLoaded.bind(this)
    this._handleResetClick = this._handleResetClick.bind(this)
    this._handleMinClick = this._handleMinClick.bind(this)
    this._initHandlers.call(this)

    this.onRequestUpload = this.onRequestUpload.bind(this)

    this.imageInput = new ImageInput(this.onRequestUpload)
    this.previewImage = new PreviewImage()
    this.mosaicer = new Mosaicer()
  }


  /**
  * Inits the Event Handlers
  * @private
  */
  _initHandlers() {
    this.resetB.addEventListener('click', this._handleResetClick)
    this.minB.addEventListener('click', this._handleMinClick)
  }


  /**
  * Called when a file is uploaded
  * @callback
  * @param {File} file
  */
  onRequestUpload(file) {
    this.imageInput.toggleBox()
    let reader = new FileReader();
    reader.onload = this._handleLoaded
    reader.readAsDataURL(file);
  }


  /**
  * Handler for when the image has loaded
  * @private
  * @param {ProgressEvent} event
  */
  _handleLoaded(event) {
    this.previewImage.setImage(event.target.result)
    this.previewImage.toggleBox()
    this.mosaicer.draw(event.target.result)
  }


  /**
  * Handler for when the reset button is clicked
  * @private
  * @param {ClickEvent} event
  */
  _handleResetClick(event) {
    if(!this.previewImage.img.classList.contains('hide')){
      this.imageInput.toggleBox()
      this.imageInput.resetFile()
      this.previewImage.toggleBox()
      this.previewImage.setImage('#')
      this.mosaicer.resetCanvas()
    }
  }


  /**
  * Handler for when the min button is clicked
  * @private
  * @param {ClickEvent} event
  */
  _handleMinClick(event) {
    this.inputBox.classList.toggle('show')
  }
}
