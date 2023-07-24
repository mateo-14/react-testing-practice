import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { login } from "../../services/authService"
import useUserStore from "../../stores/userStore"

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
})

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, setError } = useForm({
    resolver: yupResolver(schema)
  })
  const userStore = useUserStore()

  const onSubmit = async (data) => {
    try { 
      const { data: user, status } = await login(data.username, data.password)
      if (status === 200) {
        userStore.setUser(user)
      } else if (status === 401) {
        setError('root', { message: 'Username or password is incorrect' })
      } else {
        setError('root', { message: 'Something went wrong' })
      }
    } catch(err) {
      console.log(err)
      setError('root', { message: 'Something went wrong' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <p className="text-red-600">
        {errors.username?.message}
      </p>
      <input type="text" placeholder="Username" {...register('username')} className="px-2 py-1 rounded bg-neutral-800" />
      <p className="text-red-600 mt-4">
          {errors.password?.message}
      </p>
      <input type="password" placeholder="Password" {...register('password')} className="px-2 py-1 rounded bg-neutral-800"/>

      <button type="submit" disabled={isValid && isSubmitting} className="bg-purple-600 py-1 rounded disabled:opacity-70 mt-6">Login</button>
      <p className="text-red-600">
        {errors.root?.message}
      </p>
    </form>
  )
}

export default LoginForm