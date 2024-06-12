"use client"

import {signIn} from "next-auth/client"

export default function LoginForm() {
    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }

        signIn("credentials", {
            ...data,
            callbackUrl: "/",
        })
    }

    return (
        <form onSubmit={login} className="bg-white p-12 rounded-lg w-96 max-w-full flex justify-center itens-center flex-col gap-12">
            <h2 className="font-bold text-xl mb-3">Faça seu login</h2>
            <input
                type="email"
                placeholder="E-mail"
                className="input input-primary w-full"
            />
            <input
                type="password"
                placeholder="Senha"
                className="input input-primary w-full"
            />
            <button className="btn btn-primary w-full" type="submit">Login</button>
        </form>
    )
}