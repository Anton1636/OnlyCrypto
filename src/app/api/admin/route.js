const fs = require('fs')
import { ethers } from 'ethers'
import { headers } from 'next/headers'

const message = 'ONLY_CRYPTO'

export async function POST(req) {
	const headerList = headers()
	const user = headersList.get('OF_CRYPTO_USER')
	const signature = headersList.get('OF_CRYPTO_SIG')
	const recoveredAddress = ethers.verifyMessage(message, signature)

	if (recoveredAddress !== user) {
		return Response.json({ status: 401 })
	}

	let creators = fs.readFileSync('./src/app/creators.json', 'utf8')
	creators = JSON.parse(creators)
	const body = await req.json()
	creators[user].description = body.description
	fs.writeFileSync('./src/app/creators.json', JSON.stringify(creators), 'utf8')

	return Response.json({ status: 201 })
}
