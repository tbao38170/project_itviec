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
import { Applicant } from "src/databases/entities/applicant.entity";
import { Company } from "src/databases/entities/company.entity";
import { User } from "src/databases/entities/user.entity";
import { ApplicantRepository } from "src/databases/repositories/applicant.repository";
import { CompanyRepository } from "src/databases/repositories/company.repository";
import { UserRepository } from "src/databases/repositories/user.repository";
import { DataSource } from "typeorm";
import { MailService } from "../mail/mail.service";
import { RegisterCompanyDto } from "src/commons/dtos/register-company.dto";

@Injectable()
export class AuthService {
  //laay du lieyu ra : repository : can lay ra
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly applicantRepository: ApplicantRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService
  ) {}

  //register user-applicanr
  async registerUser(body: RegisterUserDto) {
    const { username, email, password } = body;

    // check Email Exist
    //tim 1 voi dieu kien
    const userRecord = await this.userRepository.findOne({ where: { email } });
    // console.log(userRecord, "user record");

    //neu ton tai thi tra ra loi
    if (userRecord) {
      throw new HttpException("Email is Exist", HttpStatus.BAD_REQUEST); // request 400
    }

    // dung thu vien node-argon2 de ma hoa
    const hashPassword = await argon2.hash(password);
    //dung transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log("Starting transaction...");
    await queryRunner.startTransaction();
    try {
      // Các thao tác trong transaction
      const newUser = await queryRunner.manager.save(User, {
        email,
        username,
        password: hashPassword,
        loginType: LOGIN_TYPE.EMAIL,
        role: ROLE.APPLICANT,
      });

      await queryRunner.manager.save(Applicant, { userId: newUser.id });
      // Gửi email sau khi transaction hoàn tất
      await this.mailService.sendMail(
        email,
        "Welcome To IT VIEC",
        "welcome-applicant",
        {
          name: username,
          email: email,
        }
      );
      console.log("Committing transaction...");
      // if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
      // }

      return { message: "REGISTER USER SUCCESSFULLY" };
    } catch (error) {
      console.error("Transaction error:", error);

      // if (queryRunner.isTransactionActive) {

      await queryRunner.rollbackTransaction();
      // }

      // throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      console.log("Releasing query runner...");
      await queryRunner.release();
    }
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
    // check xem user da ddang ky user chua
    if (userRecord && userRecord.loginType === LOGIN_TYPE.GOOGLE) {
      throw new HttpException(
        "Email had been login" + email,
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

  // register company hr
  async registerCompany(body: RegisterCompanyDto) {
    const {
      username,
      email,
      password,
      companyName,
      companyAddress,
      companyWebsite,
    } = body;

    // check Email Exist
    //tim 1 voi dieu kien
    const userRecord = await this.userRepository.findOneBy({ email: email });
    //neu ton tai thi tra ve loi
    if (userRecord) {
      throw new HttpException(
        "Email is already in use",
        HttpStatus.BAD_REQUEST
      );
    }

    // Mã hóa mật khẩu
    if (!password) {
      throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await argon2.hash(password);
    /// lam transaction

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log("Starting transaction...");
    await queryRunner.startTransaction();
    try {
      // Tạo user mới
      // const newUser = await this.userRepository.save({
      //   email,
      //   username,
      //   password: hashPassword,
      //   loginType: LOGIN_TYPE.EMAIL,
      //   role: ROLE.COMPANY,
      // });

      // Tạo user mới
      const newUser = await queryRunner.manager.save(User, {
        email,
        username,
        password: hashPassword,
        loginType: LOGIN_TYPE.EMAIL,
        role: ROLE.COMPANY,
      });

      // Tạo thông tin công ty liên kết với user
      // const newCompany = await this.companyRepository.save({
      //   userId: newUser.id,
      //   name: companyName,
      //   location: companyAddress,
      //   website: companyWebsite,
      // });
      await queryRunner.manager.save(Company, {
        userId: newUser.id,
        name: companyName,
        location: companyAddress,
        website: companyWebsite,
      });
      await this.mailService.sendMail(
        "k01-itviec@yopmail.com",
        "Welcome to IT VIEC",
        "welcome-applicant", // Tên template chính xác
        {
          name: username,
          email: email,
        }
      );
      await queryRunner.commitTransaction();

      return {
        message: "Company registered successfully",
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
    } finally {
      await queryRunner.release();
    }
  }
}
