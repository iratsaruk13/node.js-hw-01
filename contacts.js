const fs = require("fs/promises");
const path = require("path");


const contactsPath = path.join(__dirname, "./db/contacts.json");

const listContacts = async () => {
const data = await fs.readFile(contactsPath);
return JSON.parse(data);
}

const getContactById = async (id) => {
const contactsId = String(id);
const contacts = await listContacts();
const result = contacts.find(el => el.id === contactsId);
return result || null;
}

const removeContact = async (id) => {
    const contactId = String(id);
    const contacts = await listContacts();
    const index = contacts.findIndex(el => el.id === contactId);
    if(index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;

}

const addContact = async (name, email, phone) => {
const contacts = await listContacts();
const newContact = {
    name, 
    email,
    phone,
    id: nanoid(), 
}
contacts.push(newContact)
await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}