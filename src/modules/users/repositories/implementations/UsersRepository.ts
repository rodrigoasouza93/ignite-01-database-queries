import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.find({
      where: {
        id: user_id
      },
      relations: ['games']
    });

    return user[0];
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query('SELECT * FROM users ORDER BY first_name ASC'); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const first_nameLower = first_name.toLowerCase()
    const last_nameLower = last_name.toLowerCase()
    return await this.repository
      .query(
        'SELECT * FROM users where lower(first_name) = $1 and lower(last_name) = $2',
        [
          first_nameLower,
          last_nameLower
        ]
      ); // Complete usando raw query
  }
}
