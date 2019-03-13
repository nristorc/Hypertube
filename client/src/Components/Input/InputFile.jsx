import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'react-materialize'

class InputFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = { className: '' }
  }

  onChange = (event) => {
    const { regexp } = this.props
    if (regexp !== '') {
      const regex2 = new RegExp(regexp)
      if (event.target.value.match(regex2) === null) {
        this.setState({ className: 'error profPic' })
      } else {
        this.setState({ className: 'valid profPic' })
      }
    }
  }

  render() {
    const {
      label, name, placeholder,
    } = this.props
    const { className } = this.state
    return (
      <Input
        type="file"
        name={name}
        className={className}
        label={label}
        placeholder={placeholder}
        onChange={this.onChange}
      />
    )
  }
}

InputFile.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  regexp: PropTypes.string,
}

InputFile.defaultProps = {
  placeholder: '',
  label: 'Profile pic',
  regexp: '',
}

export default InputFile
