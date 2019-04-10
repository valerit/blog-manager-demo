const keystone = require('keystone');
const Email = require('keystone-email');
const emailTemplatesPath = keystone.get('emails');

exports.sendEmail = function (data, req, res, next) {
  new Email(emailTemplatesPath + '<pug file>', { transport: 'mailgun' }).send(
    {
      recipient: {
        firstName: data.name.first,
        lastName: data.name.last,
      },
    },
    {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      subject: data.subject,
      to: data.toEmail,
      from: {
        name: data.fromName,
        email: data.fromEmail,
      },
    },
    function (err, result) {
      if (err) {
        if (next) return next(err);
      } else {
        console.log(result);
        if (res) return res.json({ success: true });
      }

      if (next) next();
    });
};
