'use strict'

const fs = use('fs')
const fse = use('fs-extra')
const path = use('path')
const gm = require('gm').subClass({imageMagick: true})
// const glob = require("glob")
const natOrder = require('natural-orderby')
const piexif = require('piexifjs')

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyC6NJ-uxbbg71jT7OAW17CLnv7K1yop3FE',
  Promise: Promise
});

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

    fs.mkdir(folderDirectory + '/__backup', { recursive: true }, (err) => {
      if (err) throw err
    })

    var files = fs.readdirSync(folderDirectory)
    files = natOrder.orderBy(files)

    let fileName = 'IMG_0'
    fileName = fileName.concat(Math.floor((Math.random() * 100) + 10))

    for(var i = 0; i < 2; i++){
      fileName = fileName.concat(String.fromCharCode(65+Math.floor(Math.random() * 26)))
    }

    fse.emptyDir(folderDirectory + '/__backup', err => {
      if (err) return console.error(err)
    })
    
    let size

    return Promise.all(files.map(async(file) => {
      if(path.extname(file) == '.jpg' || path.extname(file) == '.jpeg'){
        fs.copyFileSync(folderDirectory + file, folderDirectory + '/__backup/' + file)
        // fs.copyFile(folderDirectory + file, folderDirectory + '/__backup/' + file, (err) => {
        //   if (err) console.log(err)
        // })
        gm(folderDirectory + file).size(function(err, value){
          counter++
          if(value.width >= 1000 || value.height >= 1000){
            size = value.width > value.height ? 640 : 360
            // console.log(size)
          } else {
            size = value.width
          }//('saving file ' + folderDirectory + file)
          console.log(folderDirectory + fileName + '(' + counter + ').jpg')
          gm(folderDirectory + file)
          .resize(size)
          .stroke("#ffffff")
          .fill('#ff0')
          .font("/usr/share/fonts/droid/DroidSans-Bold.ttf", 16)
          .drawText(10, 13, daterDate, 'Southwest')
          .write(folderDirectory + fileName + '(' + counter + ').jpg', function (err) {
            fs.unlinkSync(folderDirectory + file)
            if (!err) fs.unlink(folderDirectory + file, (err) => {
              resolve('deleted ' + file)
              if(!err) console.log('deleted ' + file)
            })
            if (err) console.log(err)
          })
        })
      }
    }))
  }

  async geotagPhotos({ request }){
    // let counter = 0
    let folderDirectory = request.input('folderDirectory')
    let locLatitude
    let locLongitude
    let latitudeRef
    let longitudeRef

    let googleLocation = await googleMapsClient.geocode({address: request.input('propertyLocation')})
    .asPromise()
    .then((response) => {
      return (response.json.results[0]).geometry
    })
    .catch((err) => {
      return {
        err
      }
    })

    locLatitude = googleLocation.location.lat
    locLongitude = googleLocation.location.lng

    rLatitude = piexif.GPSHelper.degToDmsRational(locLatitude)
    rLongitude = piexif.GPSHelper.degToDmsRational(locLongitude)
    latitudeRef = locLatitude >= 0 ? 'N' : 'S'
    longitudeRef = locLongitude >= 0 ? 'E' : 'W'

    var exif = {}
    var gps = {}

    gps[piexif.GPSIFD.GPSLatitudeRef] = latitudeRef
    gps[piexif.GPSIFD.GPSLatitude] = rLatitude
    gps[piexif.GPSIFD.GPSLongitudeRef] = longitudeRef
    gps[piexif.GPSIFD.GPSLongitude] = rLongitude
    exif[piexif.ExifIFD.DateTimeOriginal] = "2010:10:10 10:10:10"

    var files = fs.readdirSync(folderDirectory)
    files = natOrder.orderBy(files)

    return Promise.all(files.map(async(file) => {
      if(path.extname(file) == '.jpg' || path.extname(file) == '.jpeg'){
      var jpeg = fs.readFileSync(folderDirectory + file)
      var data = jpeg.toString("binary")
      var exifObj = piexif.load(data)

      // console.log(exifObj)
      }
    }))

    var jpeg = fs.readFileSync(filename1);
    var data = jpeg.toString("binary");
    var exifObj = piexif.load(data);
    exifObj["GPS"][piexif.GPSIFD.GPSVersionID] = [7, 7, 7, 7];
    exifObj["GPS"][piexif.GPSIFD.GPSDateStamp] = "1999:99:99 99:99:99";
    var exifbytes = piexif.dump(exifObj);
    var newData = piexif.insert(exifbytes, data);
    var newJpeg = new Buffer(newData, "binary");
    fs.writeFileSync(filename2, newJpeg);



    // var files = fs.readdirSync('/home/ardyi/Desktop/Dater/')
    // files = natOrder.orderBy(files)

    // return Promise.all(files.map(async(file) => {

    // }))
  }
}

module.exports = ImageController