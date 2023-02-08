var fs = require('fs');
const {getMonthName} = require('./Dates')
const entries = require('../models/Entries')
const path = require('path')

class EntryService{
    constructor(){}

    static checkDirectory(user_id){
        this.entry = entry;
        this.today = new Date();
        var folder = `..entries/${today.getFullYear}/${getMonthName(today.getMonth())}/${user_id}`
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    static getFilePath(user, filename){
        var today = new Date()
        var relPath = `entries/${today.getFullYear}/${getMonthName(today.getMonth())}/${user.id}/${filename}`
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