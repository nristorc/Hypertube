import InputText from './InputText'

class InputLogin extends InputText {

}

InputLogin.defaultProps = {
  type: 'text',
  placeholder: null,
  max: 32,
  min: 8,
  regexp: '',
}

export default InputLogin
