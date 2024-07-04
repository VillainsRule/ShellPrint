import axios from 'axios';
import fs from 'fs';

class Mail {
    address;
    token;
    cookie;
    verified = false;

    constructor() { };

    createAccount = async () => {
        let verification = await axios.get('https://tempmailo.com');
        this.token = verification.data.match(/value="(.*?)"/)[1];
        this.cookie = verification.headers['set-cookie'][0].split('; ')[0];

        let address = await axios.get('https://tempmailo.com/changemail', {
            headers: {
                requestverificationtoken: this.token,
                cookie: this.cookie
            }
        });

        this.address = address.data;
        return this.address;
    };

    waitForEmail = () => new Promise(async (resolve, reject) => {
        if (this.verified) return resolve();

        const check = async () => {
            let emails = await axios.post('https://tempmailo.com/', { mail: this.address }, {
                headers: {
                    requestverificationtoken: this.token,
                    cookie: this.cookie
                }
            });

            if (emails.data.length > 0) {
                let email = emails.data[0];
                if (email.from !== 'noreply@shellshock.io') return setTimeout(async () => await check(), 1000);

                let link = email.text.match(/http(.*?)en/)[0];
                let oob = link.match(/oobCode=(.*?)&/)?.[1] || link.match(/oobCode=(.*?)/)?.[1];

                let identity = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=AIzaSyDP4SIjKaw6A4c-zvfYxICpbEjn1rRnN50', { oobCode: oob }, {
                    headers: {
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.9',
                        'x-client-data': 'CIm2yQEIorbJAQipncoBCMfqygEIlKHLAQid/swBCIagzQEIqoLOARj0yc0BGNGCzgEY642lFw==',
                        'x-client-version': 'Chrome/JsCore/3.7.5/FirebaseCore-web',
                        Referer: 'https://shellshockio-181719.firebaseapp.com/',
                        'Referrer-Policy': 'strict-origin-when-cross-origin'
                    }
                });

                if (identity.data.emailVerified) {
                    this.verified = true;
                    console.log(`Verified email "${this.address}"!`);

                    let accounts = JSON.parse(fs.readFileSync('./data/accounts.json'));
                    accounts.find(a => a.email === this.address).verified = true;
                    fs.writeFileSync('./data/accounts.json', JSON.stringify(accounts, null, 4));

                    resolve();
                } else console.log(`Failed to verify email "${this.address}", data:`, identity.data);
            } else setTimeout(async () => await check(), 2500);
        };

        await check();
    });
};

export default Mail;