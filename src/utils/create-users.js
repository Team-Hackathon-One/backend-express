import { faker } from "@faker-js/faker";
import { Usuario } from "../model/relations/relations.js";

export async function createFakeUsers() {
  try {
    const numUsers = 1000;
    const fakeUsers = [];

    for (let i = 0; i < numUsers; i++) {
      const username = faker.internet.userName();
      const lastname = faker.person.lastName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      fakeUsers.push({
        username: username,
        lastname: lastname,
        email: email,
        password: password,
      });
    }

    await Usuario.bulkCreate(fakeUsers);
    console.log(`🎉 Se han creado ${numUsers} usuarios falsos con éxito!`);
  } catch (error) {
    console.error("Ocurrió un error al crear usuarios falsos:", error);
  }
}
