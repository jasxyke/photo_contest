'use strict'

const e = React.createElement;

async function likeEntry(entry_id){
    return new Promise(async (resolve, reject)=>{
        try{
            let url = `entries/vote/${entry_id}`
            console.log('voting for entry id: ', entry_id);
            let response = await fetch(url,{
                method: 'POST'
            });
            if(response.status === 200){
                if(await response.text() === 'FAILED'){
                   alert('error liking entry') 
                }
                var likeCounter = document.getElementById(`counter-${entry_id}`)
                likeCounter.innerHTML = parseInt(likeCounter.innerHTML) + 1 
                resolve(true)
            }
        }catch(e){
            console.log(e);
        }
    })
}

async function unlikeEntry(entry_id){
    return new Promise(async (resolve, reject)=>{
        try{
            let url = `entries/unvote/${entry_id}`
            console.log('unvoting for entry id: ', entry_id);
            let response = await fetch(url,{
                method: 'DELETE'
            });
            console.log('status code: ',response.status);
            if(response.status === 200){
                if(await response.text() === 'FAILED'){
                    alert('ERROR LIKING POST');
                }
                var likeCounter = document.getElementById(`counter-${entry_id}`)
                likeCounter.innerHTML = parseInt(likeCounter.innerHTML) - 1 
                resolve(true)
            }
        }catch(e){
            console.log(e);
        }
    })
    
}

class LikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: false};
    }

    render(){
        if(this.state.liked){
            return e(UnLikeButton, {name: this.props.name});
        }
        return e(
            'button',
            { onClick: async () => {
                await likeEntry(this.props.name);
                this.setState({ liked: true });
                console.log('LIKED ENTRY: ',this.props.name);
            },
                className: "btn-home-up"},
            'Like Photo'
          );
    }
}

class UnLikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: true};
    }

    render(){
        if(!this.state.liked){
            return e(LikeButton, {name: this.props.name})
        }
        return e(
            'button',
            { onClick: async () => {
                await unlikeEntry(this.props.name);
                this.setState({ liked: false })
                console.log('UNLIKED ENTRY: ',this.props.name);
                
            },
                className: "btn-home-up"},
            'Unlike Photo'
          );
    }
}

function getUserLikes(){
    return new Promise(async (resolve, reject)=>{
        let url = '/entries/likes';
        console.log('gettings user entry likes');
        let response = await fetch(url);
        console.log(response.status);
        if(response.status === 200){
        var likes = await response.json();
        console.log('user likes: ',likes);
        if(likes.length > 0 ){
            resolve(likes)
        }else{
            resolve([])
        }
     }
    })
     
}

async function loadVoteBtns(){
    try{
        var userLikes = await getUserLikes();
        console.log('user likes from load: ',userLikes);
        let voteBtns = document.querySelectorAll('.btn-container');
        if(voteBtns.length > 0){
            voteBtns.forEach(container =>{
                console.log('Entry id from btn container: ');
                let root = ReactDOM.createRoot(container);
                let entry_id = container.getAttribute('name');
                console.log('entry id: ', entry_id);
                if(userLikes.includes(parseInt(entry_id))){
                    console.log('unlike button');
                    root.render(e(UnLikeButton, 
                    {name: entry_id}))
                }else{

                    root.render(e(LikeButton, 
                        {name: entry_id}))
                }
            })
    }
}catch(e){
    alert(e)
}
    
}

loadVoteBtns();