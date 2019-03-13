import React from 'react'
import { Link } from 'react-router-dom'
import { UserPic } from '..'

const CommentMessage = (props) => {
  const { commentList } = props
  if (!Array.isArray(commentList)) {
    return <div />
  }
  const content = commentList.map(comment => (
    <div
      key={comment._id}
      className="comment"
    >
      <React.Fragment>
        <Link to={`/user/${comment.by}`}>
          <UserPic src={comment.user[0].profilePic} alt={comment.user[0].username} />
        </Link>
        <li className="collection-item">
          <Link to={`/user/${comment.by}`}>
            <p className="userName">{comment.user[0].username}</p>
          </Link>
          {comment.comment}
        </li>
      </React.Fragment>

    </div>
  ))
  return (
    <div>
      <h6>
        {commentList.length}
        {' '}
comment(s)
      </h6>
      <div className="collection">{content}</div>
    </div>
  )
}

export default CommentMessage
