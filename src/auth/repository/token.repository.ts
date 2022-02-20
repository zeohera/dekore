import { UnauthorizedException } from '@nestjs/common';
import { LogOutDto } from './../dto/logout.dto';
import { Token } from './../entities/token.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import * as JsonWebToken from 'jsonwebtoken';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  // constructor(private jwtService: JwtService) {
  //   super();
  // }
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
    const { token } = tokenInfo;
    const queryResult = Token.createQueryBuilder('token')
      .update(Token)
      .set({ state: false })
      .where('accessToken = :token ', { token })
      .execute();
  }
  async getToken(refreshToken: string) {
    try {
      const queryResult = await Token.findOne({ refreshToken, state: true });
      if (!queryResult) {
        throw new Error('refreshToken not found');
      }
      try {
        const refreshPayload: any = await JsonWebToken.verify(
          refreshToken,
          process.env.REFRESH_TOKEN,
        );
        if (refreshPayload) {
          const accessPayload = refreshPayload;
          delete accessPayload.exp;
          delete accessPayload.iat;
          try {
            const accessPayload = await JsonWebToken.verify(
              queryResult.accessToken,
              process.env.ACCESS_TOKEN,
            );
            return queryResult.accessToken;
          } catch (error) {
            const newAccessToken = await JsonWebToken.sign(
              accessPayload,
              process.env.ACCESS_TOKEN,
              {
                expiresIn: process.env.ACCESS_TOKEN_EXP,
              },
            );
            const queryResult = await Token.createQueryBuilder('token')
              .update(Token)
              .set({
                accessToken: newAccessToken,
                accessTokenUpdateAt: () => 'CURRENT_TIMESTAMP',
              })
              .where('refreshToken = :token ', { token: refreshToken })
              .execute();
            const updatedToken = await Token.findOne({ refreshToken });
            return updatedToken.accessToken;
          }
        }
      } catch (error) {}
    } catch (error) {
      throw new UnauthorizedException('token wrong');
    }
  }
}
