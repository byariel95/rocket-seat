import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users.repository"
import { beforeEach, describe, expect, it } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"



let userRepository :InMemoryUserRepository
let sut : AuthenticateUseCase

describe('Authenticate use Case', () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository()
        sut = new AuthenticateUseCase(userRepository)
    })

    it('should be able to authenticate', async () => {

        await userRepository.create({
            name: 'Jhon doe',
            email: 'jhonn@gmail.com',
            password_hash: await hash('password', 6)
        })

        const { user } = await sut.execute({
            email: 'jhonn@gmail.com',
            password: 'password'
        })


        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
     

       await expect(() =>
            sut.execute({
                email: 'jhonn@gmail.com',
                password: 'password'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        

        await userRepository.create({
            name: 'Jhon doe',
            email: 'jhonn@gmail.com',
            password_hash: await hash('password', 6)
        })

       await expect(() =>
            sut.execute({
                email: 'jhonn@gmail.com',
                password: 'passwordx'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

})