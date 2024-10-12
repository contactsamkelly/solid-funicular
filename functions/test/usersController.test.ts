// import { faker } from '@faker-js/faker';
import { SELF } from 'cloudflare:test';
import { describe, expect, test } from 'vitest';
// import { createUser } from '../api/users/usersController.ts';

// const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Users Controller', () => {
  describe('Users::Create', () => {
    test('Testing', () => {
      expect(true).toBe(true);
    });
    test('Async testing', async () => {
      const result = await SELF.fetch('/api/users', {
        method: 'POST',
        body: {
          'test': 'test'
        }
      });
      console.log(result);
      expect(true).toBe(true);
    })
    // test('Creating a user with valid information should return the user', async () => {
    //   const requestParams = {
    //     name: faker.person.fullName(),
    //     username: faker.internet.userName(),
    //     email: faker.internet.email(),
    //     bio: faker.person.bio(),
    //     location: faker.location.city()
    //   };
    //   try {
    //     const response = await SELF.fetch("/api/users", {
    //       method: 'POST',
    //       body: requestParams
    //     });
    //     console.log('Response was', response);
    //     expect(response.status).toBe(200);
    //   }
    //   catch (e) {
    //     console.log('uhhh', e);
    //     expect(true).toBe(true);
    //   }
      
    // });
  });
});