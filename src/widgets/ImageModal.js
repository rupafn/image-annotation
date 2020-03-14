import React from 'react';
import {Button,Modal} from 'react-bootstrap';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import DropdownButton from './dropdownButton';
// const firebase = require('firebase')
// const cropper = React.createRef(null);

class ImageModal extends React.Component{
  constructor(props) {
      super(props);
      this.imagePreviewCanvasRef = React.createRef()
      this.state ={
        previewOfImg:'',
        folders:[],
        currentFolder:'',
        base64:''
            }


  }

  setCurrentFolder(folder){
    this.setState({
      currentFolder:folder
    })
  }


  saveImage() {
    this.props.handleClose(this.state.currentFolder,this.state.base64)
  }


  componentDidMount(){
      // this.getFolders()

  }


  handleClose(){
    this.saveImage()

  }

//save cropped state in base64
  _crop(e){
    let base64 = this.refs.cropper.getCroppedCanvas().toDataURL()
    this.setState({
      base64
    })

  }

  render() {
    console.log('currentSrc');
    console.log(this.props.currentSrc);
    return (

      <Modal show={this.props.show} onHide={this.props.handleJustClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cropper
            crossOrigin='Anonymous'
            ref='cropper'
            src={this.props.currentSrc}
            style={{height: 300}}
            aspectRatio={16 / 9}
            guides={false}
            crop={this._crop.bind(this)} />
            <p>Drag to crop image</p>
        </Modal.Body>
        <Modal.Footer>

          <DropdownButton
            id='btn-color'
            currentFolder={this.state.currentFolder}
            folders={this.props.folders}
            setCurrentFolder={this.setCurrentFolder.bind(this)}/>

          <Button variant="secondary" onClick={this.props.handleJustClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose.bind(this)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


    );
  }
}

export default ImageModal;
