'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const message = 'ONLY_CRYPTO'

const getCreator = async address => {
	let res = await fetch(`/src/app/api/creators/${address}`, {
		headers: {
			Accept: 'application/json',
		},
	})

	res = await res.json()
	return res.creator
}

export default function Creator({ params }) {
	const [creator, setCreator] = useState(undefined)
	const [signature, setSignature] = useState(undefined)
	const [signer, setSigner] = useState(undefined)

	useEffect(() => {
		const init = async () => {
			const creator = await getCreator(params.address)
			setCreator(creator)
		}
		init()
	}, [])

	const connect = async () => {
		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		setSigner(signer)
		const signature = await signer.signMessage(message)
		setSignature(signature)
	}

	return (
		<main className='container text-center'>
			<div className='row'>
				<div className='main-col col d-flex flex-column justify-content-center'>
					<div id='header'>
						<h1>Only Crypto</h1>
						<p>Access exclusive content from your favorite creator.</p>
					</div>
				</div>
				{creator ? (
					<ul className='list-group'>
						<li className='list-group-item'>Address: {creator.address}</li>
						<li className='list-group-item'>Name: {creator.name}</li>
						<li className='list-group-item'>
							Description: {creator.description}
						</li>
					</ul>
				) : null}
				{signature ? null : (
					<button
						type='submit'
						className='btn btn primary mt-4'
						onClick={connect}
					>
						Connect
					</button>
				)}
			</div>
		</main>
	)
}
