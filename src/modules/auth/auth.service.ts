import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { log } from "console";
import { OAuth2Client } from "google-auth-library";
import { LoginDto } from "src/commons/dtos/login.dto";
import { LoginGGDto } from "src/commons/dtos/loginGG.dto";
import { RefreshTokenDto } from "src/commons/dtos/refresh-token.dto";
import { RegisterUserDto } from "src/commons/dtos/register-user.dto";
import { APPLICANT_LEVEL } from "src/commons/enums/manuscript.enum";
import { LOGIN_TYPE, ROLE } from "src/commons/enums/user.enum";
import { User } from "src/databases/entities/user.entity";
import { ApplicantRepository } from "src/databases/repositories/applicant.repository";
import { UserRepository } from "src/databases/repositories/user.repository";

@Injectable()
export class AuthService {
  //laay du lieyu ra : repository : can lay ra
  constructor(
    private readonly userRepository: UserRepository,
    private readonly applicantRepository: ApplicantRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async registerUser(body: RegisterUserDto) {
    const { username, email, password } = body;

    // check Email Exist
    //tim 1 voi dieu kien
    const userRecord = await this.userRepository.findOneBy({ email: email });
    //neu ton tai thi tra ra loi
    if (userRecord) {
      throw new HttpException("Ëmail is Exist", HttpStatus.BAD_REQUEST); // request 400
    }

    // dung thu vien node-argon2 de ma hoa
    const hashPassword = await argon2.hash(password);

    // create new user
    const newUser = await this.userRepository.save({
      email,
      username,
      password: hashPassword,
      loginType: LOGIN_TYPE.EMAIL,
      role: ROLE.APPLICANT,
    });

    // create new applicant by user
    await this.applicantRepository.save({
      userId: newUser.id,
    });
    return {
      message: "REGISTER USER SUCCESSFULLY",
    };
  }

  //Hàm Login
  async login(body: LoginDto) {
    const { email, password } = body;

    // check user Exist
    //tim 1 voi dieu kien
    const userRecord = await this.userRepository.findOneBy({ email: email });
    //neu ton tai thi tra ra loi
    if (!userRecord) {
      // neu ko ton tại thi co loi
      throw new HttpException(
        "Incorrect email address or password",
        HttpStatus.UNAUTHORIZED
      ); // request 401
    }

    // compare password
    const isPasswordValid = await argon2.verify(userRecord.password, password); // password user in db  - password form = true/ false
    if (!isPasswordValid) {
      throw new HttpException(
        "Incorrect email address or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    //access token
    const payload = this.getPayload(userRecord);
    const { accessToken, refreshToken } = await this.signToken(payload);
    return {
      message: "LOGIN USER SUCCESSFULLY",
      result: {
        accessToken,
        refreshToken,
      },
    };
  }

  //=========================================================
  //func refresh token
  async refresh(body: RefreshTokenDto) {
    const { refreshToken } = body;

    //verify xem rf cos hop len hay ko
    const payloadRefreshToken = await this.jwtService.verify(refreshToken, {
      secret: this.configService.get("jwtAuth").jwtRefreshTokenSecret,
    });
    console.log(payloadRefreshToken);

    //create new User
    // check user Exist
    //tim 1 voi dieu kien
    const userRecord = await this.userRepository.findOneBy({
      id: payloadRefreshToken.id,
    });

    //neu ton tai thi tra ra loi
    if (!userRecord) {
      // neu ko ton tại thi co loi
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND); // request 404
    }

    const payload = this.getPayload(userRecord);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.signToken(payload);
    return {
      message: "REFRESH TOKEN SUCCESSFULLY",
      result: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
  //=================================
  getPayload(user: User) {
    return {
      id: user.id,
      username: user.username,
      loginType: user.loginType,
      role: user.role,
    };
  }
  async signToken(payload) {
    const payloadRefreshToken = {
      id: payload.id,
    };
    //get access token
    let accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwtAuth").jwtTokenSecret, // why error
      expiresIn: "15m",
    });
    //

    const refreshToken = await this.jwtService.signAsync(payloadRefreshToken, {
      secret: this.configService.get("jwtAuth").jwtRefreshTokenSecret, // why error
      expiresIn: "7d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async loginWithGG(body: LoginGGDto) {
    const { token } = body;

    const ggClientID = this.configService.get("google").clientID;
    const ggClientSecret = this.configService.get("google").clientSecret;
    const oAuth2Client = new OAuth2Client(ggClientID, ggClientSecret);

    const ggLoginTicket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: ggClientSecret,
    });

    const { email, email_verified, name } = ggLoginTicket.getPayload();
    if (!email_verified) {
      throw new HttpException(
        "Email is not verify" + email,
        HttpStatus.FORBIDDEN
      );
    }
    //check user exsist
    // check user Exist
    //tim 1 voi dieu kien
    let userRecord = await this.userRepository.findOneBy({
      email: email,
      // loginType: LOGIN_TYPE.GOOGLE,
    });
    if (userRecord && userRecord.loginType === LOGIN_TYPE.GOOGLE) {
      throw new HttpException(
        "Email Had been login" + email,
        HttpStatus.UNAUTHORIZED
      ); // requ
    }
    //neu ton tai thi tra ra loi
    if (!userRecord) {
      userRecord = await this.userRepository.save({
        email,
        username: name,
        loginType: LOGIN_TYPE.GOOGLE,
      });
      await this.applicantRepository.save({
        userId: userRecord.id,
      });
    }
    const payload = this.getPayload(userRecord);
    const { accessToken, refreshToken } = await this.signToken(payload);

    return {
      message: "LOGIN WITH GOOGLE SUCCESSFULLY",
      result: {
        accessToken,
        refreshToken,
      },
    };
  }
}
