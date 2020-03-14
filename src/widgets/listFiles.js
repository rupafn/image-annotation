import React from 'react';
import {Form,Card,Button, Row,Col,ListGroup,Image} from 'react-bootstrap';
import ImageModal from './ImageModal';
const firebase = require('firebase')

class ListFiles extends React.Component{
  constructor(props) {
      super(props);
      this.state ={
        files:[],
        deleteItems:[],
      }

  }



onCheck(key,e){
  let delItems = this.props.deleteItems
  console.log('delete items');
  console.log(delItems);

  if(e.target.checked){
    delItems.push(key)

  } else{
    delItems.splice( delItems.indexOf(key), 1 );
  }
  this.setState({
    deleteItems:delItems
  })

  this.props.onCheck(delItems)
}

saveChanges(folder,base64){
  const storageRef = firebase.storage().ref();
  if(folder.length===0){
    folder = 'images'
  }
  let time = new Date().getTime();
  const newImageRef = storageRef.child(folder+'/'+time+'.png');
  newImageRef.putString(base64, 'data_url').then((res) => {
  //
    let bucket = res.metadata.bucket
    let path = res.metadata.fullPath
    var database = firebase.database();
    database.ref(folder+'/'+time).set({
      name: time+'.png',
      path:path,
      bucket: bucket
    });

  });
}

handleShow(src,e) {
  console.log("yes");
  this.props.handleShow(src,e)
}

handleClose(folder,base64) {
  this.props.handleClose(folder,base64)
}

// <Row>
//     <Col xs={1} md={2}>
//          <Form.Group controlId="formBasicCheckbox">
//            <Form.Check type="checkbox" label="" key={key} onChange={this.onCheck.bind(this,key)}/>
//          </Form.Group>
//     </Col>
//     <Col xs={6} md={4}>
//     <div onClick={this.handleShow.bind(this,files[key].src)}>
//         <Image src={files[key].src} thumbnail/>
//     </div>
//     </Col>
//     <Col xs={4} md={2}>
//         <p>{files[key].name}</p>
//     </Col>
// </Row>

displayList(){
  let files = this.props.files

  const listItems = Object.keys(files).map((key,i) =>
      <ListGroup.Item key={key}>
      <Card style={{ width: '18rem' }}>
         <Form.Group controlId="formBasicCheckbox">
           <Form.Check type="checkbox" label="" key={key} onChange={this.onCheck.bind(this,key)}/>
         </Form.Group>
        <Card.Img variant="top" src={files[key].src} />
        <Card.Body>
          <Card.Title>{files[key].name}</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        </Card>
      </ListGroup.Item>

    );
    // console.log(listItems);
  return listItems
}


  render() {

    return (
      <div className='list-group'>
      <ListGroup>
          {Object.keys(this.props.files).length>0?this.displayList(): <p></p>}
      </ListGroup>
      <ImageModal
        folders = {this.props.folders}
        handleJustClose={this.props.handleJustClose}
        handleClose={this.props.handleClose.bind(this)}
        show={this.props.show}
        currentSrc={this.props.currentSrc}/>

      </div>

    );
  }
}

export default ListFiles;
