import { UserRepository } from './user.repository';
import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ForgetPasswordCode } from './../entities/forgetPasswordCode.entity';

@EntityRepository(ForgetPasswordCode)
export class ForgetPasswordCodeRepository extends Repository<ForgetPasswordCode> {
  async saveSecretCode(reqEmail, secretCode) {
    const queryUser = User.createQueryBuilder('user')
      .select('user.email')
      .where('user.email = :email ', { email: reqEmail });
    const insertSecret = await this.createQueryBuilder('secret')
      .insert()
      .values({
        code: secretCode,
        email: (await queryUser.getOneOrFail()).email,
      })
      .onConflict(`("email") DO UPDATE SET "code" = :code`)
      .setParameter('code', secretCode)
      .execute();
    console.log(insertSecret);
  }
}
