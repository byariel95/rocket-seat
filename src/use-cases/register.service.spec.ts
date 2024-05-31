import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register.service';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { UserAlreadyExistsError } from './errors/user-already-exist-error';



let userRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register use Case', () => {

    beforeEach(() => {
            userRepository = new InMemoryUserRepository()
            sut = new RegisterUseCase(userRepository)
    })

    it('should be able to register', async () => {
        

        const { user } = await sut.execute({
            name: 'Jhonn Doe',
            email: 'jhonn@gmail.com',
            password: 'password'
        })

        
        expect(user.id).toEqual(expect.any(String))
    })


    it('should hash user password upon registration', async () => {
      

        const { user } = await sut.execute({
            name: 'Jhonn Doe',
            email: 'jhonn@gmail.com',
            password: 'password'
        })

        const isPasswordCorrectlyHashed = await compare('password', user.password_hash);
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
      

        const email = 'user@example.com'

        await sut.execute({
            name: 'Jhonn Doe',
            email,
            password: 'password'
        })

      await expect(() =>
            sut.execute({
                name: 'Jhonn Doe',
                email,
                password: 'password'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})