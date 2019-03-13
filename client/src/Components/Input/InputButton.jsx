import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-materialize'

const InputButton = (props) => {
  const { name, className, text } = props
  return (
    <Button
      name={name}
      className={className}
      waves="light"
    >
      {text || 'SUBMIT'}
    </Button>
  )
}

InputButton.defaultProps = {
  className: 'submit blue',
}

InputButton.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
}


export default InputButton
