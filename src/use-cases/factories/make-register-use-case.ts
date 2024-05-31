import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.repository";
import { RegisterUseCase } from "../register.service";

export function makeRegisterUserCase(){
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)
    
    return registerUseCase
}