const fs = require('fs')

export async function GET(_, { params }) {
	let creators = fs.readFileSync('./src/app/creators.json', 'utf-8')
	creators = Object.values(JSON.parse(creators))
	const creator = creator.find(creator => creator.address === params.address)

	return Response.json({ creator }, { status: 200 })
}
