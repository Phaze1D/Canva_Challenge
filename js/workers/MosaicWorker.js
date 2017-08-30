'use strict'

/**
* Computes all the tile's averages
* @param {MessageEvent} event
*/
onmessage = function (event) {
  const TILE_WIDTH = event.data[2]
  const TILE_HEIGHT = event.data[3]

  let pixels = new Uint8ClampedArray(event.data[0])
  let dim = event.data[1]
  
  let hBoxs = Math.floor(dim.width/TILE_WIDTH)
  let vBoxs = Math.floor(dim.height/TILE_HEIGHT)

  let tiles = new Uint8ClampedArray(hBoxs * vBoxs * 4 || 1)

  for(let i = 0; i < pixels.length; i += 4){

    //Tile Index 
    let tileI = (Math.floor((i%(dim.width*4)/4)/TILE_WIDTH) +
                 hBoxs *
                 Math.floor(i/(dim.width*4)/TILE_HEIGHT)) * 4

    if(tileI < tiles.length){

      if(!tiles[tileI]){
        tiles[tileI] = 0
        tiles[tileI + 1] = 0
        tiles[tileI + 2] = 0
        tiles[tileI + 3] = 0
      }

      tiles[tileI + 3]++
      tiles[tileI] += (pixels[i] - tiles[tileI]) / tiles[tileI + 3]
      tiles[tileI + 1] += (pixels[i + 1] - tiles[tileI + 1]) / tiles[tileI + 3]
      tiles[tileI + 2] += (pixels[i + 2] - tiles[tileI + 2]) / tiles[tileI + 3]
    }
  }
  postMessage([tiles.buffer], [tiles.buffer])
}
