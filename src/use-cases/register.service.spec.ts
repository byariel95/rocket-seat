import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register.service';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { UserAlreadyExistsError } from './errors/user-already-exist-error';




describe('Register use Case', () => {

    it('should be able to register', async () => {
        const userRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(userRepository)

        const { user } = await registerUseCase.execute({
            name: 'Jhonn Doe',
            email: 'jhonn@gmail.com',
            password: 'password'
        })

        
        expect(user.id).toEqual(expect.any(String))
    })


    it('should hash user password upon registration', async () => {
        const userRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(userRepository)

        const { user } = await registerUseCase.execute({
            name: 'Jhonn Doe',
            email: 'jhonn@gmail.com',
            password: 'password'
        })

        const isPasswordCorrectlyHashed = await compare('password', user.password_hash);
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const userRepository = new InMemoryUserRepository()
        const registerUseCase = new RegisterUseCase(userRepository);

        const email = 'user@example.com'

        await registerUseCase.execute({
            name: 'Jhonn Doe',
            email,
            password: 'password'
        })

      await expect(() =>
            registerUseCase.execute({
                name: 'Jhonn Doe',
                email,
                password: 'password'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})