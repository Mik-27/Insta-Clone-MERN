import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Icon, IconButton } from '@material-ui/core'

class CommentModal extends React.Component {
    state = {
        anchorEl: false
    }

    handleOpen = () => {
        this.setState({anchorEl:true});
    };
    
    handleClose = () => {
        this.setState({anchorEl:false});
    };

    rand = () => {
        return Math.round(Math.random() * 20) - 10;
      }
      
    getModalStyle = () => {
        const top = 50 + this.rand();
        const left = 50 + this.rand();
      
        return {
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(-${top}%, -${left}%)`,
        };
    }
    
    render() {
        // const classes = useStyles();
        const commentData = this.props.data
        // getModalStyle is not a pure function, we roll the style only on the first render
        // const [modalStyle] = React.useState(getModalStyle);
        const { auth, anchorEl } = this.state
        const open = Boolean(anchorEl)
       
        // const body = (
        // <div className="paper">
        //     <h2 id="simple-modal-title">Comments</h2>
        //     {commentData.map(comment=> {
        //         return(
        //           <h6 key={comment._id}><span style={{fontWeight:"bold"}}>{comment.postedBy.name}</span> <span>{comment.text}</span></h6>
        //         )
        //     })}
        //     <p id="simple-modal-description">
        //       Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        //     </p>
        //   </div>
        // );
      
        return (
          <div>
              <IconButton onClick={this.handleOpen}>
                  <Icon className="far fa-comment changeColor"/>
              </IconButton>
            <Modal
              open={open}
              onClose={this.handleClose}
              aria-labelledby="Comments"
              aria-describedby="Comments on the post"
            >
                <div className="paper modalAlign">
                    <h4 id="simple-modal-title">Comments</h4>
                    {console.log(commentData)}
                    {commentData.map(comment=> {
                        return(
                        <h6 key={comment._id}><span style={{fontWeight:"bold"}}>{comment.postedBy.name}</span> <span>{comment.text}</span></h6>
                        )
                    })}
                </div>
            </Modal>
          </div>
        );
    }
}

export default CommentModal