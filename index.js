const puppeteer = require('puppeteer')
const fs = require('fs')

const cotacao = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto('https://web.whatsapp.com/')

	const waitThisAtt = 'text/Programar'
	const groupWpp = await page.waitForSelector(waitThisAtt)
	groupWpp.click()
	const waitCotacao = '._22Msk'
	await page.waitForSelector(waitCotacao)

	const cotacaoList = await page.evaluate(async () => {
		let filterParams = 0

		const excluirCotacaoAntiga = (cotacao) => {
			if (cotacao.includes('xxx')) {
				filterParams++
			}
			if (filterParams === 0) {
				return cotacao
			}
		}

		const arrayToObject = (element) => {
			const arrayPosition = () => {
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
					.slice(
						sliceIndex('\n', arrayPositionN[0]) + 19,
						sliceIndex('\n', arrayPositionN[1])
					)
					.toUpperCase(),
				modelo: element
					.slice(
						sliceIndex('\n', arrayPositionN[1]) + 8,
						sliceIndex('\n', arrayPositionN[2])
					)
					.toUpperCase(),
				codInterno: element
					.slice(
						sliceIndex('\n', arrayPositionN[2]) + 16,
						sliceIndex('\n', arrayPositionN[3])
					)
					.toUpperCase(),
				cliente: element
					.slice(sliceIndex('\n', arrayPositionN[3]) + 9)
					.toUpperCase(),
			}
			return element
		}

		const nodeListCotacao = document.querySelectorAll(
			'div.ItfyB._3nbHh > div._22Msk > div.copyable-text > div > span.i0jNr.selectable-text.copyable-text > span'
		)
		const arrayCotacao = [...nodeListCotacao]
		const result = arrayCotacao
			.map(({ textContent }) => {
				return textContent
			})
			.reverse()
			.filter(excluirCotacaoAntiga)
			.map(arrayToObject)
		return result
	})
	fs.writeFile(
		'cotacao.json',
		JSON.stringify(cotacaoList, null, 4),
		(err) => {
			if (err) throw new Error('algo de errado')
		}
	)

	page.close()
}

cotacao()
