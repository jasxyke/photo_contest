const mysql = require('mysql')
const pool = require('../config/DbPool')


function getFeaturedPhotos(){
    const today = new Date();
    function getLastWeek(today){
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    }

    return new Promise((resolve, reject)=>{
        const featSql = "SELECT entries.*, users.id, users.username, "+
                            "(SELECT COUNT(*) FROM votes WHERE votes.entry_id=entries.id) as likes "+
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
//
function getLeaderboards(){
    return new Promise((resolve, reject)=>{
        const curYear = new Date().getFullYear()
        const getSql = "SELECT MONTH(entries.submitted_at) as month, YEAR(entries.submitted_at) as year, COUNT(entries.id) "+
                        "FROM entries ";
                        //"GROUP BY year, month "+
                        //"ORDER BY year, month DESC"
        //const getQuery = mysql.format(getSql,[])
        pool.query(getSql, (err, result)=>{
            if(err){
                reject(err);
                return;
            }
            console.log(result);
            resolve(result);
            
        })
    })
}
module.exports = {
    getFeaturedPhotos,
    createEntry,
    getLeaderboards
}