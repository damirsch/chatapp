import React, { type FC } from 'react'
import './Spinner.css'

const Spinner: FC = () => {
  return (
    <div>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Spinner