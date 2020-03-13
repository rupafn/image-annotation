import React from 'react';
import {Button,Form,Row,Col,ListGroup,Modal} from 'react-bootstrap';
import 'react-image-crop/dist/ReactCrop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus} from '@fortawesome/free-solid-svg-icons';

const firebase = require('firebase')

class Sidebar extends React.Component{
  constructor(props) {
      super(props);
      this.state ={
            showModal:false,
            folderName:''
        }
  }

  getFolderList() {
    return this.props.getFolderList()
  }


  createFolder() {
    console.log('create folder');
    this.setState({
      showModal:true
    })
  }

  saveChanges() {
    console.log('savingChanges');
    let db = firebase.database()
    db.ref('annotations/').update({
       [this.state.folderName]: true,
     });

     this.handleClose()
  }

  handleClose() {
    this.setState({
      showModal:false
    })
  }


  onChange(e) {
    this.setState({
      folderName:e.target.value
    })
  }

  render() {

    return (
      <div className='objects'>
          <Button href="#" className='title'>Image Annotation</Button>
          <Row>
            <Col xs lg="9" className="folder-title"> Folders</Col>
            <Col xs lg="3" className="folder-icon">
              <FontAwesomeIcon icon={faFolderPlus} onClick={this.createFolder.bind(this)}/>
            </Col>
          </Row>
          <Row>
              <Col xs lg="12" className="folder-list">
                <ListGroup>
                  {this.getFolderList()}
                </ListGroup>
              </Col>

          </Row>

          <Modal show={this.state.showModal} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="className">
          <Form.Label>Folder Name</Form.Label>
          <Form.Control type="text" placeholder="Enter folder name" onChange={this.onChange.bind(this)}/>
          </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose.bind(this)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.saveChanges.bind(this)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      </div>
    );
  }
}

export default Sidebar;
