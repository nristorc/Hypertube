import React from 'react'
import PropTypes from 'prop-types'

class InputSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { className: '' }
  }

  onBlur() {
    this.setState({ className: 'error' })
  }

  onChange(event) {
    const { values, onChange } = this.props
    const { target } = event
    const { value } = target
    values.forEach((v) => {
      if (value === v.key) {
        onChange(event)
      }
    })
  }

  render() {
    const { className } = this.state
    const { name, values } = this.props
    return (
      <select
        name={name}
        onChange={this.onChange.bind(this)}
        className={className}
      >
        {values.map(val => (
          <option key={val.key} value={val.key}>{val.val}</option>
        ))}
      </select>
    )
  }
}

InputSelect.defaultProps = {
  onChange: () => {},
}

InputSelect.propTypes = {
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

export default InputSelect
