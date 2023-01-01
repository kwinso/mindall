import './App.sass'
import { Header } from './components/header'
import packageInfo from "../package.json"
import TranslateForm from './components/translate-form'
import { Provider as AlertProvider } from 'react-alert'
import { AlertTemplate } from './components/alert'
import Snowfall from 'react-snowfall'


function checkIfNewYear() {
  const date = new Date();
  const month = date.getMonth()
  const day = date.getDate();

  // New year time is between Dec 15 and Jan 10
  return (month == 11 && day > 15) || (month == 0 && day < 10)
}

function App() {
  const isNewYearTime = checkIfNewYear();

  return (
    <AlertProvider template={AlertTemplate} position="top center" transition="scale" timeout={2700} containerStyle={{ paddingTop: "50px" }} >
      {isNewYearTime &&
        <Snowfall snowflakeCount={20} speed={[1, 0]} style={{ zIndex: 10 }} />
      }

      <div className="App">
        <Header isNewYearTime={isNewYearTime} />

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
