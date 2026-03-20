import { User, Mail, Lock, UserPlus, Film } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../../ui/Input"
import { useUser } from "../../../context/useUser"
import { useNavigate } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"


const registerSchema = z.object({
  username: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const { register: registerUser } = useUser()
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  async function onSubmit(form: RegisterFormData) {

    const response = await registerUser({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    })

    if (response.success) {
      setFlashMessage("success", "Usuário cadastrado com sucesso.")
      navigate("/")
    } else {
      setFlashMessage("error", response.message || "Erro ao registrar usuário")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo + título fora do card */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-amber-900/60 border border-amber-700/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Film className="text-amber-500" size={38} />
        </div>
        <h1 className="text-3xl font-bold text-white">CinemaReserve</h1>
        <p className="text-zinc-500 text-sm mt-1.5">Crie sua conta e comece a reservar</p>
      </div>

      {/* Card do formulário */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl px-8 py-8">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Input
            label="Nome Completo *"
            placeholder="Digite seu nome"
            leftIcon={<User size={18} />}
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="E-mail *"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail size={18} />}
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Senha *"
            type="password"
            placeholder="••••••••"
            isPassword
            leftIcon={<Lock size={18} />}
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar Senha *"
            type="password"
            placeholder="••••••••"
            isPassword
            leftIcon={<Lock size={18} />}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {/* Botão */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-2"
          >
            <UserPlus size={18} />
            Criar Conta
          </button>

          {/* Links */}
          <div className="text-center pt-2 space-y-2">
            <p className="text-sm text-zinc-500">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-amber-500 font-semibold hover:text-amber-400 transition"
              >
                Faça login
              </a>
            </p>
          </div>

        </form>

      </div>

    </div>
  )
}

export default RegisterUser
