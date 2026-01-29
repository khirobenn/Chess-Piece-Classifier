import './App.css';

import {useState} from "react"
import {OrbitProgress} from "react-loading-indicators"


const FileUploader = () => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState(null)
  const [animation, setAnimation] = useState(false)
  const [error, setError] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (myfile) =>{
    setAnimation(true)
    setError(false)
    setCategory(null)
    const form = new FormData()
    form.append("file", myfile)

    try{
      const response = await fetch('https://chess-classifier-304365436543.europe-west1.run.app/predict',
        {
          method: "POST",
          mode: "cors",
          body: form
        })
      const data = await response.json()
      if(response.ok){
        setCategory(data)
      }
      else{
        setError(true)
      }
    }
    catch(e){
      setError(true)
    }
    finally{
      setAnimation(false)
    }
  }

  return(
    <>
      <div className="input">
        <p>Choose your image !</p>
        <input type="file" accept='.png,.jpg,.jpeg,.webp,.avif' onChange={handleFileChange} />
      </div>

      {file && (
        <div>
          <img
              id="image_uploaded"
              src={URL.createObjectURL(file)}
          />
        </div>
      )}

      {animation && (
        <div className="load">
          <OrbitProgress color="#ffffff" size="medium" text="" textColor="" />
        </div>
      )}

      {category && (
        <div className='input'>
          Your piece is : {category}
        </div>
        )
      }

      {error && (
        <div className='input'>
          The picture can't be used, please use another one !
        </div>
        )
      }
    </>
  )
}

function App() {
  return (
    <>
      <div className='page'>
        <div className="App">
          <FileUploader/>
        </div>
      </div>
    </>
  )
}

export default App;