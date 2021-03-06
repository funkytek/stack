import React from 'react'
import {PropTypes} from 'shasta'
import DataComponent from 'shasta-data-view'
import './index.sass'

class User extends DataComponent {
  static displayName = 'User';
  static propTypes = {
    repos: PropTypes.iterable,
    me: PropTypes.map
  };
  static storeProps = {
    me: 'me',
    user: 'requests.user'
  };

  fetch () {
    var opt = {
      name: this.props.name
    }
    this.actions.github.getUser({key: 'user'}, {params: opt})
  }

  displayData ({user}) {
    return <div className='ui card'>
      <img className='ui image' src={user.get('avatar_url')} />
      <div className='ui content'>
        <div className='ui header'>{user.get('name')}</div>
        <div className='description'>{user.get('email')}</div>
        <div className='meta'>
          <span className='location'>{user.get('location')}</span>
        </div>
      </div>
      <div className='ui extra content'>
        <i className='ui icon user'/>
        {user.get('followers')} followers
      </div>
    </div>
  }
  displayLoader () {
    return <div className='ui header'>Loading...</div>
  }
  displayErrors (errors) {
    return <div className='errors'>
      Failed to Load:
      {
        errors.map((err, field) =>
          <div key={field}>{field}: {err.message}</div>
        ).toArray()
      }
    </div>
  }
}

export default DataComponent.connect(User, require('core/actions'))
