// імпорт пакета fs у версії з промісами для зручної роботи з async await
const fs = require("fs/promises");
// імпорт path для правильного створення шляхів
const path = require("path");
const { nanoid } = require("nanoid");

// створення абсолютного шляху; join нормалізує шлях (правильно розставляє / для різних ОС)
const contactsPath = path.join(__dirname, "./db/contacts.json");

const listContacts = async () => {
  // функція читає json-файл з контактами
  const data = await fs.readFile(contactsPath);
  // проганяємо через JSON.parse для отримання масиву об'єктів
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const contactId = String(id);
  // отримуємо всі контакти
  const contacts = await listContacts();
  // шукаємо потрібний контакт
  const result = contacts.find((el) => el.id === contactId);
  // якщо шукати неіснуючу книгу, то повернеться underfind; база данних, якщо не знаходить дані, повертає null
  return result || null;
};

const addContact = async (name, email, phone) => {
  // отримуємо всі контакти
  const contacts = await listContacts();
  // створюємо новий контакт
  const newContact = {
    name,
    email,
    phone,
    id: nanoid(),
  };
  // в масив контактів додаємо новий контакт
  contacts.push(newContact);
  // повністю перезаписуємо json
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  // повертаємо новий контакт
  return newContact;
};

const removeContact = async (id) => {
  const contactId = String(id);
  // отримуємо всі контакти
  const contacts = await listContacts();
  // шукаємо індекс контакту, який треба видалити
  const index = contacts.findIndex((el) => el.id === contactId);
  // якщо findIndex не знаходить, то він повертає -1
  if (index === -1) {
    return null;
  }
  // splice вирізає контакт по індексу
  const [result] = contacts.splice(index, 1);
  // повністю перезаписуємо json
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const updateContact = async (id, data) => {
  // отримуємо всі контакти
  const contacts = await listContacts();
  // шукаємо індекс контакту, який треба оновити
  const index = contacts.findIndex((el) => el.id === id);
  // якщо findIndex не знаходить, то він повертає -1
  if (index === -1) {
    return null;
  }
  // якщо є індекс, повністю перезаписуэмо контакти
  contacts[index] = { id, ...data };
  // повністю перезаписуємо json
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
