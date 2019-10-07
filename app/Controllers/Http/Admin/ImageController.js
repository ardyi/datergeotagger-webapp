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
  
        fs.readdir(folderDirectory, (err, files) => {
          let promises = []
          fileCount = files.length

        let test123 = new Promise((resolve, reject) => {
          if(counter >= (fileCount - 3)){
            console.log('hehe done')
            resolve('hehehehehe')
          }
        })
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
              promises.push(
                this.datePhotosController(folderDirectory, file, counter, fileName, daterDate)
                .then( counter++ )
              )
            }
          })

          // for(let file of files){
          //   console.log(file)
          // }

          console.log('done!')

          // Promise.all(files.map((file) => {
          //   if(path.extname(file) == '.jpg' || path.extname(file) == '.jpeg'){
          //     fs.copyFileSync(folderDirectory + file, folderDirectory + '/__backup/' + file)
          //     this.datePhotosController(folderDirectory, file, counter, fileName, daterDate)
          //     .then( counter++ )
          //   }
          // }))
          // .then(console.log('done'))

          // if(counter >= (fileCount - 3)){
          //   console.log('hehe done')
          //   console.log(counter)
          //   console.log(fileCount)
          //   return 'whatdapak'
          // }
        })
        // let test123 = new Promise((resolve, reject) => {
        //   if(counter >= (fileCount - 3)){
        //     console.log('hehe done')
        //     resolve('hehehehehe')
        //     // return response.json({
        //     //   err: 0,
        //     //   msg: 'Dated Photos'
        //     // })
        //   }
        // })
        // return await test123

          // return await Promise.all(promises)
  }

  async datePhotosController(folderDirectory, file, counter, fileName, daterDate){
    // console.log(folderDirectory + file)
    let size
    return new Promise((resolve, reject) => {
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
            if (!err) fs.unlink(folderDirectory + file, (err) => {
              resolve(1)
              if(!err) console.log('deleted ' + file)
            })
            if (err) console.log(err)
          })
        })
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
    // let counter = 0
    googleMapsClient.geocode({address: request.input('propertyLocation')})
    .asPromise()
    .then((response) => {
      console.log((response.json.results[0]).geometry);
    })
    .catch((err) => {
      return {
        err
      }
    })

    var files = fs.readdirSync('/home/ardyi/Desktop/Dater/')
    files = natOrder.orderBy(files)
  }
}

module.exports = ImageController




// var files = fs.readdirSync('/home/ardyi/Desktop/Dater/')
// files = natOrder.orderBy(files)

// // function to geotag
// const geotagPhoto = async (file) => {
//   setTimeout(() => {

//     console.log('geotagging ' + file)
//     return {
//       status: 'success'
//     }
//   }, 500)
// }

// // Iterates all photos and return status.
// const fetchFileInfo = async (testFiles) => {
//   const photos = testFiles.map((file) => {
//     // const url = `https://api.github.com/users/${name}`
//     return geotagPhoto(file) // Async function that fetches the user info.
//      .then((a) => {
//       counter++
//       return a // Returns the user info.
//       })
//   })
//   return Promise.all(photos) // Waiting for all the requests to get resolved.
// }

// fetchFileInfo(files)
//   .then(a => console.log(counter))

// // return files



    // promises = durations.map((duration) => {
    //   return timeOut(duration).catch(e => e) // Handling the error for each promise.
    // })
    
    // Promise.all(promises)
    //   .then(response => console.log(response)) // ["Completed in 1000", "Rejected in 2000", "Completed in 3000"]
    //   .catch(error => console.log(`Error in executing ${error}`))
    // view raw

    // // A simple promise that resolves after a given time
    // const geotag = (t) => {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve(`Completed in ${t}`)
    //     }, 500)
    //   })
    // }
    
    // var files = fs.readdirSync('/home/ardyi/Desktop/Dater/')
    // files = natOrder.orderBy(files)

    // const promises = []

    // files.map((file) => {
    //   // In the below line, two things happen.
    //   // 1. We are calling the async function (timeout()). So at this point the async function has started and enters the 'pending' state.
    //   // 2. We are pushing the pending promise to an array.
    //   promises.push(geotag(file)) 
    // })

    // console.log(promises) // [ Promise { "pending" }, Promise { "pending" }, Promise { "pending" } ]

    // // We are passing an array of pending promises to Promise.all
    // // Promise.all will wait till all the promises get resolves and then the same gets resolved.
    // return Promise.all(promises)
    // .then(response => console.log(response)) // ["Completed in 1000", "Completed in 2000", "Completed in 3000"