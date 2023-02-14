const mysql = require('mysql');
const pool = require('../config/DbPool');
const dates = require('../services/Dates')

//get leaderboards by its month whether the current month or the
//previous month using if else statements
function getLeaderboards(month){
    let date = new Date()
    if(month === 'this'){
        var firstDay = dates.getFirstDay(date)
        var lastDay = dates.getLastDay(date)
    }else if(month === 'prev'){
        date.setMonth(date.getMonth()-1)
        var firstDay = dates.getFirstDay(date);
        var lastDay = dates.getLastDay(date)
    }else{
        throw 'This should not happen'
    }
    return new Promise((resolve, reject) =>{
        const  getSql = "SELECT entries.id, entries.title, users.lastname, " + 
                "users.firstname, users.username, entries.submitted_at, "+
                "(SELECT COUNT(id) FROM votes WHERE votes.entry_id=entries.id) AS likes "+
                "FROM entries INNER JOIN users ON entries.artist_id=users.id "+
                "WHERE entries.submitted_at BETWEEN ? AND ? "+
                "ORDER BY likes DESC "+
                "LIMIT 10";
        const getQuery = mysql.format(getSql, [firstDay, lastDay]);
        pool.query(getQuery, (err, result) =>{
            if(err){reject(err); return;}
            resolve(result);
        })
    })
}

module.exports = {
    getLeaderboards
}
