import React from 'react'
import PropTypes from 'prop-types'

class InputTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '', className: '' }
  }

  onBlur() {
    const { regexp } = this.props
    const { value } = this.state
    if (regexp !== '') {
      const regex2 = new RegExp(regexp)
      if (value.match(regex2) === null) this.setState({ className: 'error' })
      else this.setState({ className: 'valid' })
    }
  }

  onChange(event) {
    const { value } = event.target
    this.setState({ value })
  }

  onFocus() {
    this.setState({ className: '' })
  }

  onKeyPress(event) {
    const { keyCode, ctrlKey, shiftKey } = event
    const { min, max } = this.props
    const { value } = this.state
    if (min > -1 && min > value.length) {
      this.setState({ className: 'error' })
    }
    if (keyCode === 13 && ctrlKey === false
      && shiftKey === false && max > -1 && max - 1 < value.length) {
      event.preventDefault()
    }
  }

  render() {
    const {
      placeholder, label, name,
    } = this.props
    const { className, value } = this.state
    return (
      <textarea
        s={2}
        type="textarea"
        label={label}
        name={name}
        id={name}
        className={className}
        onBlur={this.onBlur.bind(this)}
        onKeyDown={this.onKeyPress.bind(this)}
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        value={value}
        placeholder={placeholder}
      />
    )
  }
}

InputTextArea.defaultProps = {
  placeholder: null,
  max: -1,
  min: -1,
  regexp: '',
  label: '',
}

InputTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  regexp: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  label: PropTypes.string,
}

export default InputTextArea
