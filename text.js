const array = [
	{
		cotacao:
			'Cotação\nCódigo de fábrica: 123456789 / 192999494 / 319289412894 / 124124124\nModelo: 42MAQA09S5\nCódigo interno: PCB011\nCliente: Jatobé',
	},
	{
		cotacao:
			'Cotação\nCódigo de fábrica: 987654321\nModelo: 42MAQA22S5\nCódigo interno: PCB091\nCliente: Paminondas',
	},
	{
		cotacao:
			'Cotação\nCódigo de fábrica: 123654-789\nModelo: 42MAQA18S5\nCódigo interno: PCB123\nCliente: Pablo escobar',
	},
]

const newArray = array.map((element) => {
	const arrayPosition = () => {
		const array = []
		for (let i = 0; i < element.cotacao.length; i++) {
			if (element.cotacao[i] == '\n') {
				array.push(i)
			}
		}
		console.log(array)
		return array
	}

	const arrayPositionN = arrayPosition()

	const sliceIndex = (str, start) => {
		return element.cotacao.indexOf(str, start)
	}

	element.cotacao = {
		codFabrica: element.cotacao.slice(
			sliceIndex('\n', arrayPositionN[0]) + 19,
			sliceIndex('\n', arrayPositionN[1])
		),
		modelo: element.cotacao.slice(
			sliceIndex('\n', arrayPositionN[1]) + 8,
			sliceIndex('\n', arrayPositionN[2])
		),
		codInterno: element.cotacao.slice(
			sliceIndex('\n', arrayPositionN[2]) + 16,
			sliceIndex('\n', arrayPositionN[3])
		),
		cliente: element.cotacao.slice(sliceIndex('\n', arrayPositionN[3]) + 9),
	}
	return element
})
// console.log(newArray)

const arrayReverse = [1, 2, 3, 4, 5, 6, 7, 8, 9]
arrayReverse.reverse().forEach((e) => console.log(e))
