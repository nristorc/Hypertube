import React from 'react'

const UserPic = (props) => {
  const { alt, className, src } = props
  return (
    <div className="containerPic">
      <img alt={alt} className={className} src={src} />
    </div>
  )
}

UserPic.defaultProps = {
  alt: 'UserPic',
  className: 'profilePic',
  placeholder: null,
  src: './img/defaultAvatar.png',
}

export default UserPic
