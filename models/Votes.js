const mysql = require('mysql')
const pool = require('../config/DbPool')

function isExist(user_id, entry_id){
    return new Promise((resolve, reject)=>{
        let existSql = "SELECT 1 FROM votes WHERE user_id=? AND entry_id=?"
        let existQuery = mysql.format(existSql, [user_id, entry_id])
        pool.query(existQuery, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(`for user: ${user_id}, entry_id: ${entry_id}`);
            console.log('user exist: ',result.length > 0 );
            resolve(result.length > 0 )
        })
    })
}

async function voteEntry(user_id, entry_id){
    return new Promise(async (resolve, reject)=>{
        try{
            if (await isExist(user_id, entry_id)){
                resolve(0);
                return;
            }
            console.log(`USER: ${user_id} VOTING: ${entry_id}`);
            let insertSql = "INSERT INTO votes(user_id, entry_id) VALUES(?,?)"
            let query = mysql.format(insertSql, [user_id, entry_id])
            pool.query(query, (err, result)=>{
                if(err) {
                    reject(err);
                    return;
                }
                console.log('voting entry... ', result.affectedRows);
                resolve(result.affectedRows)
                return;
            })
        }catch(e){
            reject(e)
        }
        
    })
}
    
    

async function unVoteEntry(user_id, entry_id){ 
    return new Promise(async (resolve, reject)=>{
        try{
            if(await isExist(user_id, entry_id)){
                console.log(`USER: ${user_id} UNVOTING: ${entry_id}`);
                let deleteSql = "DELETE FROM votes WHERE user_id=? AND entry_id=?"
                let delQuery = mysql.format(deleteSql, [user_id, entry_id])
                pool.query(delQuery, (err, result)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    console.log('Unvoting entry... 1',result.affectedRows);
                    resolve(result.affectedRows)
                    return;
                })
            }
        }catch(e){
            reject(e)
        }
        
    })
    
    
}

function getVotes(userId){
    return new Promise((resolve, reject)=>{
        let getSql = "SELECT * FROM votes WHERE user_id=?";
        let getQuery = mysql.format(getSql, [userId])
        pool.query(getQuery, (err, result)=>{
            if(err){
                console.log('user likes: ',result);
                reject(err);
                return;
            }
            console.log('user likes: ',result);
            resolve(result)
        })
    })
    
}

module.exports ={
    voteEntry,
    unVoteEntry,
    getVotes
}