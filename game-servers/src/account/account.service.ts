import {ConflictException, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository}                                     from "@nestjs/typeorm";
import {Account}                                              from "./entities/account";
import {Repository}                                           from "typeorm";

@Injectable()
export class AccountService {


    constructor(@InjectRepository(Account) private repo: Repository<Account>) {

    }

    async register(email: string, password: string) {
        let exists = await this.repo.findOne({email});
        if (exists) {
            throw new ConflictException("Email Already Taken");
        }
        let account      = this.repo.create();
        account.email    = email;
        account.password = password;
        account.hashPassword();
        await this.repo.save(account);
    }

    async login(email: string, password: string) {
        let exists = await this.repo.findOne({email});
        if (!exists) {
            throw new UnauthorizedException("Invalid Email or Password");
        }
        if (!exists.checkIfUnencryptedPasswordIsValid(password)) {
            throw new UnauthorizedException("Invalid Email or Password");
        }
        return exists;
    }

    verify(token: string) {

    }
}
