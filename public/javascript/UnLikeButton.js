'use strict';

import LikeButton from "./LikeButton";
const e = React.createElement;

class UnLikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: true};
    }

    render(){
        if(!this.state.liked){
            return e(LikeButton)
        }
        return e(
            'button',
            { onClick: () => this.setState({ liked: false }) },
            'Unlike'
          );
    }
}

export default UnLikeButton;