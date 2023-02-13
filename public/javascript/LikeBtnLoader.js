'use strict';

const e = React.createElement;

class LikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: false};
    }

    render(){
        if(this.state.liked){
            return 'You voted this';
        }
        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
          );
    }
}

function loadVoteBtns(){
    let voteBtns = document.querySelectorAll('.btn-container');
    if(voteBtns.length > 0){
        voteBtns.forEach(container =>{
            let root = ReactDOM.createRoot(container);
            root.render(e(LikeButton))
        })
    }
}

loadVoteBtns();