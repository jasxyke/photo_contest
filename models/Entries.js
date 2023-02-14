const mysql = require('mysql')
const pool = require('../config/DbPool')
const dates = require('../services/Dates')

function getFeaturedPhotos(){
    const today = new Date();
    function getLastWeek(today){
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    } 

    return new Promise((resolve, reject)=>{
        const featSql = "SELECT entries.*, users.username, "+
                            "(SELECT COUNT(id) FROM votes WHERE votes.entry_id=entries.id) as likes "+
                            "FROM entries INNER JOIN users ON entries.artist_id=users.id " +
                            "WHERE entries.submitted_at BETWEEN ? AND ? "+
                            "ORDER BY likes DESC "+
                            "LIMIT 3";
        const query = mysql.format(featSql, [getLastWeek(today), today])
        pool.query(query,(err, result)=>{
            if(err) throw err
            console.log(result);
            console.log(query);
            resolve(result);
        })
    })
}

function getLoggedFeaturedPhotos(userId){
    const today = new Date();
    function getLastWeek(today){
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    } 

    return new Promise((resolve, reject)=>{
        const featSql = "SELECT entries.*, users.username, "+
                            "(SELECT COUNT(votes.id) FROM votes WHERE votes.user_id=? AND votes.entry_id=entries.id) as liked, "+
                            "(SELECT COUNT(id) FROM votes WHERE votes.entry_id=entries.id) as likes "+
                            "FROM entries INNER JOIN users ON entries.artist_id=users.id " +
                            "WHERE entries.submitted_at BETWEEN ? AND ? "+
                            "ORDER BY likes DESC "+
                            "LIMIT 3";
        const query = mysql.format(userId, featSql, [getLastWeek(today), today])
        console.log(query);
        pool.query(query,(err, result)=>{
            if(err){
                console.log(err);
                reject(err)
                return
            }
            console.log(result);
            console.log(query);
            resolve(result);
        })
    })
}

function createEntry(entry){
    return new Promise((resolve, reject)=>{
        const sql = "INSERT INTO entries(title, caption, file_path, artist_id) "+
                    "VALUES(?, ?, ?, ?)";
        const query = mysql.format(sql, 
            [entry.title, entry.caption, entry.filePath, entry.artist_id])
        pool.query(query,(err, result)=>{
            if(err) {reject(err); return}
            resolve(result)
        })
    })
}

function getEntries({orderBy}){
    return new Promise((resolve, reject)=>{
        let date = new Date();
        const getSql = "SELECT entries.*, users.username, "+
        "(SELECT COUNT(id) FROM votes WHERE entries.id=votes.entry_id) AS likes "+
        "FROM entries INNER JOIN users ON entries.artist_id=users.id "+
        "WHERE entries.submitted_at BETWEEN ? AND ? " +
        "ORDER BY entries.submitted_at ASC";
        const getQuery = mysql.format(getSql,
             [dates.getFirstDay(date), dates.getLastDay(date)] )
        pool.query(getQuery, (err, result)=>{
            if(err){
                reject(err);
                return;
            }
            console.log('entries/all: ',result);
            resolve(result)
        })
    })
}

function getEntryById(entry_id){
    return new Promise((resolve, reject)=>{
        const getSql = "SELECT entries.*, users.username, "+
                        "(SELECT COUNT(id) FROM votes WHERE entries.id=votes.entry_id) AS likes "+
                        "FROM entries INNER JOIN users ON entries.artist_id=users.id "+
                        "WHERE entries.id=?"
        const getQuery = mysql.format(getSql, [entry_id])
        pool.query(getQuery, (err, result)=>{
            if(err){
                reject(err);
                return;
            }
            console.log(result[0]);
            resolve(result[0]);
        })
    })
}

module.exports = {
    getFeaturedPhotos,
    createEntry,
    getEntries,
    getLoggedFeaturedPhotos,
    getEntryById
}