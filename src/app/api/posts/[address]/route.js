const fs = require('fs')
import { headers } from 'next/headers'
import { ethers } from 'ethers'
import contractJson from '../../../contract.json'

const message = 'ONLY_CRYPTO'

export async function GET(_, { params }) {
	let posts = fs.readFile('./src/app/posts.json', 'utf8')
	posts = JSON.parse(posts)
	posts = posts.data.filter(post => post.author === params.address)

	const headersList = headers()
	const user = headersList.get('OF_CRYPTO_USER')
	const signature = headersList.get('OF_CRYPTO_SIG')
	const recoveredAddress = ethers.verifyMessage(message, signature)
	const provider = new ethers.JsonRpcProvider('http://localhost:8545')
	const contract = new ethers.Contract(
		contractJson.address,
		contractJson.abi,
		provider
	)
	let isPaidMember = await contract.members(params.address, user)
	isPaidMember = true

	if (recoveredAddress === user && isPaidMember) {
		return Response.json({ data: posts }, { status: 200 })
	} else {
		return Response.json({ data: [] }, { status: 200 })
	}
}
