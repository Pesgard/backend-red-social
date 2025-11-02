import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashUtils {
  private argonOptions = {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 1,
  };

  async hash(password: string): Promise<string> {
    return argon2.hash(password, this.argonOptions);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
}