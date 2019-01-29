import React, { Component } from 'react';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
import { findIndex } from 'lodash';
import './App.css';

class App extends Component {

      constructor(props){
          super(props);
          this.state = {
              tasks : [], //Data: id->unique, name, status
              isDisplayForm : false,
              taskEditting: null,
              filter : {
                name: '',
                status: -1
              },
              keyword: '',
              sortBy: 'name',
              sortValue: 1
          };

        }  

    componentWillMount(){
      //check xem localStorage đã có hay chưa nếu có ta thêm nó vào state
      if(localStorage && localStorage.getItem('tasks')){
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        this.setState({
          tasks: tasks
        });
      }
    }      
    

    s4(){
      //hàm tạo ra những con số ngẫu nhiên
      return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    GenerateID(){
      //bingding ID
      return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() +
          '-' + this.s4() + this.s4() + this.s4();
    }
    changeForm = () =>{
      //Trường hợp button thêm
      if(this.state.isDisplayForm && this.state.taskEditting !== null){
              this.setState({
            isDisplayForm: true,
            taskEditting: null
        });
      }else {
        //Trường hợp button sửa
          this.setState({
          isDisplayForm: !this.state.isDisplayForm,
          taskEditting: null
        });
      }
      
    }
    onCloseForm = () =>{
      this.setState({
        isDisplayForm: false
      });
    }
    onShowForm = () =>{
      this.setState({
        isDisplayForm: true
      });
    }
    onSubmit = (data)=>{
       var { tasks } = this.state;
       if(data.id === ''){
            // create Công Việc
            data.id = this.GenerateID();
            tasks.push(data);
       }else {
         // edit Công Việc
         var index = this.findIndex(data.id);
         tasks[index] = data; 
       }
      
      this.setState({
        tasks: tasks,
        taskEditting: null
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    onUpdateStatus = (id)=>{
      var { tasks } = this.state;
      // var index = this.findIndex(id);
      var index = findIndex(tasks, (task) =>{
        return task.id === id;
      });
      //sau khi lấy được vị trí
      if(index !== -1){
        tasks[index].status = !tasks[index].status;
        this.setState({
          tasks : tasks
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
    //lấy vị trí của từng phần tử dựa vào id
    findIndex = (id)=>{
      var { tasks } = this.state;
      var result = -1;
      tasks.forEach((task, index)=>{
        if(task.id === id){
          result = index;
        }
      });
      return result;
    }
    onDelete = (id)=>{
      var { tasks } = this.state;
      var index = this.findIndex(id);
      //sau khi lấy được vị trí
      if(index !== -1){
        tasks.splice(index, 1);
        this.setState({
          tasks : tasks
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.onCloseForm();
      }
    }
    onUpdate = (id)=>{
      var { tasks } = this.state;
      var index = this.findIndex(id);
      var taskEditting = tasks[index];
      console.log(taskEditting);
      this.setState({
        taskEditting: taskEditting
      });
      this.onShowForm();
     
    }
    onFilter = (filterName, filterStatus) =>{
     
      filterStatus = parseInt(filterStatus, 10);
      this.setState({
        filter:{
          name: filterName.toLowerCase(),
          status: filterStatus
        }
      });
    }
    onSearch = (keyword) =>{
      this.setState({
        keyword: keyword
      });
    }
    onSort = (sortBy, sortValue) =>{
      
      this.setState({
        sortBy: sortBy,
        sortValue: sortValue
      });
    }
  render() {
    //lấy các giá trị của state ban đầu
    var { tasks, isDisplayForm, taskEditting, filter, keyword, sortBy, sortValue  } = this.state;
    if (filter) {
      if(filter.name){
        //lọc từng phần tử trong bảng task
        tasks = tasks.filter((task)=>{
            // duyệt trong bảng task và biến phần tử thành chữ thường rồi kiểm tra phần từ bằng hàm indexOf()
            return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      tasks = tasks.filter((task)=>{
        if(filter.status === -1){
          return task;
        }else{
          return task.status === (filter.status === 1 ? true : false);
        }
      }); 
    }


    if(keyword){
      //lọc từng phần tử trong bảng task
        tasks = tasks.filter((task)=>{
            // duyệt trong bảng task và biến phần tử thành chữ thường rồi kiểm tra phần từ bằng hàm indexOf()
            return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });
    }


    if(sortBy === 'name'){
      tasks.sort((a, b)=>{
        if(a.name > b.name) return sortValue;
        else if(a.name > b.name) return -sortValue;
        else return 0;
      });
    }else{
      tasks.sort((a, b)=>{
        if(a.status > b.status) return -sortValue;
        else if(a.status > b.status) return sortValue;
        else return 0;
      });
    }
    //khai báo biến để quản lí changeForm
    var elementsForm = isDisplayForm 
    ? <TaskForm 
    onSubmit ={this.onSubmit}
    onCloseForm={ this.onCloseForm }
    task={taskEditting}
    /> 
    : '';
    return (
      <div className="container">
          <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr />
          </div>
          <div className="row">
            <div className={ isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : '' }>
              {/*form*/}
              { elementsForm }
            </div>


            <div className={ isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12' }>
              <button type="button" className="btn btn-primary" onClick={this.changeForm}>
                <span className="fa fa-plus mr-5" />Thêm Công Việc
              </button>
              

              {/*Search*/}
                  <Control 
                  onSearch={this.onSearch}
                  onSort={this.onSort}
                  sortBy={sortBy}
                  sortValue={sortValue}
                  />
              {/*Sort*/}
              
                  <TaskList 
                  tasks={ tasks }
                  onUpdateStatus={this.onUpdateStatus}
                  onDelete={this.onDelete}
                  onUpdate={this.onUpdate}
                  onFilter ={this.onFilter}
                  />
               
            </div>
          </div>
        </div>

    );
  }
}

export default App;
