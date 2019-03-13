import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', () => { // eslint-disable-line
  const div = document.createElement('div') // eslint-disable-line
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
