'use strict'

const fs = use('fs')
const fse = use('fs-extra')
const path = use('path')
const gm = require('gm').subClass({imageMagick: true})
const glob = require("glob")
const natOrder = require('natural-orderby')

class ImageController {

  async index({ view }) {
    return view
      .render('Admin.images', {})
  }

  async datePhotos({request, response}){
    const folderDirectory = request.input('folderDirectory')
    const daterDate = request.input('date')
    let counter = 0
    let fileCount
    var directoryGood = false

    try {
      fs.statSync(folderDirectory, [])
      directoryGood = true
    } catch (error) {
      console.log('Invalid directory')
      return {
        err: 1,
        msg: 'Invalid directory'
      } 
    }

    if(directoryGood){
      fs.mkdir(folderDirectory + '/__backup', { recursive: true }, (err) => {
        if (err) throw err
      })

      fs.readdir(folderDirectory, (err, files) => {
        fileCount = files.length
        let fileName = 'IMG_0'
        files = natOrder.orderBy(files)
        console.log(files.length)
        fileName = fileName.concat(Math.floor((Math.random() * 100) + 10))

        for(var i = 0; i < 2; i++){
          fileName = fileName.concat(String.fromCharCode(65+Math.floor(Math.random() * 26)))
        }

        fse.emptyDir(folderDirectory + '/__backup', err => {
          if (err) return console.error(err)
        })

        files.forEach(file => {
          if(path.extname(file) == '.jpg' || path.extname(file) == '.jpeg'){
            fs.copyFileSync(folderDirectory + file, folderDirectory + '/__backup/' + file)
            this.datePhotosController(folderDirectory, file, counter, fileName, daterDate)
            .then( counter++ )
          }
        })
      })
      let test123 = new Promise((resolve, reject) => {
        if(counter >= (fileCount - 3)){
          console.log('hehe done')
          resolve('hehehehehe')
          // return response.json({
          //   err: 0,
          //   msg: 'Dated Photos'
          // })
        }
      })
      return await test123
    }
  }

  async datePhotosController(folderDirectory, file, counter, fileName, daterDate){
    console.log(folderDirectory + file)
    let size
    return new Promise((resolve, reject) => {
        gm(folderDirectory + file).size(function(err, value){
          counter++
          if(value.width >= 1000 || value.height >= 1000){
            size = value.width > value.height ? 640 : 360
            // console.log(size)
          } else {
            size = value.width
          }('saving file ' + folderDirectory + file)
          console.log(folderDirectory + fileName + '(' + counter + ').jpg')
          gm(folderDirectory + file)
          .resize(size)
          .stroke("#ffffff")
          .fill('#ff0')
          .font("/usr/share/fonts/droid/DroidSans-Bold.ttf", 16)
          .drawText(10, 13, daterDate, 'Southwest')
          .write(folderDirectory + fileName + '(' + counter + ').jpg', function (err) {
            if (!err) fs.unlink(folderDirectory + file, (err) => {
              if(!err) console.log('deleted ' + file)
            })
            if (err) console.log(err)
          })
        })
      
      resolve(1)
      // ImageMagick.convert(
      //   [
      //     source,
      //     path_to
      //   ],
      //   function (err, stdout) {
      //     if (err) {
      //       reject(err)
      //     }
      //     resolve(stdout);
      //   })
    })
  }

  async geotagPhotos({ request }){

  }
}

module.exports = ImageController
