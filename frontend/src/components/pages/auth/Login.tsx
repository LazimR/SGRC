import { Mail, Lock, LogIn, ArrowLeft, Film } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../../ui/Input"
import { useUser } from "../../../context/useUser"
import { useNavigate } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof LoginSchema>

function LoginUser() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema)
  })

  const { login: loginUser } = useUser()
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  async function onSubmit(form: LoginFormData) {
    const response = await loginUser(form)

    if (response.success) {
      setFlashMessage("success", response.message)
      navigate("/dashboard")
    } else {
      setFlashMessage("error", response.message || "Erro ao fazer login")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">

          {/* Header */}
          <div className="relative px-8 py-10 text-center">

            {/* Glow dourado */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full" />

            {/* Icon */}
            <div className="relative flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
                <Film className="text-amber-500" size={32} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white">
              CinemaReserve
            </h1>

            <p className="text-zinc-400 text-sm mt-2">
              Entre para reservar seus filmes
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-8 pb-10 space-y-6"
          >

            {/* Email */}
            <Input
              label="E-mail *"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={18} />}
              {...register("email")}
              error={errors.email?.message}
            />

            {/* Senha */}
            <Input
              label="Senha *"
              type="password"
              placeholder="Digite sua senha"
              isPassword
              leftIcon={<Lock size={18} />}
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Botão */}
            <button
              type="submit"
              className="
                group
                w-full
                flex items-center justify-center gap-2
                bg-linear-to-r from-amber-500 to-amber-400
                hover:from-amber-600 hover:to-amber-500
                text-white font-semibold
                py-3 px-4
                rounded-xl
                transition-all
                hover:scale-[1.02]
                active:scale-[0.98]
                shadow-lg hover:shadow-amber-500/30
              "
            >
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform"/>
              Entrar
            </button>

            {/* Links */}
            <div className="text-center pt-6 border-t border-zinc-800">

              <p className="text-sm text-zinc-400 mb-3">
                Não possui conta?{" "}
                <a
                  href="/register"
                  className="text-amber-500 font-semibold hover:text-amber-400 transition"
                >
                  Criar conta
                </a>
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  inline-flex items-center gap-2
                  text-sm text-zinc-400
                  hover:text-white
                  transition
                "
              >
                <ArrowLeft size={16}/>
                Voltar para home
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  )
}

export default LoginUser
