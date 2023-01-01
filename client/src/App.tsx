import './App.sass'
import { Header } from './components/header'
import packageInfo from "../package.json"
import TranslateForm from './components/translate-form'
import {  Provider as AlertProvider } from 'react-alert'
import { AlertTemplate } from './components/alert'
import Snowfall from 'react-snowfall'


function App() {
  return (
    <AlertProvider template={AlertTemplate} position="top center" transition="scale" timeout={2700} containerStyle={{ paddingTop: "50px" }} >
      <Snowfall  snowflakeCount={20} speed={[1, 0]} />

      <div className="App">
        <Header />

        <TranslateForm />

        <div className="footer">
          Mindall v{packageInfo.version}
          <br />
          By <a href={packageInfo.author.url}>{packageInfo.author.name}</a>
        </div>
      </div>
    </AlertProvider>
  )
}

export default App
