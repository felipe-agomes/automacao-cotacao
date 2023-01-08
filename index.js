const puppeteer = require('puppeteer')
const xlsx = require('xlsx')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const emailPassword = process.env.EMAIL_PASSWORD
const emailUser = process.env.EMAIL_USER

const convertJsonToXlsx = async (json) => {
	const workSheet = xlsx.utils.json_to_sheet(json)
	const workBook = xlsx.utils.book_new()

	xlsx.utils.book_append_sheet(workBook, workSheet, 'Cotação')

	// arquivo xlsx gerado
	await xlsx.write(workBook, { bookType: 'xlsx', type: 'binary' })
	await xlsx.writeFile(workBook, 'cotacao.xlsx')
}

const sendEmail = async () => {
	// dados de transporte do email
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: '465',
		secure: true,
		auth: {
			user: emailUser,
			pass: emailPassword,
		},
	})

	// dados para enviar o email
	transporter.sendMail({
		from: `someone" <${emailUser}>`,
		to: emailUser,
		subject: 'Cotação', // titulo
		text: 'Hello world?', // texto do email
		attachments: {
			path: './cotacao.xlsx', // caminho relativo do arquivo
		},
	})
}

const sendCotacao = async () => {
	const browser = await puppeteer.launch({ headless: false }) // headless false para abrir o navegador, não utilizar true para whatsapp
	const page = await browser.newPage()
	await page.goto('https://web.whatsapp.com/')

	const waitThisAtt = 'text/Programar' // nome do grupo
	const groupWpp = await page.waitForSelector(waitThisAtt)
	groupWpp.click()
	const waitCotacao = 'text/xxxxx' // identificador de inicio da cotação
	await page.waitForSelector(waitCotacao, { timeout: 0 })

	const cotacaoList = await page.evaluate(async () => {
		let filterParams = 0

		const excluirCotacaoAntiga = (cotacao) => {
			// identificador de inicio da cotação
			if (cotacao.includes('xxxxx' || cotacao.includes('XXXXX'))) {
				filterParams++
			}
			if (filterParams === 0) {
				return cotacao
			}
		}

		const excluirNaoCotacao = (cotacao) => {
			if (cotacao.includes('Cliente')) {
				return cotacao
			}
		}

		const arrayToObject = (element) => {
			const arrayPosition = () => {
				// detectar a posição da quebra de linha
				const array = []
				for (let i = 0; i < element.length; i++) {
					if (element[i] == '\n') {
						array.push(i)
					}
				}
				return array
			}
			const arrayPositionN = arrayPosition()

			const sliceIndex = (str, start) => {
				return element.indexOf(str, start)
			}

			element = {
				codFabrica: element
					.slice(15, sliceIndex('\n', arrayPositionN[0]))
					.toUpperCase(),
				modelo: element
					.slice(
						sliceIndex('\n', arrayPositionN[0]) + 8,
						sliceIndex('\n', arrayPositionN[1])
					)
					.toUpperCase(),
				codInterno: element
					.slice(
						sliceIndex('\n', arrayPositionN[1]) + 16,
						sliceIndex('\n', arrayPositionN[2])
					)
					.toUpperCase(),
				cliente: element
					.slice(sliceIndex('\n', arrayPositionN[2]) + 9)
					.toUpperCase(),
			}
			return element
		}

		const nodeListMsg = document.querySelectorAll(
			'div.ItfyB._3nbHh > div._22Msk > div.copyable-text > div > span.i0jNr.selectable-text.copyable-text > span'
		)
		const arrayMsg = [...nodeListMsg]

		// transformar array em objeto, e retirar cotações antes do marcador de inicio da cotação
		const result = arrayMsg
			.map(({ textContent }) => {
				return textContent
			})
			.reverse()
			.filter(excluirCotacaoAntiga)
			.filter(excluirNaoCotacao)
			.map(arrayToObject)

		return result
	})
	page.close()

	convertJsonToXlsx(cotacaoList)

	sendEmail().catch(console.error)
}

sendCotacao()
