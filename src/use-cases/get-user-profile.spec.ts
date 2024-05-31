import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users.repository"
import { beforeEach, describe, expect, it } from "vitest"
import { GetUserProfileUseCase } from "./get-user-profile"
import { hash } from "bcryptjs"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"


let userRepository :InMemoryUserRepository
let sut :GetUserProfileUseCase

describe('Get User Profile Use Case', () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository()
        sut = new GetUserProfileUseCase(userRepository)
    })

    it('should be able to get user profile', async () => {

       const createdUser =  await userRepository.create({
            name: 'Jhon doe',
            email: 'jhonn@gmail.com',
            password_hash: await hash('password', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })


        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('Jhon doe')
    })

    it('should not be able to get user profile with wrong id ', async () => {
     

       await expect(() =>
            sut.execute({
                userId: 'no-existe-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    

})