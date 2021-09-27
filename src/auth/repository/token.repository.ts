import { LogOutDto } from './../dto/logout.dto';
import { Token } from './../entities/token.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async checkActive(token: string): Promise<boolean> {
    const queryResult = await Token.createQueryBuilder('token')
      .where(
        new Brackets((qc) => {
          qc.where('token.accessToken = :token', { token: token }).orWhere(
            'token.refreshToken = :token',
            { token: token },
          );
        }),
      )
      .andWhere('token.state = true')
      .getCount();
    if (queryResult !== 1) {
      return false;
    } else return true;
  }
  async signOut(tokenInfo: LogOutDto) {
    console.log(tokenInfo);
    const { token } = tokenInfo;
    const queryResult = Token.createQueryBuilder('token')
      .update(Token)
      .set({ state: false })
      .where('accessToken = :token ', { token })
      .execute();
    console.log(queryResult);
  }
}
