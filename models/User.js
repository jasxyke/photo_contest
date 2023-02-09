const mysql = require('mysql')
const pool = require('../config/DbPool')
const crypt = require('bcrypt')

const saltRounds = 10;

class User{
    constructor() {
    }
    static getByUsername(username){
        return new Promise((resolve, reject)=>{
            let sqlGet = "SELECT * FROM users WHERE username=?"
            let query = mysql.format(sqlGet, [username])
            pool.query(query, (err, result)=>{
                console.log('getting user by username...');
                if(err){
                    reject(err)
                }else{
                    resolve(result[0])
                }
                
            })
        })
    }
    
    static getById(id){
        return new Promise((resolve, reject)=>{
            let sqlGet = "SELECT * FROM users WHERE id=?";
            let query = mysql.format(sqlGet, [id])
            pool.query(query, (err, result)=>{
                console.log('getting user by id...');
                if(err)reject(err)
                else resolve(result[0])
            })
        })
    }

    static addUser(user){
        return new Promise((resolve, reject)=>{
            let sqlAdd = "INSERT INTO users(username, password, lastname, firstname) "+
                        "VALUES(?,?,?,?)";
            
            crypt.hash(user.password, saltRounds, (err, hashedPass)=>{
                if(err){
                    reject(err);
                }else{
                    let query = mysql.format(sqlAdd, 
                        [user.username,
                        hashedPass,
                        user.lastname,
                        user.firstname]) 
                    pool.query(query, (err, result)=>{
                        if(err){
                            reject(err)
                            return;
                        }
                        resolve(result.insertId)
                    })
                }
            })
            
        })
    }

    static usernameExists(username){
        return new Promise((resolve, reject)=>{
            let sqlExist = "SELECT username FROM users WHERE username=?"
            let query = mysql.format(sqlExist, [username])
            pool.query(query, (err, result)=>{
                if(err) {reject(err); return}
                if(result.length > 0) resolve(true)
                else{resolve(false)}
            })
        })
        
    }
}

module.exports = User
