const nodemailer = require('nodemailer')
const { linkStart } = require('./mail')

jest.mock('nodemailer')

describe('linkStart', () => {
    let sendMailMock

    beforeAll(() => {
        sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-id' })
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })
    })

    it('should send an email with the correct parameters', async () => {
        await linkStart('Slyder')

        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
        expect(sendMailMock).toHaveBeenCalledTimes(1)
        const mailOptions = sendMailMock.mock.calls[0][0]
        expect(mailOptions.from).toBe(process.env.EMAIL_USER)
        expect(mailOptions.subject).toBe('Test avec template HTML')
        expect(mailOptions.html).toContain('Slyder')
    })

    it('should handle errors gracefully', async () => {
        sendMailMock.mockRejectedValueOnce(new Error('SMTP error'))
        await expect(linkStart('Slyder')).resolves.toBeUndefined()
    })
})
