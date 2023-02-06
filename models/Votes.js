const mysql = require('mysql')
const pool = require('../config/DbPool')

function voteEntry(entry_id, user_id, callback){
    let insertSql = "INSERT INTO likes(user_id, entry_id) VALUES(?,?)"
    let query = mysql.format(insertSql, [user_id, entry_id])
    pool.query(query, (err, result)=>{
        if(err) {
            callback(err, null);
            return;
        }
        console.log('voting entry...');
        callback(null, true)
        return
    })
}

function unVoteEntry(user_id, entry_id, callback){
    let deleteSql = "DELETE FROM votes WHERE user_id=? AND entry_id=?"
    let delQuery = mysql.format(deleteSql, [user_id, entry_id])
    pool.query(delQuery, (err, result)=>{
        if(err){
            callback(err, null);
            return;
        }
        console.log('Unvoting entry...');
        callback(null, true)
    })
}

module.exports ={
    voteEntry,
    unVoteEntry
}