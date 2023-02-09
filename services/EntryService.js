var fs = require('fs');
const {getMonthName} = require('./Dates')
const entries = require('../models/Entries')
const path = require('path')

class EntryService{
    constructor(user, filename){
        this.today = new Date();
        this.user = user;
        this.filename = filename;
    }

    checkDirectory(){
        var folder = path.join(__dirname,'..',`public/entries/${this.today.getFullYear()}/${getMonthName(this.today.getMonth())}/${this.user.id}`)
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    getImgDir(){
        var imgDir = `public/entries/${this.today.getFullYear()}/${getMonthName(this.today.getMonth())}/${this.user.id}`
        return imgDir
    }

    getImgPath(){
        var relPath = `/entries/${this.today.getFullYear()}/${getMonthName(this.today.getMonth())}/${this.user.id}/${this.filename}`
        console.log(relPath);
        return relPath
    }


    static savePhoto(oldPath, newPath){
        return new Promise((resolve, reject)=>{
            fs.rename(oldPath, newPath, (err)=>{
                if(err){
                    reject(err)
                    return
                }
                resolve(true)
            })
        })
    }

}

module.exports = EntryService