'use client'
import { Signature } from 'ethers'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const message = 'ONLY_CRYPTO'

export default function Admin({ params }) {
	const [signature, setSignature] = useState(undefined)
	const [signer, setSigner] = useState(undefined)
	const [feedback, setFeedback] = useState(undefined)
	const [description, setDescription] = useState(undefined)

	const getCreator = async address => {
		let res = await fetch(`/api/creators/${address}`, {
			headers: {
				Accept: 'application/json',
			},
		})

		res = await res.json()
		return res.creator
	}

	useEffect(() => {
		const init = async () => {
			const creator = await getCreator(signer.address)
			setDescription(creator.description)
		}
		if (signer && signature) {
			init()
		}
	}, [signature, signer])

	const connect = async () => {
		const provider = new ethers.BrowserProvider(window.ethereum)
		const signer = await provider.getSigner()
		setSigner(signer)
		const signature = await signer.signMessage(message)
		setSignature(signature)
	}

	const update = async e => {
		e.preventDefault()
		setFeedback('Update pending ...')
		let res = await fetch(`/api/admin`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				OF_CRYPTO_SIG: signature,
				OF_CRYPTO_USER: signer.address,
			},
			body: JSON.stringify({ description }),
		})
		setFeedback('Update finished.')
	}

	return (
		<main className='container text-center'>
			<div className='row'>
				<div className='main-col col d-flex flex-column justify-content-center'>
					<div id='header'>
						<h1>Only Crypto</h1>
						<p>Admin panel for creators.</p>
					</div>
				</div>
				{signature ? null : (
					<button
						type='submit'
						className='btn btn primary mt-4'
						onClick={connect}
					>
						Connect
					</button>
				)}
				{signature && description ? (
					<form>
						<div className='mb-3'>
							<label htmlFor='address' className='form-label'>
								Address
							</label>
							<input
								type='text'
								className='form-control'
								id='address'
								disabled
								value={signer.address}
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='description' className='form-label'>
								Description
							</label>
							<textarea
								className='form-control'
								id='description'
								rows='3'
								onChange={e => setDescription(e.target.value)}
							>
								{description}
							</textarea>
						</div>
						<button
							type='submit'
							className='btn btn-primary mt-4'
							onClick={e => update(e)}
						>
							Update
						</button>
					</form>
				) : null}
				{feedback ? (
					<div className='alert alert-primary mt-4' role='alert'>
						{feedback}
					</div>
				) : null}
			</div>
		</main>
	)
}
