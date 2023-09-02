import TodoList from "./_component/TodoList"

export default function Home() {

  return (
    <main className={"container"}>
      <div className='text-center'>
        <h1>Totos List</h1>
        <p>Using React Query</p>
      </div>
      <TodoList />
    </main>
  )
}
