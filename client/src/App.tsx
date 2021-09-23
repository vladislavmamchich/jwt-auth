import React, { FC, useContext, useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { Context } from '.'
import { observer } from 'mobx-react-lite'
import './index.scss'
import { IUser } from './models/iUser'
import UserService from './services/UserService'

const App: FC = () => {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Get all users</button>
      </div>
    )
  }
  return (
    <div>
      <h1>
        {store.isAuth
          ? `User authorized ${store.user.email}`
          : 'User not authorized'}
      </h1>
      <h1>{store.user.isActivated ? 'User account activated' : 'Activate account'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Get all users</button>
      </div>
      {users.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  )
}

export default observer(App)
