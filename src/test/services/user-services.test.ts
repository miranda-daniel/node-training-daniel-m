// import { db } from '@root//prisma/db';
// import { ApiError } from '@config/api-error';
// import { UserService } from '@services/user-services';
// import { createUser } from '@test/helpers/utils';
// import { UserSerializer } from '@serializers/user-seralizer';
// import { errors } from '@config/errors';
// import {
//   registerUserRandom,
//   userRandomRaw,
// } from '@test/helpers/data-generators';
// import * as utils from '@helpers/utils';
// import { User, UserIndex } from '@typing/user';

// describe('UserService', () => {
//   describe('Get Users', () => {
//     beforeEach(async () => await createUser({ email: 'test1@gmail.com' }));

//     afterEach(async () => {
//       await db.user.delete({ where: { email: 'test1@gmail.com' } });
//     });

//     it('should return an array', async () => {
//       const usersListRaw = await UserService.getUsersService();

//       expect(usersListRaw).toBeInstanceOf(Array);
//     });

//     it('should serialize user response', async () => {
//       jest.spyOn(db.user, 'findMany').mockResolvedValue([userRandomRaw]);

//       const usersSerialized: UserIndex[] = [
//         {
//           firstName: userRandomRaw.firstName,
//           lastName: userRandomRaw.lastName,
//         },
//       ];

//       expect(usersSerialized).toEqual(
//         UserSerializer.serializeUserListIndex([userRandomRaw])
//       );
//     });

//     it('should throw an ApiError on database error', async () => {
//       jest
//         .spyOn(db.user, 'findMany')
//         .mockRejectedValue(new Error('Database error'));

//       await expect(UserService.getUsersService()).rejects.toThrow(
//         new ApiError(errors.INTERNAL_SERVER_ERROR)
//       );
//     });

//     it('should handle errors correctly and throw an ApiError with INTERNAL_SERVER_ERROR code', async () => {
//       jest
//         .spyOn(UserService, 'getUsersService')
//         .mockRejectedValue(new ApiError(errors.INTERNAL_SERVER_ERROR));

//       try {
//         await UserService.getUsersService();
//       } catch (error) {
//         expect(error).toBeInstanceOf(ApiError);

//         if (error instanceof ApiError) {
//           expect(error.errorCode).toBe(errors.INTERNAL_SERVER_ERROR.errorCode);
//         } else {
//           throw new Error('Must be an ApiError');
//         }
//       }
//     });
//   });
// });

// describe('UserService', () => {
//   describe('Register User', () => {
//     const defaultEmail = 'test1@gmail.com';
//     const newUserRequest = { ...registerUserRandom, email: defaultEmail };

//     it('should call hashPassword once with the correct argument', async () => {
//       jest.spyOn(utils, 'hashPassword').mockResolvedValue('hashedPasswordMock');

//       await UserService.registerUserService(newUserRequest);

//       expect(utils.hashPassword).toHaveBeenCalledTimes(1);
//       expect(utils.hashPassword).toHaveBeenCalledWith(
//         registerUserRandom.password
//       );

//       await db.user.delete({ where: { email: defaultEmail } });
//     });

//     it('should call db.user.create with correct parameters', async () => {
//       const hashedPassword = 'hashedPasswordMock';

//       jest.spyOn(utils, 'hashPassword').mockResolvedValue(hashedPassword);

//       const createSpy = jest
//         .spyOn(db.user, 'create')
//         .mockResolvedValue({ ...userRandomRaw, password: hashedPassword });

//       await UserService.registerUserService(newUserRequest);

//       expect(createSpy).toHaveBeenCalledWith({
//         data: {
//           firstName: registerUserRandom.firstName,
//           lastName: registerUserRandom.lastName,
//           email: defaultEmail,
//           password: hashedPassword,
//         },
//       });
//     });

//     it('should serialize user created', async () => {
//       jest.spyOn(db.user, 'create').mockResolvedValue(userRandomRaw);

//       const usersSerialized: User = {
//         id: userRandomRaw.id,
//         email: userRandomRaw.email,
//         firstName: userRandomRaw.firstName,
//         lastName: userRandomRaw.lastName,
//       };

//       expect(usersSerialized).toEqual(UserSerializer.serialize(userRandomRaw));
//     });

//     it('should throw an ApiError USER_ALREADY_EXISTS on database error', async () => {
//       jest
//         .spyOn(db.user, 'create')
//         .mockRejectedValue(new Error('Database error'));

//       await expect(
//         UserService.registerUserService(newUserRequest)
//       ).rejects.toThrow(new ApiError(errors.USER_ALREADY_EXISTS));
//     });
//   });
// });
