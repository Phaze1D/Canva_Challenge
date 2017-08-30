'use strict'

/**
* Represents the Image Drag Drop input
* @class
* @extends {DragDrop}
*/
class ImageInput extends DragDrop {
  constructor(onRequestUpload) {
    super(document.getElementsByClassName('image-input')[0])

    this.onRequestUpload = onRequestUpload
    this.toggleBox = this.toggleBox.bind(this)
    console.log()
  }


  /**
  * Toggles the class 'hide' from the image-input element
  * @public
  */
  toggleBox() {
    this.dragDropInput.classList.toggle('hide')
  }


  /**
  * Checks if file is image and calls onRequestUpload
  * @private
  * @param {File} file - image to be uploaded
  */
  _uploadFile(file) {
    if((/\.(jpg|jpeg|png)$/i).test(file.name)){
      this.onRequestUpload(file)
    }else {
      this._showError('File must be jpg jpeg or png')
    }
  }
}
