// emailService.js
import emailjs from 'emailjs-com';

export const sendEmail = (body) => {
    const templateParams = {
        subject: 'Portfolio Contact',
        message: body,
        to_email: 'andyhuangling@gmail.com',
    };

    return emailjs.send('service_ssytwzb', 'template_6br7wwf', templateParams, 'Xdf-EzCuAFTzkw29S').then(
        (response) => {
            // console.log('SUCCESS!', response.status, response.text);
            return 'I have gotten your email! I will respond to your message as soon as possible! ٩(^ᗜ^ )و´-';
        },
        (error) => {
            // console.log('FAILED...', error);
            return 'Uh oh I am broken ૮(˶ㅠ︿ㅠ)ა ... In the meantime send me an email at andyhuangling@gmail.com!';
        }
    );
};
