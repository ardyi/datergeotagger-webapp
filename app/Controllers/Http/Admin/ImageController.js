'use strict'

const fs = use('fs')
const fse = use('fs-extra')
const path = use('path')
const gm = require('gm').subClass({imageMagick: true})

class ImageController {

  async index({ view }) {
    return view
      .render('Admin.images', {})
  }

  async datePhotos({request}){
    const folderDirectory = request.input('folderDirectory')
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

    //   var targetFiles = files.filter(function(file) {
    //     return path.extname(file).toLowerCase() === EXTENSION;
    // })

      fs.readdir(folderDirectory, (err, files) => {
        let counter = 0
        let size
        let fileName = 'IMG_0'

        fileName = fileName.concat(Math.floor((Math.random() * 100) + 10))

        for(var i = 0; i < 2; i++){
          fileName = fileName.concat(String.fromCharCode(65+Math.floor(Math.random() * 26)))
          this.datePhotos()
        }

        console.log(fileName)
        fse.emptyDir(folderDirectory + '/__backup', err => {
          if (err) return console.error(err)
        })

        files.forEach(file => {
          if(path.extname(file) == '.jpg' || path.extname(file) == '.jpeg'){
            fs.copyFileSync(folderDirectory + file, folderDirectory + '/__backup/' + file)
            console.log(counter)
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
              .drawText(10, 13, request.input('date'), 'Southwest')
              .write(folderDirectory + fileName + '(' + counter + ').jpg', function (err) {
                if (!err) fs.unlink(folderDirectory + file, (err) => {
                  if(!err) console.log('deleted ' + file)
                })
                if (err) console.log(err)
              })
            })
          }
        });
      });
    }

    // gm('/home/ardyi/Desktop/Dater/greeter.jpg')
    //   // .stroke("#ffffff")
    //   .fill('#ff0')
    //   .font("/usr/share/fonts/TTF/VeraBd.ttf", 38)
    //   .drawText(30, 40, "10/05/19", 'Southwest')
    //   .write("/home/ardyi/Desktop/Dater/greetertest.jpg", function (err) {
    //     if (!err) console.log('done')
    //     if (err) console.log(err)
    //   })
  }

  datePhotos(){
    console.log('test')
  }

  async geotagPhotos({ request }){

  }
}

module.exports = ImageController
