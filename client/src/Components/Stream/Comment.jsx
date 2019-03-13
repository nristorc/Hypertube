import React from 'react'
import { Button } from 'react-materialize'
import { connect } from 'react-redux'
import { InputTextArea, CommentMessage } from '..'
import NotificationSystem from 'react-notification-system'
import { filmService } from '../../service'

const FormData = require('form-data')

class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.notificationSystem = React.createRef()
    this.textareaComment = React.createRef()
    this.state = {
      commentList: [],
    }
  }

  componentWillMount() {
    this.loadComments()
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && event.ctrlKey === false && event.shiftKey === false) {
      event.preventDefault()
      const form = new FormData()
      if (form.get('comment') === null) form.append('comment', event.target.value)
      this.postForm(form)
    }
  }

  comment(event) {
    const form = new FormData(event.target)
    event.preventDefault()
    this.postForm(form)
  }

  postForm(form) {
    if (this.textareaComment.current.state.value.length > 2500) {
      this.textareaComment.current.state.value = ''
      this.notificationSystem.current.addNotification({
        title: 'Error',
        message: 'Comments shouldn\'t be that long !',
        level: 'error',
      })
      return
    }
    if (this.textareaComment.current.state.value.trim() === '') {
      this.textareaComment.current.state.value = ''
      return
    }
    this.textareaComment.current.state.value = ''
    filmService.postComments(this.props.movieId, form)
      .then((ret) => {
        if (!ret.INVALID_COMMENT_LENGTH) this.loadComments()
        else {
          this.notificationSystem.current.addNotification({
            title: 'Error',
            message: 'Comments shouldn\'t be that long !',
            level: 'error',
          })
        }
      })
      .catch(err => console.log(err))
  }

  loadComments() {
    this.setState({ commentList: [] }, () => {
      filmService.getOneMovie(`/movie/${this.props.movieId}`)
        .then((data) => {
          this.setState({ commentList: data[0].comments })
        })
        .catch(err => console.log(err))
    })
    return false
  }

  render() {
    return (
      <div>
        <NotificationSystem ref={this.notificationSystem} />
        <CommentMessage className="comment-div" commentList={this.state.commentList} />
        <form className="" onSubmit={this.comment.bind(this)} onKeyDown={this.onKeyDown.bind(this)}>
          <InputTextArea
            ref={this.textareaComment}
            name="comment"
            max={140}
          />
          <Button type="submit" name="button" value="valid" className="blue">Post</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Comment)
