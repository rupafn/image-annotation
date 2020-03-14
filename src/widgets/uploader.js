import React from 'react';
import {Row,Col,ListGroup,Spinner} from 'react-bootstrap';
import ImageContainer from './imageContainer';
import ListFiles from './listFiles';
import Sidebar from './Sidebar';
const firebase = require('firebase')

class Uploader extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        folders:[],
        files:[],
        deleteItems:[],
        show:false,
        currentSrc:'',
        snapshot:'',
        checked:'all',
        contentRetrieved:false
      }
  }

  componentDidMount(){

    this.readFromdb()
    this.getFolders()
  }

  //list all available folders
  getFolders(){
      var listFolders = firebase.database().ref('/annotations');

      let folders = this.state.folders
      listFolders.on('value',(snapshot)=>{
        const foldersObj = snapshot.val();
        console.log(foldersObj);
        if(foldersObj) {
          let folders = Object.keys(foldersObj);
          this.setState({
            folders
          });
        }
      })
      console.log(folders);

  }

  onCheck(items){
    this.setState({
      deleteItems:items
    })

  }



  saveChanges(folder,base64){
    const storageRef = firebase.storage().ref();
    if(folder.length===0){
      folder = 'all'
    }
    let time = new Date().getTime();
    let ext = 'png'
    const newImageRef = storageRef.child('images/'+time+'.png');
    let snapshot = this.state.snapshot;
    let obj = snapshot[folder]
    if(obj===undefined){
      obj={}
    }
    obj[time] = ext
    newImageRef.putString(base64, 'data_url').then((res) => {
    //

      var database = firebase.database();
      database.ref('images/'+folder).set(obj);

    });
  }

  handleShow(src,e) {
    this.setState({
      show:true,
      currentSrc:src
    })
  }

  handleClose(folder,base64) {
    this.saveChanges(folder,base64)
    this.setState({
      show:false,
      currentSrc:''
    })
    this.readFromdb()

  }

  handleJustClose(){
    console.log('test');
    this.setState({
      show:false,
      currentSrc:''
    })
  }


  deleteFiles(){
    console.log(this.state.deleteItems);
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var db = firebase.database();
    let i =0;
    let files = this.state.files
    let promise1 = new Promise((resolve, reject)=>{
      for(i=0; i<this.state.deleteItems.length; i++){
        let item = files[this.state.deleteItems[i]];
        var imageRef = storageRef.child(item.path);
        delete files[item.key]
        // // // Delete the file
        imageRef.delete().then(()=> {
          // File deleted successfully remove from database
        db.ref('images/'+item.tag+'/'+item.key).remove().then(()=>{


        })

        }).catch(function(error) {
          // Uh-oh, an error occurred!
          console.log("cannot delete");
        });
      }
      resolve(files)

    })

    promise1.then((value)=> {
      console.log('valueee');
      console.log(value);
      this.setState({
        files:value,
        deleteItems:[]
      })
      // expected output: "Success!"
    });
  }

getFromStorage(snapshot){
  this.setState({
    contentRetrieved:false
  })
  let objs = snapshot
  let list = {}
  console.log('getting from storage');
  var storage = firebase.storage();
  var storageRef = storage.ref();
  for (let [key, value] of Object.entries(objs)) {
      let folderObjs = value
      console.log(folderObjs);
      for(let [k,val] of Object.entries(folderObjs)){
        console.log('test');
        let filename = k+'.'+val
        let classs = key
        console.log(filename);
        // Create a reference to the file we want to download
        var starsRef = storageRef.child('images/'+filename);
        // Get the download URL
        starsRef.getDownloadURL().then(function(url) {
          // Insert url into an <img> tag to "download"
          let obj ={
            name:filename,
            src: url,
            key:k,
            path:'images/'+filename,
            tag: classs
          }
          list[k]=obj
          // list.push(obj)
        })
        .then(()=>{
          console.log('list');
          console.log(list);
          this.setState({
            files:list
          })
        })
        .catch(function(error) {

          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              console.log('File does not exist ');
              break;

            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log("User doesn't have permission to access the object");
              break;

            case 'storage/canceled':
              // User canceled the upload
              console.log('User canceled the upload');
              break;

            default :
              // Unknown error occurred, inspect the server response
              console.log('Unknown error occurred, inspect the server response');
              break;


          }
        });
      }
  }
}

retrievingContent(){
  this.setState({
    contentRetrieved:false
  })
}
readFromdb(){

  var listFiles = firebase.database().ref('images/');
    listFiles.on('value',(snapshot)=>{
      console.log(snapshot.val());
      this.getFromStorage(snapshot.val());
        this.setState({
          snapshot:snapshot.val(),
          deleteItems:[],
          contentRetrieved:true
        })/////
    })
}

getFolderList(){
  let folders = this.state.folders
  const listItems = folders.map((name,key) =>
        <ListGroup.Item key={key}>{name}</ListGroup.Item>
    );
  return listItems
}




  render() {
    return (
    <div id ='uploader'>
    <Row className="wrapper" >
     <Col  className ="menu"xs lg="3">
        <div className="sidebar">
            <Sidebar getFolderList = {this.getFolderList.bind(this)}/>
        </div>
      </Col>
      <Col className="file-container" xs lg="8">
        <div className="files-wrapper">
          <div className="files">
              <div className='btn-wrapper'>
                  <ImageContainer
                  retrievingContent={this.retrievingContent.bind(this)}
                  snapshot={this.state.snapshot}
                  checkedFolder={this.state.checked}
                  deleteFiles ={this.deleteFiles.bind(this)}/>
              </div>
              <Row className='list-wrapper'>
                <ListFiles
                  files={this.state.files}
                  folders={this.state.folders}
                  handleJustClose={this.handleJustClose.bind(this)}
                  handleShow = {this.handleShow.bind(this)}
                  show = {this.state.show}
                  currentSrc = {this.state.currentSrc}
                  handleClose = {this.handleClose.bind(this)}
                  onCheck={this.onCheck.bind(this)}
                  deleteItems={this.state.deleteItems}
                  />

              </Row>
          </div>
        </div>
      </Col>
    </Row>
    {this.state.contentRetrieved? (<p></p>) : (
      <div className = "spinner-wrapper">
        <Spinner className='spinner' animation="border" />
      </div>
    )}

    </div>



    );
  }
}




export default Uploader;
