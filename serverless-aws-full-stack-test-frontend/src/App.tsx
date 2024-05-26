
import { MyDownload } from "./components/MyDownload"
import { MyForm } from "./components/MyForm"
import { MyTable } from "./components/MyTable"
function App() {


  return (
        <div className="flex justify-center py-4">
      <div className="p-4">
        <MyForm/>
        <MyTable/>
        <MyDownload/>
      </div>
    </div>

  )
}

export default App
