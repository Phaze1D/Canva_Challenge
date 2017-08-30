'use strict'


/**
* Represents the drag and drop file input component
* @class
*/
class DragDrop {
  constructor(dragDropElement) {
    this.dragDropInput = dragDropElement

    this._handleDrop = this._handleDrop.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._showError = this._showError.bind(this)
    this._initDependentDom.call(this)
    this._initHandlers.call(this)

    this._uploadFile = this._uploadFile.bind(this)

    this.resetFile = this.resetFile.bind(this)
  }


  /**
  * Clears the fileInput value
  * @public
  */
  resetFile() {
    this.fileInput.value = ''
  }


  /**
  * @abstract
  */
  _uploadFile(file) {
  }


  /**
  * Inits the DOM dependencies that are required
  * @private
  * @throws {Error} - if dependencies not found
  */
  _initDependentDom() {
    this.fileInput = this.dragDropInput.getElementsByClassName('file-input')[0]
    this.errorBox = this.dragDropInput.getElementsByClassName('error')[0]

    if( !(this.fileInput && this.errorBox) ){
      throw new Error(`
        DragDrop Component needs to have an input with class file-input
        and a element with class error
      `)
    }
  }


  /**
  * Inits the Event Handlers
  * @private
  */
  _initHandlers() {
    this.dragDropInput.addEventListener('dragover', e => e.preventDefault())
    this.dragDropInput.addEventListener('drop', this._handleDrop)
    this.dragDropInput.addEventListener('click', this._handleClick)
    this.fileInput.addEventListener('change', this._handleDrop)
  }


  /**
  * Displays error message in the error box
  * @private
  * @param {string} error - error message
  */
  _showError(error) {
    this.errorBox.textContent = error

    setTimeout(() => {
      this.errorBox.textContent = ''
    }, 4000)
  }


  /**
  * Handler for when a file is drop or selected
  * @private
  * @param {Event} event - ChangeEvent || DragEvent
  */
  _handleDrop(event) {
    event.preventDefault()
    let files
    if(event.dataTransfer){
      files = event.dataTransfer.files
    }else{
      files = this.fileInput.files
    }

    if(files.length === 1){
      this._uploadFile(files[0])
    }else{
      this._showError('Only one file at a time')
    }
  }


  /**
  * Handler for when the input box is clicked
  * @private
  * @param {ClickEvent} event
  */
  _handleClick(event) {
    this.fileInput.click(event)
  }
}
