import React, { Component } from 'react';


class TasKItem extends Component {
    onUpdateStatus = () =>{
      this.props.onUpdateStatus(this.props.task.id);
    }


   changeStatus () {
     if(this.props.task.status === true){
         return <span
                  onClick={this.onUpdateStatus}
                 className="label label-success"
                 >
                   Kích Hoạt
                </span>;
    }else {
      return <span 
              onClick={this.onUpdateStatus}
              className="label label-info">
                  Ẩn
               </span>;
    }
  }
  onDelete = ()=>{
    this.props.onDelete(this.props.task.id);
  }
  onUpdate = ()=>{
    this.props.onUpdate(this.props.task.id);
  }
  render() {
    var { task, index } = this.props;
    return (
                        
                            <tr>
                              <td>{index + 1}</td>
                              <td>{task.name}</td>
                              <td className="text-center">
                                {this.changeStatus()}
                              </td>
                              <td className="text-center">
                                <button 
                                type="button" 
                                className="btn btn-warning"
                                onClick={this.onUpdate}
                                >
                                  <span className="fa fa-pencil mr-5" />Sửa
                                </button>
                                &nbsp;
                                <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={ this.onDelete}
                                >
                                  <span className="fa fa-trash mr-5" />Xóa
                                </button>
                              </td>
                            </tr>
                              
    );
  }
}

export default TasKItem;
