const validator = require('validator');

module.exports = class StudentValidator{
    constructor() {
    }
    //check if the field is empty and returns a trimmed string on both sides for whitespaces
    static validate(field, name){
        if(validator.isEmpty(field)) throw `The ${name} field cannot be left empty`;
        return validator.trim(field)
    }
    /*
    static validateRefNum(refnum){
        refnum = this.validate(refnum, 'reference number')
        if(!validator.matches(refnum, /\d{4}-\d{4}-\d{4}/)){
            throw 'Invalid reference number format';
        } 
        if(!validator.isLength(refnum, {min: 14, max: 14})){
            throw 'Invalid length of characters for reference number';
        }
        refnum = refnum.replace(/-/g,'')
        return refnum;
    }
    */

    static validateUsername(username, min=6, max=20){
        username = this.validate(username, 'username');
        if(!validator.isAlphanumeric(username)) {
            throw 'Username can only contain letters, numbers, and the _ character';
        }
        if(username.length < min){
            throw `Username must contain atleast ${min} characters`;
        }
        if(username.length > max){
            throw `Username must contain a maximum of ${max} characters`;
        }
        return username;
    }

    static validatePassword(password, confirm_pass=null){
        password = this.validate(password, "password");
        if(!validator.isStrongPassword(password, {minUppercase: 0, minSymbols: 0})) throw 'Password is weak';
        if(confirm_pass === null) return password;
        if(password !== confirm_pass) throw 'Passwords do not match';
        return password;
    }

    static validateName(name, part){
        name =  this.validate(name, part);
        name = name.toLowerCase().charAt(0).toUpperCase() + name.slice(1);
        if(!validator.isAlpha(name)) throw `${part} field must contain only letters`;
        if(name.length < 3) throw 'Name must contain alteast 3 characters';
        return name
    }

    static validateEmail(email){
        email = this.validate(email, 'email');
        if(!validator.isEmail(email)) throw 'Invalid email';
        return email
    }

    static validateYearAdmitted(year){
        if(year.length === 0) throw 'Year admitted cannot be left empty';
        return year
    }

    static validateCourse(course){
        let courses = ['DCVET', 'DCET', 'DEET', 'DECET', 'DIT', 'DMET', 'DOMT',
                        'DRET', 'DICT'];
        if(!courses.includes(course)) throw 'Course not in list';
        return course
    }

}