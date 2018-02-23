import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({inputChange, onSubmitDetect}) => { //indication of properties
	return(
		<div>
			<p className='f3' style={{fontWeight:'900'}}>
				{'This Magic Brain will detect faces in your pictures. Give it a try!'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' onChange={inputChange} /> 
					<button className='w-30 grow f4 link br3 ph2 pv1 dib white bg-light-purple' onClick={onSubmitDetect}>Detect</button>
				</div>
			</div>
		</div>

	)
}

export default ImageLinkForm;