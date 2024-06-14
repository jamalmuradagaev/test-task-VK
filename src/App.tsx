import { BrowserRouter, Route, Routes} from 'react-router-dom'
import MovieList from './components/MovieList'
// import MovieDetails from './components/MovieDetails'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={MovieList}/>
        {/* <Route path='/movie/:id' Component={MovieDetails}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
