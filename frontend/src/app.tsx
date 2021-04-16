import { Logo } from './logo'
import './app.scss'
import { useState } from 'preact/hooks'

export const App = () => {

  const imgLinks = useState<string[]>([])

  return (
    <>
      <div className="form-primary">
      <div className="input-form">
        <div className="input-link">
          <label>
            Add image link
          </label>
          <input>

          </input>
          <button>
            Add
          </button>
        </div>

      </div>
      </div>
     
    </>
  )
}
