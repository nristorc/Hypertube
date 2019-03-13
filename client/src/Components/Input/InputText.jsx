import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'react-materialize'

class InputText extends React.Component {
  constructor(props) {
    super(props)
    const { disabledClass } = this.props
    if (disabledClass) {
      this.state = { value: '', className: 'disabled' }
    } else {
      this.state = { value: '', className: '' }
    }
  }

  onBlur = () => {
    const { regexp } = this.props
    const { value } = this.state
    if (regexp !== '') {
      const regex2 = new RegExp(regexp)
      if (value.match(regex2) === null) this.setState({ className: 'error' })
      else this.setState({ className: 'valid' })
    }
  }

  onChange = (event) => { // eslint-disable-line
    const { value } = event.target
    const { onChange } = this.props
    this.setState({ value })
    if (typeof onChange === 'function') return onChange(event)
  }

  onFocus = () => {
    this.setState({ className: '' })
  }

  onKeyPress = (event) => {
    const { keyCode } = event
    const { min, max } = this.props
    const { value } = this.state
    if (min > -1 && min > value.length) {
      this.setState({ className: 'error' })
    }
    if (keyCode !== 8 && keyCode !== 46 && max > -1 && max - 1 < value.length) {
      event.preventDefault()
    }
  }

  render() {
    const {
      type, label, name, placeholder, disabled, disabledClass,
    } = this.props
    const { value } = this.state
    const { className } = this.state
    const updatedClassName = (className === '' && disabledClass) ? disabledClass : className
    return (
      <Input
        type={type}
        label={label}
        name={name}
        className={updatedClassName}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyPress}
        onChange={this.onChange}
        onFocus={this.onFocus}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
      />

    )
  }
}

InputText.defaultProps = {
  placeholder: null,
  type: 'text',
  min: -1,
  max: -1,
  regexp: '',
  onChange: null,
}

InputText.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  regexp: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
}

export default InputText
