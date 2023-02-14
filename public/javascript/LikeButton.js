'use strict';

import UnLikeButton from "./UnLikeButton";

const e = React.createElement;

class LikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: false};
    }

    render(){
        if(this.state.liked){
            return e(UnLikeButton);
        }
        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
          );
    }
}

