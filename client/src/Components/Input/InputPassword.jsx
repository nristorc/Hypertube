import InputText from './InputText'

class InputPassword extends InputText {

}

InputPassword.defaultProps = {
  type: 'password',
  placeholder: null,
  max: -1,
  min: -1,
  regexp: '',
}

export default InputPassword
