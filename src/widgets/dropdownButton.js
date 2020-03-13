import React from 'react';
import {Dropdown} from 'react-bootstrap';
import 'react-image-crop/dist/ReactCrop.css';


class DropdownButton extends React.Component{
  constructor(props) {
      super(props);
      this.state ={
          folders:[],
        }
  }




  selectFolder(folder,e){
      this.props.setCurrentFolder(folder)
  }

  displayList(){
    // this.getFolders()
    let folders = this.props.folders
    const listItems = folders.map((folder,key) =>
        <Dropdown.Item href="#/action-1" key={key} onClick={this.selectFolder.bind(this,folder)}>{folder}</Dropdown.Item>
      );
      // console.log(listItems);
    return listItems
  }



  render() {

    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {this.props.currentFolder.length>0 ? this.props.currentFolder : 'Select Folder'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.props.folders.length>0 ? this.displayList() : <p></p>}
            </Dropdown.Menu>
        </Dropdown>
    );
  }
}

export default DropdownButton;
