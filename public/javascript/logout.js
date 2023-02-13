async function logout(){
    try{
        let response = await fetch('/logout',{
            method: 'POST',
        });
    }catch(e){
        window.alert('ERROR LOGGING OUT');
    }
}