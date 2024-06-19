'use client'
import { useState, useEffect } from 'react'
import { Contract, ethers } from 'ethers'
import contractJson from '../../contract.json'

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

const getPrivatePosts = async (creator, user, signature) => {
	let res = await fetch(`/api/posts/${creator}`, {
		headers: {
			Accept: 'application/json',
			OF_CRYPTO_SIG: signature,
			OF_CRYPTO_USER: user,
		},
	})
	res = await res.json()
	return res.data
}

export default function Creator({ params }) {
	const [creator, setCreator] = useState(undefined)
	const [signature, setSignature] = useState(undefined)
	const [signer, setSigner] = useState(undefined)
	const [isPaidMember, setIsPaidMember] = useState(undefined)
	const [feedback, setFeedback] = useState(undefined)
	const [privatePosts, setPrivatePosts] = useState(undefined)

	useEffect(() => {
		const init = async () => {
			const creator = await getCreator(params.address)
			setCreator(creator)
		}
		init()
	}, [])

	useEffect(() => {
		const init = async () => {
			const privatePosts = await getPrivatePosts(
				creator.address,
				signer.address,
				signature
			)
			setPrivatePosts(privatePosts)
		}
		if (signature && isPaidMember) {
			init()
		}
	}, [signature, isPaidMember])

	const connect = async () => {
		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		setSigner(signer)
		const signature = await signer.signMessage(message)
		setSignature(signature)
		const contract = new ethers.Contract(
			contractJson.address,
			contractJson.abi,
			signer
		)
		// const res = await contract.members(creator.address, signer.address)
		setIsPaidMember(true)
	}

	const join = async () => {
		setFeedback('Transfer pending...')
		const contract = new ethers.Contract(
			contractJson.address,
			contractJson.abi,
			signer
		)
		try {
			const tx = await contract.join(creator.address, {
				value: ethers.parseEther('0.0001'),
			})
			const receipt = await tx.wait()
			setFeedback('Payment complete! Reload to see the private posts')
		} catch (e) {
			setFeedback('The payment failed. Please try again later')
		}
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

				{signature && !isPaidMember ? (
					<div>
						<h2>Become a paid member to unlock exclusive content</h2>
						<button
							type='submit'
							className='btn btn-primary mt-4'
							onClick={join}
						>
							Join
						</button>
					</div>
				) : null}
				{feedback ? (
					<div className='alert alert-primary mt-4'>{feedback}</div>
				) : null}
				{privatePosts ? (
					<div>
						<h2>Private posts</h2>
						<ul className='list-group'>
							{privatePosts.map(post => (
								<li className='list-group-item' key={post.id}>
									{post.content}
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</main>
	)
}
