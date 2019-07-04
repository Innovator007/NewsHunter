import React from 'react';

class Modal extends React.Component{
  render(){
    return(
      <div className="showlist-container" style={{display:this.props.show?"block":"none"}}>
        <div className="showlist">
          <div className="showlist-header">
            {this.props.title}
          </div>
          <div className="showlist-items-container">
            { this.props.children }
          </div>
          <div className="showlist-cancel" onClick={this.props.onClose}>
            Close
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
