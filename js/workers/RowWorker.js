'use strict'

let hexCache
let row
let tiles
let hBoxs

/**
* Requests all the svg elements for one row from the server
* @param {MessageEvent} event
*/
onmessage = function(event) {
  if(event.data.length === 2){
    hexCache = {}
    row = 0
    tiles = new Uint8ClampedArray(event.data[0])
    hBoxs = event.data[1] * 4
  }

  let start = row * hBoxs
  if(start >= tiles.length){
    tiles = []
    hexCache = {}
    close()
  }

  requestColors(tiles, start)
}


/**
* Loops through one row of the tiles array
* @param {Uint8ClampedArray} tiles 
* @param {number} start - the row to start at 
*/
function requestColors(tiles, start) {
  let promises = []
  for(let i = start; i < start + hBoxs; i += 4){    
    let hex = toHex(tiles[i]) + toHex(tiles[i + 1]) + toHex(tiles[i + 2])
    if(hexCache[hex]){
      promises.push(hexCache[hex])
    }else{
      promises.push(createFetch(hex))
    }
  }

  Promise.all(promises)
  .then(handlePromises)
}


/**
* Handler for when all the promises have finished 
* @param {string[]} files
*/
function handlePromises(files) {
  files.push(row)
  postMessage(files)
  row++
}


/**
* Creates a fetch request and adds it to the cache
* @param {string} color - hex color
* @return {Promise<Response>}
*/
function createFetch(color) {
  let roptions = {method: 'GET'}
  let request = new Request(`/color/${color}`, roptions)

  hexCache[color] = fetch(request)
  .then(handleTileFetch)
  .then(fileReaderPromise)

  return hexCache[color]
}


/**
* Handler for when the fetch request finishes
* @param {Response} res
* @return {Promise<Blob>}
*/
function handleTileFetch(res) {
  return res.blob()
}


/**
* Converts blob to data url
* @param {Blob} blob
* @return {Promise<string>}
*/
function fileReaderPromise(blob) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()
    reader.addEventListener('loadend', handleFileReader.bind(this, resolve, reader))
    reader.readAsDataURL(blob)
  })
}


/**
* Handles the file reader on loadend event
* @param {Promise.resolve} resolve
* @param {FileReader} reader
* @return {Promise<string>}
*/
function handleFileReader(resolve, reader) {
  return resolve(reader.result)
}


/**
* Converts number into hexadecimal
* @param {number} col - 0..255
* @return {string}
*/
function toHex(col) {
  let hex = col.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
