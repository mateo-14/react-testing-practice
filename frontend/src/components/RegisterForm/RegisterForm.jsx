import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { register as authRegister } from '../../services/authService'

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
})

const RegisterForm = ({ onRegister }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, setError } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      await authRegister(data.username, data.password)
      onRegister()
    } catch(err) {
      setError('root', { message: 'Something went wrong' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" aria-label="Register">
      <p className="text-red-600">
        {errors.username?.message}
      </p>
      <input type="text" placeholder="Username" {...register('username')} className="px-2 py-1 rounded bg-neutral-800" />
      <p className="text-red-600 mt-4">
        {errors.password?.message}
      </p>
      <input type="password" placeholder="Password" {...register('password')} className="px-2 py-1 rounded bg-neutral-800" />

      <button type="submit" disabled={isValid && isSubmitting} className="bg-purple-600 py-1 rounded disabled:opacity-70 mt-6">Register</button>
      <p className="text-red-600">
        {errors.root?.message}
      </p>
    </form>
  )
}

export default RegisterForm