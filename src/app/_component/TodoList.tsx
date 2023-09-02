'use client'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import BadgeCustom from '../_component/BadgeCustom';
import Paginate from './Paginate';
import { useState } from 'react';

const TODO_ITEM_PER_PAGE = 8;

type todo = {
  title: string,
  completed: boolean
}

const TodoList = () => {
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [ newTaskInput, getNewTaskInput ] = useState("");
  const [ goToPage, getGoToPage ] = useState("")

  const queryClient = useQueryClient()

  function handleInputPageChange (event:any) {
    const result = event.target.value.replace(/\D/g, '');

    getGoToPage(result)
  };

  function handleBtnPageOnClick (event: React.MouseEvent) {
    if(totalPage < Number(goToPage) || Number(goToPage) === 0)
      alert("Page invalid")
    else
      setCurrentPage(Number(goToPage) -1)
    
    getGoToPage("");
  }

  async function fetchTodos (page: number) {
      return await axios.get('http://localhost:5000/todos', 
      { 
        params: {
          _page: page + 1,
          _limit: TODO_ITEM_PER_PAGE
        }
      }).then(res => {
        setTotalPage(Math.ceil(res.headers["x-total-count"] / TODO_ITEM_PER_PAGE)); // length of your data without page limit
        return res
      })
  }

  async function addTodos (todo:todo) {
    const axiosAddTodo = await axios.post('http://localhost:5000/todos', todo)

    const responseTodo = await axios.get('http://localhost:5000/todos', 
    { 
      params: {
        _page: 1,
        _limit: 1
      }
    }).then(res => {
      setTotalPage(Math.ceil(res.headers["x-total-count"] / TODO_ITEM_PER_PAGE)); // length of your data without page limit
    })

    return axiosAddTodo
  }

  async function deleteTodos (todoID: number) {
    const axiosAddTodo = await axios.delete(`http://localhost:5000/todos/${todoID}`)

    const responseTodo = await axios.get('http://localhost:5000/todos', 
    { 
      params: {
        _page: 1,
        _limit: 1
      }
    }).then(res => {
      setTotalPage(Math.ceil(res.headers["x-total-count"] / TODO_ITEM_PER_PAGE)); // length of your data without page limit
    })

    return axiosAddTodo
  }
    
  const { isLoading, error, data: todos } = useQuery({
    queryKey: ['todos', currentPage],
    queryFn: () => fetchTodos(currentPage),
    keepPreviousData : true
  })

  const addTodoMutation = useMutation({
    mutationFn: (newTodo:todo) => addTodos(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', currentPage] })
    }
  })

  const deleteTodoMutation = useMutation({
    mutationFn: (deleteTodoById:number) => deleteTodos(deleteTodoById),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', currentPage] }).then(()=> {
        const queryAtCurrentPage:any = queryClient.getQueryData(['todos', currentPage]);
        
        console.log(typeof queryAtCurrentPage);
        

        if(queryAtCurrentPage.data.length === 0) {
          setCurrentPage(currentPage - 1)
        }
      })
      
    }
  })

  function handlePageClick(event: {selected: number}) {
    setCurrentPage(event.selected)
  }

  function addTodoBtnHandle(e:React.MouseEvent) {
    e.preventDefault();
    
    if(newTaskInput) {
      const newTodo:todo = {
        title: newTaskInput,
        completed: false
      }
      
      getNewTaskInput("");

      addTodoMutation.mutate(newTodo)

    } else alert("New todo is empty")
  }

  function todoDeleteOnClickHandle(e: React.MouseEvent, todoId: number) {
    e.preventDefault();

    deleteTodoMutation.mutate(todoId)
  }

    return ( 
      <div className="todos-list">
          {todos?.data && 
          <div className='text-center'>
                  {/* Modal */}
              <div className="modal fade" id="addTodoTaskModal" tabIndex={-1} aria-labelledby="addTodoTaskModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered align-items-center">
                      <div className="modal-content">
                          <div className="modal-header align-self-center">
                              <h1 className="modal-title fs-5" id="exampleModalLabel">Add Todo</h1>
                              {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                          </div>
                          <div className="modal-body">
                              <div className="form-floating mb-3">
                                  <input type="text" className="form-control ps-4 text-center" id="new-task-input" placeholder="full name" value={newTaskInput} onChange={e => getNewTaskInput(e.target.value)}/>
                                  <label htmlFor="new-task-input" className="w-100 text-center"><i className="fa-solid fa-clipboard-list mx-2"></i>Task</label>
                              </div>
                          </div>
                          <div className="modal-footer justify-content-around">
                              <button type="button" className="btn btn-success" onClick={addTodoBtnHandle}>Add</button>
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                          </div>
                      </div>
                  </div>
              </div>
              
              <button type="button" className="btn btn-success fs-5" data-bs-toggle="modal" data-bs-target="#addTodoTaskModal"><i className="fa-solid fa-circle-plus me-2"></i>Add Todo</button>
          </div>
          }
          <div className='row'>
          {isLoading && 
          <div className="text-center mt-5">
            <div className="spinner-border m-5" role="status" style={{width: "5rem", height: "5rem"}}>
                <span className="visually-hidden">Loading...</span>
            </div>
          </div>}

          {error instanceof Error && <div>'An error has occurred: ' + error.message</div>}
          
          {todos?.data && (
            <div>
              <div className='d-flex flex-wrap justify-content-center mt-3'>
                <input
                  type="text"
                  value={goToPage}
                  onChange={handleInputPageChange}
                  className='me-3'
                />
                <button className="btn btn-info" onClick={handleBtnPageOnClick}>Go to page</button>
              </div>
              <Paginate handlePageClick={handlePageClick} pageCount={totalPage} currentPage={currentPage}/>
            </div>
          )}

          {todos?.data.map((item: any) => {
            return <div className='col-lg-3 col-md-4 col-sm-6 p-3' key={item.id}>
              <div className="card w-100 h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <div className='d-flex align-items-center justify-content-evenly flex-wrap mb-2'>
                    <h6 className="card-subtitle text-body-secondary m-0">ID: {item.id}</h6>
                    <BadgeCustom completed={item.completed}/>
                  </div>
                  <p className="card-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus sapiente debitis, molestiae alias, enim cum dolores aspernatur</p>
                  <button className="btn btn-outline-danger" onClick={(e)=> { todoDeleteOnClickHandle(e, item.id) }}><i className="fa-solid fa-trash me-2"></i>Delete</button>
                </div>
              </div>
            </div>
          })}

          {todos?.data && (
            <Paginate handlePageClick={handlePageClick} pageCount={totalPage} currentPage={currentPage}/>
          )}
        </div>
      </div>
    );
}
 
export default TodoList;