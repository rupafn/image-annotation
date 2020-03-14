import React from 'react';
import {Button,Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const firebase = require('firebase')

class ImageContainer extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        previewSrc: 'hello',
        name:''
      }

  }

  onChangeHandler(e) {
     this.props.retrievingContent()
     const self = this
     let file = e.target.files[0]
     console.log(file);
     let reader = new FileReader();
     //
     reader.addEventListener("load", () => {
       var image = new Image();
       image.height = 100;
       image.title = file.name;
       image.src = reader.result;
       self.setState({
         previewSrc: reader.result,
         name:file.name
       })
       this.makeSubmit(this)
     }, false);
     if(file){
       reader.readAsDataURL(file);
     }


  }

  makeSubmit(e) {
    let time = new Date().getTime();
    let ext = this.state.name.split('.').pop()
    const storageRef = firebase.storage().ref();
    const newImageRef = storageRef.child('images/'+time+'.'+ext);

    let snapshot = this.props.snapshot;
    let obj = snapshot[this.props.checkedFolder]
    if(obj===undefined){
      obj={}
    }
    obj[time] = ext
    newImageRef.putString(this.state.previewSrc, 'data_url').then((res) => {
      console.log(obj);

      var database = firebase.database();
      database.ref('images/'+this.props.checkedFolder).set(obj);

    }).catch((err)=> {
      console.log(err);
    });

  }

  render() {

    return (

      <div>

          <Form className='form-uploader' >
          <Form.Group controlId="formForFileUpload" className='form-group-style'>
          <div className='uploader-wrapper'>
            <Button variant="primary" className='btn-block' >
                Upload File
            </Button>
            <Form.Control className='uploader-input' type="file" placeholder="Upload" onChange={this.onChangeHandler.bind(this)}/>
          </div>
          </Form.Group>
          </Form>
          <Form className='form-delete' onClick={this.props.deleteFiles}>
            <FontAwesomeIcon icon={faTrash}  />
          </Form>
      </div>

    );
  }
}

export default ImageContainer;
