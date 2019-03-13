import InputText from './InputText'

class InputMail extends InputText {

}

InputMail.defaultProps = {
  type: 'email',
  placeholder: null,
  max: -1,
  min: -1,
  regexp: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
}

export default InputMail
