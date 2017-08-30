'use strict'

/**
* Represents the Preview Image
* @class
*/
class PreviewImage {
  constructor() {
    this.img = document.getElementsByClassName('preview-image')[0]
    
    this.setImage = this.setImage.bind(this)
    this.toggleBox = this.toggleBox.bind(this)
  }


  /**
  * Sets the src for the image
  * @public
  * @param {string} src
  */
  setImage(src) {
    this.img.src = src
  }


  /**
  * Toggles the class 'hide' from the preview-image element
  * @public
  */
  toggleBox() {
    this.img.classList.toggle('hide')
  }
}
